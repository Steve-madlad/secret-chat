# Private Chat

Private Chat is a web app for creating temporary, invite-only chat rooms. Create a room, share its link or ID, and chat with one other participant in real time. Rooms and their messages expire after the configured lifetime, and either participant can destroy a room early.

## Features

- Create a private room and share its URL or room ID.
- Join an existing room using its ID. Rooms support up to two participants.
- Send messages and receive updates in real time.
- See a countdown to room expiration and destroy the room at any time.
- Use an automatically generated display name, saved in the browser.
- Authenticate room access with an HTTP-only cookie.

> Room messages are stored in Upstash Redis for the room's lifetime. This app is designed for temporary conversations; do not use it to exchange information that requires a security or privacy guarantee.

## Technology stack

Badges show the dependency version specifications from `package.json`.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-20232a?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%5E4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Elysia](https://img.shields.io/badge/Elysia-%5E1.4.28-8B5CF6?style=for-the-badge)](https://elysiajs.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-%5E1.37.0-00E9A3?style=for-the-badge&logo=upstash&logoColor=black)](https://upstash.com/)
[![Upstash Realtime](https://img.shields.io/badge/Upstash_Realtime-%5E1.0.3-00E9A3?style=for-the-badge&logo=upstash&logoColor=black)](https://upstash.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-%5E5.96.1-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zod](https://img.shields.io/badge/Zod-%5E4.3.6-3E67B1?style=for-the-badge)](https://zod.dev/)

## Requirements

- [Bun](https://bun.sh/) or another package manager that supports the included `package.json` scripts.
- An [Upstash Redis](https://upstash.com/) database with REST credentials. Redis stores room membership and messages and handles expiration.

## Getting started

1. Install dependencies:

   ```bash
   bun install
   ```

   You can use `npm install` or `pnpm install` if you prefer.

2. Copy `.env.example` to `.env.local` in the project root. Replace the Upstash placeholders with your database REST credentials. Keep real credentials in `.env.local`; do not commit them.

   ```bash
   cp .env.example .env.local
   ```

   `NEXT_PUBLIC_ROOM_TTL` is the room lifetime in seconds. `NEXT_PUBLIC_ENVIRONMENT` is the app's base URL; use `http://localhost:3000` for local development.

3. Start the development server:

   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), create a room, and share its link with one other participant.

## Available scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the Next.js development server. |
| `bun run build` | Create a production build. |
| `bun start` | Run the production server (after building). |
| `bun run lint` | Run ESLint. |
| `bun run format` | Format project files with Prettier. |

Use the equivalent `npm run <script>` or `pnpm <script>` command if you installed dependencies with npm or pnpm.

## How it works

- Next.js serves the interface and API routes.
- Elysia defines room and message endpoints; Eden provides the typed client used by the UI.
- Upstash Redis stores room metadata and messages with expiration. The configured TTL starts when a room is created.
- Upstash Realtime broadcasts new messages and room destruction to connected participants.
- A proxy checks room membership and sets an HTTP-only `x-auth-token` cookie. Rooms are limited to two participants.

## Project structure

```text
src/
|-- app/
|   |-- api/          # Room, message, and realtime endpoints
|   |-- room/[id]/    # Room page and chat interface
|   `-- (root)/       # Home page and room creation/join controls
|-- components/       # Shared UI and chat dialogs
|-- lib/              # Redis, realtime, API client, and helpers
`-- proxy.ts          # Room access, participant limit, and cookie handling
```

## Deployment

Deploy as a Next.js application (for example, on Vercel) and configure the variables from `.env.example` in your hosting provider. Set `NEXT_PUBLIC_ENVIRONMENT` to the deployed app's base URL and choose the room lifetime with `NEXT_PUBLIC_ROOM_TTL`. Provide valid Upstash Redis REST credentials for the deployment environment.
