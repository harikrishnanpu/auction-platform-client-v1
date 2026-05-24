# Hammer — Auction Platform (Frontend)

Next.js frontend for the Hammer auction platform. It talks to a separate backend API for REST calls and Socket.IO for live auction rooms, notifications, and real-time bidding.

## Requirements

- Node.js 20 or newer
- npm
- Backend API running (default local port `2500`)

## Getting started

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy environment variables for local development:

```bash
cp .env.local .env
```

If you do not have `.env.local`, create a `.env` file using the variables listed below.

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run start`| Run production build     |
| `npm run lint` | Run ESLint               |
| `npm run format` | Format with Prettier   |

## Environment variables

Variables are validated in `env.ts`. Missing or invalid values will fail at build or runtime.


### Auth cookies

Login stores `accessToken` and `refreshToken` in httpOnly cookies on the frontend domain. Server-side requests forward them to the API. Browser calls to the API host (SSE, Socket.IO, some `fetch` calls) need cookies shared across subdomains when frontend and API are split.

| Variable | Description |
| -------- | ----------- |
| `COOKIE_SECURE` | `true` on HTTPS, `false` for local `http://localhost` |
| `COOKIE_SAME_SITE` | Usually `lax` |
| `AUTH_ACCESS_TOKEN_MAX_AGE` | Access cookie lifetime in seconds (e.g. `3600`) |
| `AUTH_REFRESH_TOKEN_MAX_AGE` | Refresh cookie lifetime in seconds (e.g. `2592000`) |
| `ENABLE_COOKIE_DOMAIN` | `true` in production when API and frontend share a parent domain |
| `COOKIE_DOMAIN` | e.g. `.example.com` — only used when `ENABLE_COOKIE_DOMAIN=true` |


After changing cookie settings in production, users should log out and log in again so cookies are reissued.

## Project layout

```
app/              Next.js routes (pages and layouts)
actions/          Server actions (call services)
services/         API calls and business logic
features/         UI by feature (auth, auction room, admin, seller, …)
components/       Shared UI components
socket/           Socket.IO hooks and live auction WebRTC (mediasoup)
lib/              Helpers (fetch, auth cookies, …)
types/            TypeScript types
```

## How auth works

1. User logs in via a server action.
2. Tokens are saved in cookies (`lib/auth-cookies.ts`).
3. Server-side `apiFetch` sends cookies to the backend in the `Cookie` header.
4. Client-side calls to the API host rely on shared cookie domain when `ENABLE_COOKIE_DOMAIN` is enabled.

## Live auction streaming

Live video uses mediasoup in `socket/auction-live-mediasoup.handler.ts`:

- **Seller:** send transport → produce audio and video
- **Viewer:** recv transport → consume each producer

Socket events are defined in `socket/socket.events.ts`. The auction room hook is `socket/useAuctionRoomSocket.ts`.

WebRTC media runs between the browser and the backend. If video is black in production, check backend mediasoup settings (for example `MEDIASOUP_ANNOUNCED_IP`), EC2 security groups (UDP ports for RTP), and that the announced IP is the instance’s public address clients can reach.

## Related services

This repository is only the frontend. You need the backend API and database running separately for full functionality.
