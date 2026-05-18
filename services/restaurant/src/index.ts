import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import restaurantRoutes from "./routes/restaraunt.js";
import itemRoutes from "./routes/menuitem.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import cors from "cors";
import { connectRabbitMQ, getChannel } from "./config/rabbitmq.js";
import { startPaymentConsumer } from "./config/payment.consumer.js";
import { getServerMetrics } from "./util/health.js";

dotenv.config();

await connectRabbitMQ();
startPaymentConsumer();

const app = express();
const startedAt = Date.now();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/health", (_req, res) => {
	const readyState = mongoose.connection.readyState;
	res.json(
		getServerMetrics("restaurant", startedAt, {
			mongodb: {
				status: readyState === 1 ? "connected" : "disconnected",
				readyState,
			},
			rabbitmq: {
				status: getChannel() ? "connected" : "disconnected",
			},
		}),
	);
});

app.use("/api/restaurant", restaurantRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
	console.log(`Restaurant service is running on port ${PORT}`);
	connectDB();
});
