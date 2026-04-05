import type { Message, Room } from '@/app/types/index';
import { AuthError } from '@/lib/errors/auth-error';
import { realtime } from '@/lib/realtime';
import { redis } from '@/lib/redis';
import { Elysia, NotFoundError } from 'elysia';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { authMiddleware } from './auth';

const rooms = new Elysia({ prefix: '/room' })
  .post('/create', async () => {
    const roomId = nanoid();
    const ROOM_TTL = Number(process.env['NEXT_PUBLIC_ROOM_TTL']);

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });
    await redis.expire(`meta:${roomId}`, ROOM_TTL);

    return { roomId };
  })
  .get('/:id', async ({ params }) => {
    const roomId = params.id as string;
    const room = await redis.hgetall<Room>(`meta:${roomId}`);

    if (!room || !room.connected) {
      throw new NotFoundError('Room not found');
    }

    return room;
  });

const messages = new Elysia({ prefix: '/messages' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, auth }) => {
      const { sender, text } = body;
      const { roomId, token } = auth;

      const roomExists = await redis.exists(`meta:${roomId}`);
      if (!roomExists) {
        throw new Error('Room does not exist');
      }

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
      };

      await redis.rpush(`messages:${roomId}`, { ...message, token });
      await realtime.channel(roomId).emit('chat.message', message);

      const remaining = await redis.ttl(`meta:${roomId}`);

      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(`history:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
      }),
    },
  )
  .get('/', async ({ auth }) => {
    const { roomId, token } = auth;

    const messages = await redis.lrange<Message>(`messages:${roomId}`, 0, -1);
    return {
      messages: messages.map((m) => ({
        ...m,
        ...(token === m.token ? { token } : {}),
      })),
    };
  });

const app = new Elysia({ prefix: '/api' })
  .error({ AuthError })
  .onError(({ code, error, set }) => {
    if (code === 'AuthError') {
      set.status = 401;
      return { error: error.message };
    }
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: error.message };
    }

    console.log({ code });

    set.status = 500;
    return { error: 'Internal Server Error' };
  })
  .use(rooms)
  .use(messages);

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
