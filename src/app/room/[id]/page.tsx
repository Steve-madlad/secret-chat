'use client';

import useUsername from '@/app/hooks/useUsername';
import { DestryRoomDialog } from '@/components/custom/alert-dialog';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/client';
import { useRealtime } from '@/lib/realtime-client';
import { formatTimeRemaining } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Check,
  ClockFading,
  Copy,
  Dot,
  Link2,
  SendHorizontal,
  Terminal,
  VenetianMask,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Room() {
  const { id: roomId } = useParams();
  const { username } = useUsername();
  const router = useRouter();

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const ttl = Number(process.env['NEXT_PUBLIC_ROOM_TTL']);
  const { isLoading, isError } = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const res = await client.api.room.get({
        query: { roomId: roomId as string },
      });
      const data = res.data;

      if (res.status === 404 || !data) {
        router.replace('/?error=room-expired');
        return null;
      }

      if (!res.response.ok) {
        throw new Error('Failed to fetch room');
      }
      const now = new Date();
      setTimeRemaining(Math.floor((data.createdAt + ttl * 1000 - now.getTime()) / 1000));

      return data;
    },
  });

  const { data: messageData, refetch } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const res = await client.api.messages.get({
        query: { roomId: roomId as string },
      });

      return res.data;
    },
  });

  useRealtime({
    channels: [roomId as string],
    events: ['chat.destroy', 'chat.message'],
    onData: ({ event }) => {
      switch (event) {
        case 'chat.message':
          refetch();
          break;
        case 'chat.destroy':
          router.replace('/?destroyed=room-is-destroyed');
          break;
        default:
          break;
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.api.messages.post(
        {
          sender: username,
          text: inputValue.trim(),
        },
        {
          query: {
            roomId: roomId as string,
          },
        },
      );

      return res;
    },
  });

  const { mutate: destroyRoom, isPending: isDestroying } = useMutation({
    mutationFn: async () => {
      await client.api.room.destroy.delete(undefined, {
        query: {
          roomId: roomId as string,
        },
      });
    },
  });

  useEffect(() => {
    if (timeRemaining === null) return;
    if (!isLoading && timeRemaining <= 0) {
      router.replace(`/`);
      return;
    }

    const countdown = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeRemaining, isLoading]);

  if (isError) {
    return (
      <div className="flex-center h-screen">
        <div className="bg-chart-5 col gap-3 border-slate-300 p-6 px-10 text-white">
          <h1 className="align-center gap-4 text-start text-2xl text-green-500">
            Private Chat <VenetianMask size={28} />
          </h1>
          <p>Failed to fetch room :(</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary cursor bg-white p-3 px-20"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  const sendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    if (inputValue.trim() !== '') mutate();
    setInputValue('');
  };

  return (
    <main className="col h-screen max-h-screen overflow-hidden">
      <header className="flex-between border-b border-zinc-800 bg-zinc-900/30 p-4">
        <div className="align-center gap-4">
          <div className="col">
            <span className="text-xs text-zinc-500 uppercase">Room Id</span>
            <div className="align-center gap-2">
              <span className="align-center gap-2 text-sm font-bold text-green-500">
                <Link2 size={20} /> Room Link
              </span>
              <Button
                onClick={copyLink}
                className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </Button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="col">
            <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
            <span
              className={`align-center gap-2 text-sm font-bold ${timeRemaining === null && 'animate-pulse'} ${timeRemaining !== null && timeRemaining < 60 ? 'text-red-500' : 'text-amber-500'}`}
            >
              <ClockFading
                size={13}
                className={`${timeRemaining !== null && timeRemaining <= 60 && 'animate-caret-blink'}`}
              />
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : '--:--'}
            </span>
          </div>
        </div>

        <DestryRoomDialog disabled={isLoading} isLoading={isDestroying} onDestroyRoom={destroyRoom} />
      </header>

      <div
        style={{ colorScheme: 'dark' }}
        className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-4"
      >
        {messageData?.messages?.map((message) => (
          <PrivateMessage
            key={message.id}
            text={message.text}
            username={message.sender}
            timestamp={message.timestamp}
            isCurrentuser={message.sender === username}
          />
        ))}
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900/30 p-4">
        <form className="flex gap-4" onSubmit={sendMessage}>
          <div className="group relative flex-1">
            <span className="abs-center left-4 animate-pulse text-green-500">
              <Terminal />
            </span>
            <input
              type="text"
              autoFocus
              name="message"
              value={inputValue}
              placeholder="Your message..."
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border border-zinc-800 bg-black py-3 pr-4 pl-12 text-sm text-zinc-100 transition-colors placeholder:text-zinc-700 focus:border-zinc-700 focus:outline-none"
            />
          </div>
          <button className="flex-center cursor gap-2 bg-zinc-800 px-6 text-sm font-bold text-zinc-400 transition-all hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50">
            SEND <SendHorizontal size={15} />
          </button>
        </form>
      </div>
    </main>
  );
}

function PrivateMessage({
  text,
  username,
  timestamp,
  isCurrentuser,
}: {
  text: string;
  username: string;
  timestamp: number;
  isCurrentuser: boolean;
}) {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedTime = date.toLocaleTimeString('en-US', options);

  return (
    <div>
      <div className="flex">
        <p className={`${isCurrentuser ? 'text-green-500' : 'text-blue-500'} text-xs`}>
          {isCurrentuser ? 'You' : username}
        </p>
        <p className="align-center -translate-y-0.75 text-xs text-zinc-600">
          <Dot />
          {formattedTime}
        </p>
      </div>
      <p className="text-secondary -translate-y-1">{text}</p>
    </div>
  );
}
