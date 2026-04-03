"use client";

import { formatTimeRemaining } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SendHorizontal, Terminal, VenetianMask } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const { id } = useParams();
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const res = await fetch(`/api/room/${id}`);

      if (!res.ok) {
        throw new Error((await res.json()).error || "failed to fetch room");
      }
      const data: { connected: string[]; createdAt: number } = await res.json();
      const now = new Date();
      setTimeRemaining(
        Math.floor((data.createdAt + 120 * 1000 - now.getTime()) / 1000),
      );
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
        <div className="bg-chart-5 px-10 p-6 border-slate-300 col gap-3 text-white">
          <h1 className="text-green-400 text-2xl text-start align-center gap-4">Private Chat <VenetianMask size={28}/></h1>
          <p>Failed to fetch room :(</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white px-20 p-3 text-primary cursor"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="col h-screen max-h-screen overflow-hidden">
      <header className="border-b border-zinc-800 p-4 flex-between bg-zinc-900/30">
        <div className="align-center gap-4">
          <div className="col">
            <span className="text-xs text-zinc-500 uppercase">Room Id</span>
            <div className="align-center gap-2">
              <span className="font-bold text-green-500">roomId</span>
              <button
                onClick={copyLink}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="col">
            <span className="text-xs text-zinc-500 uppercase">
              Self-Destruct
            </span>
            <span
              className={`text-sm font-bold align-center gap-2 ${timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"}`}
            >
              {timeRemaining !== null
                ? formatTimeRemaining(timeRemaining)
                : "--:--"}
            </span>
          </div>
        </div>

        <button className="text-xs bbg-zinc-800 hover:bg-red-600 px-3 py-1 5 rounded text-zinc-400 hover:text-white font-bold transition-all group align-center gap-2 disabled:opacty-50">
          <span className="group-hover:animate-pulse">💣</span> Destroy Room
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"></div>
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <form className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="abs-center left-4 text-green-500 animate-pulse">
              <Terminal />
            </span>
            <input
              type="text"
              autoFocus
              value={inputValue}
              placeholder="Your message..."
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-12 pr-4 text-sm"
            />
          </div>
          <button className="bg-zinc-800 flex-center gap-2 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor">
            SEND <SendHorizontal size={15} />
          </button>
        </form>
      </div>
    </main>
  );
}
