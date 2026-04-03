"use client";

import { Kbd } from "@/components/ui/kbd";
import { client } from "@/lib/client";
import { generateRandomName } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Loader2, Terminal, VenetianMask } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const storageKey = "chatUsr";

  useEffect(() => {
    const usr = localStorage.getItem(storageKey);
    if (usr) {
      setUsername(usr);
      return;
    } else {
      const generatedName = generateRandomName();
      localStorage.setItem(storageKey, generatedName);
      setUsername(generatedName);
    }
  }, []);

  const {
    mutate: createRoom,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await client.api.room.create.post();

      console.log({res});
      

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
      return res;
    },
  });

  console.log({ error });

  return (
    <main className="flex min-h-screen flex-center p-4">
      <div className="space-y-8">
        <div className="border space-y-6 border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="just-between items-start text-green-500">
            <div className="space-y-2">
              <h1 className="text-2xl align-center gap-2 font-bold tracking-light">
                Private Chat <VenetianMask size={30} />
              </h1>
              <p className="text-zinc-500">
                A private🔒, self-destructing🧨 chat room.
              </p>
            </div>
            <Terminal size={30} />
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="align-center text zinc 500 text-white">
                Your Identity
              </label>

              <div className="align-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-300 font-mono">
                  {username || "..."}
                </div>
              </div>
            </div>

            <button
              onClick={() => createRoom()}
              disabled={isPending}
              className={clsx(
                `${isPending ? "animate-pulse cursor-default!" : ""}`,
                "w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor",
              )}
            >
              {isPending ? (
                <div className="flex-center gap-2">
                  Creating Room <Loader2 size={15} className="animate-spin" />
                </div>
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
