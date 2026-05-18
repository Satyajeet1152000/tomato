import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import { getServerMetrics } from "./util/health.js";

dotenv.config();

const app = express();
const startedAt = Date.now();

app.use(cors());

app.use(express.json());

app.get("/health", (_req, res) => {
	const readyState = mongoose.connection.readyState;
	res.json(
		getServerMetrics("auth", startedAt, {
			mongodb: {
				status: readyState === 1 ? "connected" : "disconnected",
				readyState,
			},
		}),
	);
});

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
  connectDB();
});
