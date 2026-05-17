# Realtime service

HTTP + **Socket.IO** server. Authenticates socket connections with **JWT** and exposes a small **internal REST API** so other services can emit events to connected clients.

## Port

- **`PORT` is required** (`src/index.ts` listens on `process.env.PORT`).

Match this with the frontend `realtimeService` URL in [`frontend/src/main.tsx`](../../frontend/src/main.tsx) (default local port **5004**).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run `node dist/index.js` |
| `npm run dev` | Watch mode |

## HTTP routes

- **`/api/v1/internal`** — Internal routes protected by `x-internal-key` (`src/routes/internal.ts`).

## Socket

- Initialization lives in `src/socket.ts`; clients should pass the JWT as socket auth (see frontend `SocketProvider`).

## Notable dependencies

- `express`, `cors`, `dotenv`, `socket.io`, `jsonwebtoken`

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP and Socket.IO listen port |
| `JWT_SEC` | Verify JWT for socket authentication |
| `INTERNAL_SERVICE_KEY` | Validate internal emit requests |

## Docker

```bash
docker build -t tomato-realtime .
```

Run from this directory (`services/realtime`).
