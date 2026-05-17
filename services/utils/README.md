# Utils service

Express service for **file uploads (Cloudinary)** and **payments** (Razorpay, Stripe). Connects to **RabbitMQ** to enqueue payment work consumed by the restaurant service. Calls the **restaurant service** to confirm orders after payment events.

## Default port

- `PORT` defaults to **5002** if unset.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run `node dist/index.js` |
| `npm run dev` | Watch mode |

## HTTP routes

- **`/api`** — Cloudinary upload routes (`src/routes/cloudinary.ts`)
- **`/api/payment`** — Payment routes (`src/routes/payment.ts`)

Large JSON/urlencoded bodies are accepted (50mb limit in `src/index.ts`).

## Notable dependencies

- `express`, `cors`, `dotenv`, `cloudinary`, `razorpay`, `stripe`, `amqplib`, `axios`

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP listen port |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_SECRET_KEY` | Cloudinary (required at startup) |
| `RABBITMQ_URL`, `PAYMENT_QUEUE` | Payment queue producer |
| `RESTAURANT_SERVICE` | Base URL for restaurant order/payment callbacks |
| `INTERNAL_SERVICE_KEY` | `x-internal-key` for service-to-service calls |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay |
| `STRIPE_SECRET_KEY` | Stripe server SDK |
| `FRONTEND_URL` | Used in Stripe redirect URLs |

## Docker

```bash
docker build -t tomato-utils .
```

Run from this directory (`services/utils`).
