# Restaurant service

Part of **[Tomato](../../README.md)**. Central domain for **Customer** browsing and **Restaurant (Seller)** operations: menus, cart, addresses, orders. **RabbitMQ** connects this service to **Utils** (payments) and **Rider** (order ready); **Realtime** receives internal emits for live order status. **Payments**: order confirmation ties to **Razorpay** and **Stripe** through **Utils**. Deployed as a **Docker** service (e.g. **Render**); broker runs on **AWS**.

Core **catalog and ordering** API: restaurants, menu items, cart, saved addresses, and orders. Uses **MongoDB (Mongoose)**, **RabbitMQ** (payment consumer, order publishers, queues shared with rider and utils), and calls **realtime** and **utils** for notifications and uploads.

## Default port

- `PORT` defaults to **5001** if unset.

Align with the frontend `restaurantService` URL in [`frontend/src/main.tsx`](../../frontend/src/main.tsx).

## Scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start`     | Run `node dist/index.js`      |
| `npm run dev`   | Watch mode                    |

## HTTP routes (prefixes)

| Prefix            | Area                               |
| ----------------- | ---------------------------------- |
| `/api/restaurant` | Restaurant listings and management |
| `/api/item`       | Menu items                         |
| `/api/cart`       | Cart                               |
| `/api/address`    | User addresses                     |
| `/api/order`      | Orders and payment webhooks        |

Note: Some source filenames use the historical spelling `restaraunt` for the restaurant controller and routes.

## Notable dependencies

- `express`, `cors`, `dotenv`, `mongoose`, `multer`, `jsonwebtoken`, `amqplib`, `axios`, `datauri`

## Environment variables

| Variable                                                            | Purpose                                                  |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| `PORT`                                                              | HTTP listen port                                         |
| `MONGO_URI`                                                         | MongoDB connection string                                |
| `JWT_SEC`                                                           | JWT for customers and restaurants                        |
| `RABBITMQ_URL`, `PAYMENT_QUEUE`, `RIDER_QUEUE`, `ORDER_READY_QUEUE` | Messaging                                                |
| `UTILS_SERVICE`                                                     | Image upload URL                                         |
| `REALTIME_SERVICE`                                                  | Internal Socket emit API                                 |
| `INTERNAL_SERVICE_KEY`                                              | `x-internal-key` for internal and cross-service requests |

## Docker

```bash
docker build -t tomato-restaurant .
```

Run from this directory (`services/restaurant`).
