import express from "express";
import cors from "cors";
import { authRoutes } from "../modules/auth/index.js";

const app = express();

// Middleware
// Read allowed origins from CORS_ORIGINS (comma-separated). If not set, allow all origins.
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      // requests بدون Origin (زي Android/Server-to-server) اسمح بيها
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true); // Allow all if no origins specified
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Idempotency-Key"],
  }),
);
app.use(express.json());

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is up" });
});

// Auth routes
app.use("/auth", authRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      success: false,
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
    });
  },
);

export default app;
