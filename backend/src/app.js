import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
// (tasks, files, comments will be added later)

const app = express();

/* -------------------- GLOBAL MIDDLEWARES -------------------- */

// Enable CORS (configure origins later for production)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies (for refresh token)
app.use(cookieParser());

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

/* -------------------- 404 HANDLER -------------------- */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* -------------------- ERROR HANDLER (BASE) -------------------- */
// This will be enhanced later with ApiError

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
