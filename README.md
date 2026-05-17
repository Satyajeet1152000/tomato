# Tomato

**Tomato** is a full-stack food delivery platform inspired by how apps like Zomato work internally: multiple user roles, independent backend services, message queues, realtime updates, dual payment gateways, and Docker-based deployment.

## User roles

The application supports four roles:

| Role | Description |
|------|-------------|
| **Customer** | Browse restaurants, place orders, track delivery live, complete checkout with regional or global payments. |
| **Restaurant (Seller)** | Manage listings, menu items, orders, and restaurant-side operations. |
| **Delivery Partner (Rider)** | Accept deliveries, navigate to pickup and drop-off, update order status; location is shared in real time. |
| **Admin** | Verification and platform management. |

## Backend: six microservices

The backend is split into **six independent Node.js (Express) services**, each with its own package, TypeScript build, and Dockerfile:

| Service | Responsibility |
|---------|----------------|
| [**Auth**](services/auth/) | Sign-in (including Google OAuth), JWT issuance, user persistence. |
| [**Restaurant**](services/restaurant/) | Restaurants, menu, cart, addresses, orders; consumes payment events from the queue. |
| [**Rider**](services/rider/) | Rider profiles and delivery workflow; consumes order-ready work from the queue. |
| [**Admin**](services/admin/) | Administrative HTTP API over MongoDB for verification and management. |
| [**Realtime**](services/realtime/) | **Socket.IO** server and internal HTTP API for pushing events to connected clients. |
| [**Utils**](services/utils/) | **Cloudinary** uploads, **Razorpay** and **Stripe** payment APIs, RabbitMQ payment producer. |

## Messaging between services (RabbitMQ)

Services do not only talk over HTTP: **RabbitMQ** is the message broker for asynchronous flows (for example payment processing and rider order handoff). In production, RabbitMQ is **deployed on AWS** (often as a **Docker**-based deployment) and each service connects via `RABBITMQ_URL` and named queues.

## Real-time features

- Live **order status** updates to customers and restaurants  
- **Rider location** tracked in real time  
- **Navigation** for riders toward delivery locations (maps and routing on the client)  
- Customers **track the delivery partner live** on the map  
- **Sound notifications** for new orders and accepted deliveries (order received, delivery accepted)

The [**Realtime service**](services/realtime/) drives Socket.IO; the web app connects after authentication. Other services call the realtime internal API to emit events.

## Payments

Two gateways are supported:

- **Razorpay** — oriented toward **Indian users** (handled in **Utils** and wired to restaurant order flows).  
- **Stripe** — oriented toward **global users** (checkout session and webhooks server-side in **Utils**; publishable key on the **frontend**).

## Deployment

The project is **Dockerized**: each microservice includes a `Dockerfile` for repeatable builds.

Typical production layout:

| Layer | Platform |
|-------|----------|
| **Backend microservices** | [Render](https://render.com/) (or similar), running containerized services |
| **Frontend** | [Vercel](https://vercel.com/) (SPA with client-side routing; see `frontend/vercel.json`) |
| **RabbitMQ** | AWS (Docker-managed or managed AMQP), shared by all services that publish or consume |

Configure each service’s `PORT`, public URLs, and secrets to match your hosts (see environment tables in each [`services/*/README.md`](services/) and [`frontend/README.md`](frontend/README.md)).

## Who this is for (learning)

This repo is a strong fit if you want to learn:

- **Microservices** architecture in **Node.js** (Express, TypeScript)  
- **Real-time systems** with **Socket.IO**  
- **Message queues** with **RabbitMQ**  
- **Payment gateway** integration (Razorpay and Stripe)  
- **Docker** and **production-style deployment**  
- How **food-delivery marketplaces** split auth, catalog, orders, riders, admin, and realtime concerns

---

## Repository layout (technical)

| Path | Role |
|------|------|
| [`frontend/`](frontend/) | React (Vite) SPA: Tailwind, maps, Stripe/Razorpay UX, Socket.IO client |
| [`services/auth/`](services/auth/) | Authentication and users |
| [`services/restaurant/`](services/restaurant/) | Catalog, cart, addresses, orders |
| [`services/rider/`](services/rider/) | Rider API and queue-driven delivery flow |
| [`services/admin/`](services/admin/) | Admin API |
| [`services/realtime/`](services/realtime/) | Socket.IO + internal emit API |
| [`services/utils/`](services/utils/) | Uploads and payments |

Scratch copies may live under `tmp/`; that tree is gitignored.

## Prerequisites

- **Node.js** (LTS) and **npm**
- **MongoDB** for auth, restaurant, rider, and admin data
- **RabbitMQ** for services that publish or consume queues
- **Cloudinary** (Utils), **Razorpay** / **Stripe** keys as needed
- **Google OAuth** credentials for web login (Auth + frontend)

## Installing dependencies

Each package has its own `node_modules`:

```bash
for d in frontend services/auth services/admin services/utils services/realtime services/rider services/restaurant; do
  echo "Installing $d"
  (cd "$d" && npm install)
done
```

## Configuration

Do not commit `.env` files. Set `PORT`, `MONGO_URI`, `JWT_SEC`, `RABBITMQ_URL`, queue names, `INTERNAL_SERVICE_KEY`, service base URLs (`*_SERVICE`), and payment keys per service—the per-service READMEs list variables used in code.

The frontend exposes API base URLs in [`frontend/src/main.tsx`](frontend/src/main.tsx) (local defaults use ports **5000**, **5001**, **5002**, **5004**, **5005**, **5006**). Use `VITE_*` variables where the client reads env (see [`frontend/README.md`](frontend/README.md)).

## Build and run (development)

| Package | Build | Start | Dev (watch) |
|---------|-------|-------|-------------|
| frontend | `npm run build` | `npm run preview` | `npm run dev` |
| each service | `npm run build` | `npm start` | `npm run dev` |

Services emit compiled output to `dist/` and run `node dist/index.js`. Start MongoDB, RabbitMQ, and only the services you need for the path you are testing.

## License and contributions

Add a license and contribution guidelines here when you define them for the project.
