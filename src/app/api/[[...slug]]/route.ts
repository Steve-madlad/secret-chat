import { redis } from "@/app/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authMiddleware } from "./auth";

const rooms = new Elysia({ prefix: "/room" })
  .post("/create", async () => {
    const roomId = nanoid();
    const ROOM_TTL = 60 * 2;

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

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

const messages = new Elysia({ prefix: "/messages" }).use(authMiddleware).post(
  "/",
  async ({ body, auth }) => {
    const { sender, text } = body;

    const roomExists = await redis.exists(`meta:${auth.roomId}`);
    if (!roomExists) {
      throw new Error("Room does not exist");
    }
  },
  {
    query: z.object({ roomId: z.string() }),
    body: z.object({
      sender: z.string().max(100),
      text: z.string().max(1000),
    }),
  },
);
const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
