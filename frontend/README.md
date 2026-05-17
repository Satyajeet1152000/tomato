# Frontend (Tomato)

This SPA is part of **[Tomato](../README.md)**, a food delivery stack with four roles (**Customer**, **Restaurant / Seller**, **Delivery Partner / Rider**, **Admin**). The UI covers browsing and checkout for customers, seller tools for restaurants, rider dashboards with **maps and navigation**, and admin views. **Socket.IO** powers live order status and **rider location** tracking; customers follow the rider on the map. **Sound notifications** in the app signal order received and delivery accepted. **Payments**: **Stripe** (global) in the client and **Razorpay** (India) via the **Utils** service. **Deployment**: this app targets **Vercel**; microservices run on **Render** with **Docker**. **RabbitMQ** on **AWS** is used between backend services (not in the browser).

React 19 single-page application built with **Vite 7**, **TypeScript**, **Tailwind CSS v4** (`@tailwindcss/vite`), and **React Router** for role-based flows (customer, restaurant seller, rider, admin).

## Features

- **Authentication**: Google OAuth (`@react-oauth/google`), session backed by JWT from the auth service
- **Ordering**: Cart, checkout, addresses, order history, payment success flows
- **Payments**: Stripe (`@stripe/stripe-js`) and related UI; Razorpay integration on the backend
- **Maps**: Leaflet (`react-leaflet`, `leaflet-routing-machine`) for rider/customer map views
- **Realtime**: Socket.IO client connects when authenticated for live order updates

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) and production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## API base URLs

Service base URLs are exported from [`src/main.tsx`](src/main.tsx) (`authService`, `restaurantService`, `utilsService`, `realtimeService`, `riderService`, `adminService`). For local development these default to `http://localhost` ports **5000**, **5001**, **5002**, **5004**, **5005**, **5006** respectively. Update those constants (or move them to `import.meta.env` variables) when deploying so the browser calls the correct hosts.

## Environment variables (Vite)

Variables must be prefixed with `VITE_` to be exposed to the client. Examples used in code:

- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key ([`src/pages/Checkout.tsx`](src/pages/Checkout.tsx))
- `VITE_INTERNAL_SERVICE_KEY` — forwarded in some internal-style requests ([`src/components/RiderOrderMap.tsx`](src/components/RiderOrderMap.tsx))

Create `frontend/.env` or `frontend/.env.local` (gitignored at repo root for `.env`) and define these for your environment.

## Deployment

[`vercel.json`](vercel.json) rewrites all routes to `index.html` for client-side routing on Vercel.

## Project structure (high level)

- `src/pages/` — Route-level screens (home, login, cart, checkout, restaurant, rider dashboard, admin, etc.)
- `src/components/` — Reusable UI (navbar, route guards, maps, restaurant and rider widgets)
- `src/context/` — `AppProvider` (user, cart, location) and `SocketProvider`
- `src/utils/` — Helpers such as order flow utilities
- `src/types.ts` — Shared TypeScript types

## Google OAuth

The Google OAuth client ID is set on `GoogleOAuthProvider` in [`src/main.tsx`](src/main.tsx). Replace it with your own OAuth web client for production.
