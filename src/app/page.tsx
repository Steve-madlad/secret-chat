"use client";

import { useEffect, useState } from "react";
import { generateRandomName } from "./lib/functions";

export default function Home() {
  const [username, setUsername] = useState("");

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

  return (
    <main className="flex min-h-screen flex-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-light text-green-500">Private Chat
          <VenetianMask />
        </h1>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="align-center text zinc 500">
                Your Identity
              </label>

              <div className="align-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-300 font-mono">
                  {username || "..."}
                </div>
              </div>
            </div>

            <button className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor disabled:opacity-50">
              Create Secure Room
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
