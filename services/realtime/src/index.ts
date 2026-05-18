import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { initSocket } from "./socket.js";
import internalRoute from "./routes/internal.js";
import { getServerMetrics } from "./util/health.js";

dotenv.config();

const app = express();
const startedAt = Date.now();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
	res.json(getServerMetrics("realtime", startedAt));
});

app.use("/api/v1/internal", internalRoute);

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Realtime service is running port ${process.env.PORT}`);
});
