import { redis } from "@/app/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";

const rooms = new Elysia({ prefix: "/room" })
  .post("/create", async () => {
    const roomId = nanoid();
    const ROOM_TTL = 60 * 2;

    const res = await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

    console.log({ apires: res });

    await redis.expire(`meta:${roomId}`, ROOM_TTL);

    return { roomId };
  })
  .get("/:id", async ({ params }) => {
    const roomId = params.id as string;
    const room = await redis.hgetall<{
      connected: string[];
      createdAt: number;
    }>(`meta:${roomId}`);

    if (!room || !room.connected) {
      return new Response(JSON.stringify({ error: "room-not-found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(room), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });

const app = new Elysia({ prefix: "/api" }).use(rooms);

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
