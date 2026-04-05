'use client';

import { Kbd } from '@/components/ui/kbd';
import { client } from '@/lib/client';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2, Terminal, VenetianMask } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUsername from './hooks/useUsername';

export default function Home() {
  const router = useRouter();
  const { username } = useUsername();

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

  return (
    <main className="flex-center flex min-h-screen p-4">
      <div className="space-y-8">
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

            <button
              onClick={() => createRoom()}
              disabled={isPending || isSuccess}
              className={clsx(
                `${isPending ? 'animate-pulse cursor-default!' : ''}`,
                'cursor mt-2 w-full bg-zinc-100 p-3 text-sm font-bold text-black transition-colors hover:bg-zinc-50 hover:text-black',
              )}
            >
              {isPending ? (
                <div className="flex-center gap-2">
                  Creating Room <Loader2 size={15} className="animate-spin" />
                </div>
              ) : isSuccess ? (
                'Entering prvate room...'
              ) : (
                <>
                  Create Secure Room <Kbd className="bg-dark rounded-xs">⏎</Kbd>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
