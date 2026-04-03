import { NextRequest, NextResponse } from "next/server";
import { redis } from "./app/lib/redis";
import { nanoid } from "nanoid";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const roomMatch = pathname.match(/\/room\/([^\/]+)/);

  if (!roomMatch) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const roomId = roomMatch[1];
  let room;
  try {
    room = await redis.hgetall<{ connected: string[]; createdAt: number }>(
      `meta:${roomId}`,
    );
  } catch (error) {
    return NextResponse.redirect(new URL("/?error=failed-to-create-room", req.url));
  }

  const nextResponse = NextResponse.next();

  const cookie = req.cookies.get("x-auth-token");
  const token = String(cookie?.value || nanoid());
  console.log({ room, token });

  if (!room) {
    const response = NextResponse.redirect(
      new URL("/?error=room-not-found  ", req.url),
    );
    response.cookies.delete("x-auth-token");
    return response;
  } else {
    const connected = room.connected;

    if (!connected.includes(token)) {
      if (connected.length < 2) {
        nextResponse.cookies.set("x-auth-token", token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        console.log("adding", { token });

        try {
          await redis.hset(`meta:${roomId}`, {
            connected: [...connected, token],
          });
        } catch (error) {
          return NextResponse.redirect(new URL("/?error=failed-to-connect", req.url));
        }
      } else {
        const response = NextResponse.redirect(
          new URL("/?error=room-is-full", req.url),
        );
        response.cookies.delete("x-auth-token");
        return response;
      }
    }
    return nextResponse;
  }
}

export const config = {
  matcher: "/room/:path*",
};
