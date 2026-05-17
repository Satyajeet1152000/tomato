# Auth service

Express 5 HTTP service for user authentication: credentials/OAuth flows, JWT access tokens, and protected profile routes. Persists users in **MongoDB** via **Mongoose**.

## Default port

- `PORT` defaults to **5000** if unset (see `src/index.ts`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run `node dist/index.js` |
| `npm run dev` | `tsc --watch` plus `node --watch dist/index.js` |

## HTTP routes

- Mounted at **`/api/auth`** (see `src/routes/auth.ts` and `src/index.ts`).

## Notable dependencies

- `express`, `cors`, `dotenv`, `mongoose`, `jsonwebtoken`, `googleapis`, `axios`

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP listen port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SEC` | Secret for signing JWTs (must match other services that verify tokens) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth (see `src/config/googleConfig.ts`) |

## Docker

```bash
docker build -t tomato-auth .
```

Run from this directory (`services/auth`).
