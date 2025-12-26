import "./services/preload.service.js"
import app from "./app.js";
import { runMigrations } from "./config/runMigrations.js";
import http from "http";
import { initSocketServer } from "./config/socketServer.js";

const server = http.createServer(app);

(async () => {
  await runMigrations();
})();

export const io = initSocketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});