# Rider service

Part of **[Tomato](../../README.md)**. Implements the **Delivery Partner (Rider)** role: assignments, status updates, and integration with **Restaurants** and **Realtime** for live location and order events. Consumes **RabbitMQ** queues (order-ready); works with **Utils** for uploads. Customers see riders on the map via the realtime pipeline. **Docker** / **Render**-style deployment; broker on **AWS**.

Express API for **delivery riders**: profiles, availability, and order lifecycle actions. Uses **MongoDB (Mongoose)** and **RabbitMQ** (consumes order-ready messages, coordinates with restaurant and realtime services). File uploads for rider assets go through the **utils** service.

## Port

- **`PORT` is required** at runtime.

Align with the frontend `riderService` URL in [`frontend/src/main.tsx`](../../frontend/src/main.tsx) (default local port **5005**).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run `node dist/index.js` |
| `npm run dev` | Watch mode |

## HTTP routes

- Base path: **`/api/rider`** (`src/routes/rider.ts`)

## Notable dependencies

- `express`, `cors`, `dotenv`, `mongoose`, `multer`, `jsonwebtoken`, `amqplib`, `axios`, `datauri`

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP listen port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SEC` | JWT verification for riders |
| `RABBITMQ_URL`, `RIDER_QUEUE`, `ORDER_READY_QUEUE` | RabbitMQ |
| `UTILS_SERVICE` | Upload proxy URL |
| `RESTAURANT_SERVICE` | Rider assignment and order status callbacks |
| `REALTIME_SERVICE` | Internal emit API for live updates |
| `INTERNAL_SERVICE_KEY` | `x-internal-key` for internal HTTP calls |

## Docker

```bash
docker build -t tomato-rider .
```

Run from this directory (`services/rider`).
