import "./services/preload.service.js"
import app from "./app.js";
import { runMigrations } from "./config/runMigrations.js";
import "./config/validateEnv.js";
import http from "http";
import { initSocketServer } from "./realtime/socket.server.js";
import { initRedis } from "./config/redis.js";

const server = http.createServer(app);

(async () => {
  await Promise.all([runMigrations(), initRedis({ required: true })]);
})();

export const io = initSocketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});