'use client';

import { formatTimeRemaining } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { SendHorizontal, Terminal, VenetianMask } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function page() {
  const { id } = useParams();
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const res = await fetch(`/api/room/${id}`);

      if (!res.ok) {
        throw new Error((await res.json()).error || 'failed to fetch room');
      }
      const data: { connected: string[]; createdAt: number } = await res.json();
      const now = new Date();
      setTimeRemaining(Math.floor((data.createdAt + 120 * 1000 - now.getTime()) / 1000));
      return data;
    },
  });

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

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
          <h1 className="align-center gap-4 text-start text-2xl text-green-400">
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

  return (
    <main className="col h-screen max-h-screen overflow-hidden">
      <header className="flex-between border-b border-zinc-800 bg-zinc-900/30 p-4">
        <div className="align-center gap-4">
          <div className="col">
            <span className="text-xs text-zinc-500 uppercase">Room Id</span>
            <div className="align-center gap-2">
              <span className="font-bold text-green-500">roomId</span>
              <button
                onClick={copyLink}
                className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="col">
            <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
            <span
              className={`align-center gap-2 text-sm font-bold ${timeRemaining !== null && timeRemaining < 60 ? 'text-red-500' : 'text-amber-500'}`}
            >
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : '--:--'}
            </span>
          </div>
        </div>

        <button className="bbg-zinc-800 5 group align-center disabled:opacty-50 gap-2 rounded px-3 py-1 text-xs font-bold text-zinc-400 transition-all hover:bg-red-600 hover:text-white">
          <span className="group-hover:animate-pulse">💣</span> Destroy Room
        </button>
      </header>

      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"></div>
      <div className="border-t border-zinc-800 bg-zinc-900/30 p-4">
        <form className="flex gap-4">
          <div className="group relative flex-1">
            <span className="abs-center left-4 animate-pulse text-green-500">
              <Terminal />
            </span>
            <input
              type="text"
              autoFocus
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
