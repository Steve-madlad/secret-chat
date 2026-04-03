import { NextRequest, NextResponse } from 'next/server';
import { redis } from './app/lib/redis';
import { nanoid } from 'nanoid';

export type Room = {
  connected: string[];
  createdAt: number;
};

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const roomMatch = pathname.match(/\/room\/([^\/]+)/);
  if (!roomMatch) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const roomId = roomMatch[1];
  let room: Room | null;
  try {
    room = await redis.hgetall<Room>(`meta:${roomId}`);
  } catch (error) {
    return NextResponse.redirect(new URL('/?error=failed-to-create-room', req.url));
  }

  if (!room) {
    const response = NextResponse.redirect(new URL('/?error=room-not-found  ', req.url));
    response.cookies.delete('x-auth-token');
    return response;
  }

  const nextResponse = NextResponse.next();

  const existingToken = req.cookies.get('x-auth-token')?.value;
  const token = existingToken || nanoid();

  nextResponse.cookies.set('x-auth-token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(room.createdAt + 120 * 1000),
  });

  if (existingToken && room.connected.includes(existingToken)) return nextResponse;

  if (room.connected.length >= 2) {
    const response = NextResponse.redirect(new URL('/?error=room-is-full', req.url));
    response.cookies.delete('x-auth-token');
    return response;
  }

  try {
    await redis.hset(`meta:${roomId}`, {
      connected: [...room?.connected, token],
    });
    return nextResponse;
  } catch (error) {
    return NextResponse.redirect(new URL('/?error=failed-to-connect', req.url));
  }
}

export const config = {
  matcher: '/room/:path*',
};
