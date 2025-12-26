import "./services/preload.service.js"
import app from "./app.js";
import { runMigrations } from "./config/runMigrations.js";



(async () => {
  await runMigrations();
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
