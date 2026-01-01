import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
// Routes
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import fileRoutes from "./routes/file.routes.js";
import userRoutes from "./routes/user.routes.js";
// (tasks, files, comments will be added later)

//middlewares
import { errorHandler } from "./middlewares/error.middleware.js";
import { pingRedis } from "./config/redis.js";

const app = express();
app.set("trust proxy", 1);

/* -------------------- CONFIG -------------------- */
const devOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowlist = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const effectiveAllowlist = allowlist.length ? allowlist : devOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow same-origin/non-browser tools
    if (effectiveAllowlist.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX
    ? Number(process.env.AUTH_RATE_LIMIT_MAX)
    : 20,
  message: "Too many auth attempts. Please try again later.",
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () =>
    process.env.NODE_ENV !== "production" ||
    String(process.env.AUTH_RATE_LIMIT_DISABLE).toLowerCase() === "true",
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again later.",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

/* -------------------- GLOBAL MIDDLEWARES -------------------- */

// Enable CORS with allowlist and credentials
app.use(cors(corsOptions));

// Global rate limiting (per IP)
app.use(globalLimiter);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // can be tightened when front-end domain is final
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  
// Parse cookies (for refresh token)
app.use(cookieParser());

/* -------------------- ROUTES -------------------- */

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Redis health
app.get("/health/redis", async (req, res) => {
  try {
    const pong = await pingRedis();
    res.status(200).json({ status: "ok", pong });
  } catch (err) {
    res.status(503).json({ status: "error", message: err.message });
  }
});

/* -------------------- 404 HANDLER -------------------- */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
