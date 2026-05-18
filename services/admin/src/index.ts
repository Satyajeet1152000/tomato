import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import cors from "cors";
import { getServerMetrics } from "./util/health.js";

dotenv.config();

const app = express();
const startedAt = Date.now();

app.use(cors());

app.get("/health", (_req, res) => {
	res.json(getServerMetrics("admin", startedAt));
});

app.use("/api/v1", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Admin Service is running on port ${process.env.PORT}`);
});
