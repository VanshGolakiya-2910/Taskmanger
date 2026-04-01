import "./services/preload.service.js"
import app from "./app.js";
import { runMigrations } from "./config/runMigrations.js";
import "./config/validateEnv.js";
import http from "http";
import { initSocketServer } from "./realtime/socket.server.js";
import { initRedis, shutdownRedis } from "./config/redis.js";
import { closeDbPool } from "./config/db.js";

const server = http.createServer(app);

(async () => {
  await Promise.all([runMigrations(), initRedis({ required: true })]);
})();

export const io = initSocketServer(server);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    await Promise.allSettled([shutdownRedis(), closeDbPool()]);
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));