import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { initializeFirebase } from "./config/firebase";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";

// Import routes
import authRoutes from "./routes/auth";
import contactRoutes from "./routes/contact";
import appointmentRoutes from "./routes/appointment";
import blogRoutes from "./routes/blog";
import serviceRoutes from "./routes/service";
import adminRoutes from "./routes/admin";
import contentRoutes from "./routes/content";
import notificationRoutes from "./routes/notifications";
import businessRoutes from "./routes/business";
import settingsRoutes from "./routes/settings";
import pageLayoutRoutes from "./routes/pageLayouts";
import teamRoutes from "./routes/team";

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
initializeFirebase();
console.log("🔥 Firebase Firestore initialized");

// Security middleware
app.use(helmet());

// CORS configuration - handles both development and production
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:9002",
  "http://127.0.0.1:9002",
  "https://markcorpotax.com",
  "https://www.markcorpotax.com",
  "http://markcorpotax.com",
  "http://www.markcorpotax.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cache-Control",
    ],
  })
);

// Rate limiting
app.use(rateLimiterMiddleware);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Mark Corpotax Backend API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "Firebase Firestore",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/page-layouts", pageLayoutRoutes);
app.use("/api/team", teamRoutes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(Number(PORT), "127.0.0.1", () => {
  console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Health check: http://127.0.0.1:${PORT}/health`);
});

export default app;
