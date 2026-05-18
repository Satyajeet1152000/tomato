import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import cors from "cors";
import riderRoutes from "./routes/rider.js";
import { connectRabbitMQ, getChannel } from "./config/rabbitmq.js";
import { startOrderReadyConsumer } from "./config/orderReady.consumer.js";
import { getServerMetrics } from "./util/health.js";

dotenv.config();

await connectRabbitMQ();
startOrderReadyConsumer();

const app = express();
const startedAt = Date.now();

app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
	const readyState = mongoose.connection.readyState;
	res.json(
		getServerMetrics("rider", startedAt, {
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

app.use("/api/rider", riderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Rider service is running on port ${process.env.PORT}`);
  connectDB();
});
