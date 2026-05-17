# Tomato

Monorepo for a multi-role food delivery experience: customers browse and order, restaurants manage menus and orders, riders fulfill deliveries, and admins oversee the platform. The repo contains a **React (Vite)** web app and several **Node.js (Express)** services that communicate over HTTP, **RabbitMQ** queues, and **Socket.IO** for realtime updates.

## Repository layout

| Path | Role |
|------|------|
| [`frontend/`](frontend/) | SPA: Tailwind CSS, React Router, maps (Leaflet), Stripe and Razorpay checkout, Google sign-in, Socket.IO client |
| [`services/auth/`](services/auth/) | Authentication, JWT issuance, Google OAuth, MongoDB (Mongoose) users |
| [`services/restaurant/`](services/restaurant/) | Restaurants, menu items, cart, addresses, orders; RabbitMQ consumers and publishers; coordinates with realtime and utils |
| [`services/utils/`](services/utils/) | Cloudinary uploads, Razorpay and Stripe payment APIs, RabbitMQ payment producer |
| [`services/realtime/`](services/realtime/) | Socket.IO server and internal HTTP API for emitting events to clients |
| [`services/rider/`](services/rider/) | Rider profiles and delivery workflow; consumes order-ready queue, talks to restaurant and realtime services |
| [`services/admin/`](services/admin/) | Admin HTTP API backed by MongoDB (native driver) for operational views |

Legacy or scratch copies may exist under `tmp/`; that directory is **gitignored** and is not part of the shipped tree.

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **MongoDB** for auth, restaurant, and rider data (`MONGO_URI`, and for admin also `DB_NAME`)
- **RabbitMQ** for restaurant, rider, and utils (`RABBITMQ_URL` and queue names)
- **Cloudinary** account for image uploads (utils service)
- **Razorpay** and/or **Stripe** keys where payment flows are used (utils)
- **Google OAuth** credentials for web login (auth + frontend `GoogleOAuthProvider`)

## Installing dependencies

Each package manages its own `node_modules` (no workspace root yet). From the repository root:

```bash
for d in frontend services/auth services/admin services/utils services/realtime services/rider services/restaurant; do
  echo "Installing $d"
  (cd "$d" && npm install)
done
```

## Configuration (environment)

Do **not** commit `.env` files. Copy examples from your secrets store or create `.env` per service. Common variables used across the codebase include:

| Variable | Used by | Purpose |
|----------|---------|---------|
| `PORT` | All HTTP services | Listen port (some services require it at runtime) |
| `MONGO_URI` | auth, restaurant, rider, admin | MongoDB connection string |
| `DB_NAME` | admin | Mongo database name |
| `JWT_SEC` | auth, restaurant, rider, admin, realtime (socket) | Shared JWT secret for signing/verification |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | auth | Google OAuth (web) |
| `RABBITMQ_URL` | restaurant, rider, utils | AMQP connection |
| `PAYMENT_QUEUE`, `RIDER_QUEUE`, `ORDER_READY_QUEUE` | restaurant, rider, utils | Queue names for payment and rider flows |
| `INTERNAL_SERVICE_KEY` | Cross-service `x-internal-key` header | Securing internal HTTP calls |
| `REALTIME_SERVICE` | restaurant, rider | Base URL of realtime service for internal emit API |
| `UTILS_SERVICE` | restaurant, rider | Base URL of utils (uploads, etc.) |
| `RESTAURANT_SERVICE` | rider, utils | Base URL of restaurant service |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | utils | Razorpay |
| `STRIPE_SECRET_KEY` | utils | Stripe server |
| `FRONTEND_URL` | utils | Stripe success/cancel URLs |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_SECRET_KEY` | utils | Cloudinary |

The frontend currently exposes **base URLs for each API** in [`frontend/src/main.tsx`](frontend/src/main.tsx) (`authService`, `restaurantService`, etc.) and uses `VITE_STRIPE_PUBLISHABLE_KEY` and `VITE_INTERNAL_SERVICE_KEY` where referenced in components. Align service `PORT` values with those URLs when running locally.

Suggested local ports (to match defaults in `main.tsx`): auth **5000**, restaurant **5001**, utils **5002**, realtime **5004**, rider **5005**, admin **5006**.

## Build and run (development)

| Package | Build | Start (after build) | Dev (watch) |
|---------|-------|---------------------|-------------|
| frontend | `npm run build` | `npm run preview` | `npm run dev` |
| each service | `npm run build` | `npm start` | `npm run dev` |

Backend services compile TypeScript to `dist/` and run `node dist/index.js`. Run **MongoDB**, **RabbitMQ**, and the services your flow needs before exercising end-to-end flows.

## Docker

Each service under `services/*/` includes a `Dockerfile` and `.dockerignore`. Build from the service directory, for example:

```bash
docker build -t tomato-auth ./services/auth
```

## Realtime and internal APIs

- Restaurant and rider services call **`REALTIME_SERVICE`** at `/api/v1/internal/emit` with header `x-internal-key: INTERNAL_SERVICE_KEY` to push Socket.IO updates.
- Utils calls restaurant order endpoints for payment confirmation with the same internal key pattern.

Details per service are in each service `README.md`.

## Contributing and license

Project-specific contribution guidelines and license can be added here when defined.
