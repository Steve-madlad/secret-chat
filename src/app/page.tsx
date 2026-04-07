'use client';

import { Alert } from '@/components/custom/alert';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/client';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { HatGlasses, Loader2, Terminal, VenetianMask } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUsername from './hooks/useUsername';

type ErrorTypes =
  | 'room-not-found'
  | 'room-is-full'
  | 'room-expired'
  | 'room-is-destroyed'
  | 'failed-to-create-room'
  | 'failed-to-join-room';

export default function Home() {
  const router = useRouter();
  const searchparam = useSearchParams();
  const { username } = useUsername();
  const error: ErrorTypes =
    (searchparam.get('error') as ErrorTypes) || searchparam.get('destroyed');
  const [showError, setShowError] = useState<boolean>(false);
  const [currentError, setCurrentError] = useState<ErrorTypes | null>(null);

  useEffect(() => {
    if (error && !currentError) {
      setCurrentError(error);
      setShowError(true);

      const newSearchParams = new URLSearchParams(searchparam);
      newSearchParams.delete('error');
      newSearchParams.delete('destroyed');
      const newUrl = newSearchParams.toString() ? `/?${newSearchParams.toString()}` : '/';
      router.replace(newUrl);
    }
  }, [error, currentError, searchparam, router]);

  const {
    mutate: createRoom,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const res = await client.api.room.create.post();

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
      return res;
    },
  });

  const errorMapping: Record<ErrorTypes, { title: string; description: string }> = {
    'room-not-found': {
      title: 'Room not found',
      description: 'The room you are looking for does not exist.',
    },
    'room-is-full': {
      title: 'Room is full',
      description: 'The room you are looking for is full.',
    },
    'room-expired': {
      title: 'Room has expired',
      description: 'The room you are looking for has expired.',
    },
    'room-is-destroyed': {
      title: 'Room is destroyed',
      description: 'The room has been destroyed.',
    },
    'failed-to-create-room': {
      title: 'Failed to create room',
      description: 'Failed to create room. Try again.',
    },
    'failed-to-join-room': {
      title: 'Failed to join room',
      description: 'Failed to join room.',
    },
  };

  return (
    <main className="flex-center flex min-h-screen p-4">
      <div className="space-y-8">
        {currentError && showError && (
          <Alert
            className="w-full"
            title={errorMapping[currentError]?.title}
            description={errorMapping[currentError]?.description}
            onCLose={() => {
              setShowError(false);
              setCurrentError(null);
            }}
          />
        )}
        <div className="space-y-6 border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="just-between items-start text-green-500">
            <div className="space-y-2">
              <h1 className="align-center tracking-light gap-2 text-2xl font-bold">
                Private Chat <VenetianMask size={30} />
              </h1>
              <p className="text-zinc-500">A private🔒, self-destructing🧨 chat room.</p>
            </div>
            <Terminal size={30} />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="align-center text zinc 500 text-white">Your Identity</label>

              <div className="align-center gap-3">
                <div className="flex-1 border border-zinc-800 bg-zinc-950 p-3 font-mono text-sm text-zinc-300">
                  {username || '...'}
                </div>
              </div>
            </div>

            <Button
              onClick={() => createRoom()}
              disabled={isPending || isSuccess}
              className={clsx(
                `${isPending ? 'animate-pulse cursor-default!' : ''}`,
                'cursor mt-2 w-full gap-3 bg-zinc-100 p-3 py-5 text-sm font-bold text-black transition-colors hover:bg-zinc-300 hover:text-black focus-visible:bg-zinc-300',
              )}
            >
              {isPending ? (
                <div className="flex-center gap-2">
                  Creating Room <Loader2 size={15} className="animate-spin" />
                </div>
              ) : isSuccess ? (
                'Entering private room...'
              ) : (
                <>
                  Create Secure Room <HatGlasses className="size-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
