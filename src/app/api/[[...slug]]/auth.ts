import { type Room } from '@/app/types/index';
import { AuthError } from '@/lib/errors/auth-error';
import { redis } from '@/lib/redis';
import Elysia from 'elysia';

export const authMiddleware = new Elysia({ name: 'auth' }).derive(
  { as: 'scoped' },
  async ({ query, cookie }) => {
    const roomId = query['roomId'];
    const token = cookie['x-auth-token']?.value as string | undefined;

    if (!roomId || !token) {
      throw new AuthError('Missing roomId or token');
    }

    const connected: Room['connected'] | null = await redis.hget(`meta:${roomId}`, 'connected');
    if (!connected?.includes(token)) {
      throw new AuthError('Valid token not found');
    }

    return { auth: { roomId, token, connected } };
  },
);
