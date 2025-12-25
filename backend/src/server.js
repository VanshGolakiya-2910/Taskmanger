import "./service/preload.service.js";
import express from "express";
import { runMigrations } from "./config/runMigrations.js";



const app = express();

(async () => {
  await runMigrations();
})();

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
