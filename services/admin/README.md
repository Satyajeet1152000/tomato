# Admin service

Express HTTP API for administrative operations. Uses the **MongoDB Node.js driver** (not Mongoose) for flexible queries against configured collections.

## Port

- **`PORT` is required** at runtime (`src/index.ts` uses `process.env.PORT` with no fallback).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run `node dist/index.js` |
| `npm run dev` | Watch mode for compile and Node |

## HTTP routes

- Base path: **`/api/v1`** (see `src/index.ts`, `src/routes/admin.ts`).

## Notable dependencies

- `express`, `cors`, `dotenv`, `mongodb`, `jsonwebtoken`

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP listen port |
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `JWT_SEC` | JWT verification (admin-protected routes) |

## Docker

```bash
docker build -t tomato-admin .
```

Run from this directory (`services/admin`).
