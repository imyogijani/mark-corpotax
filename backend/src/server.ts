import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
initializeFirebase();
console.log("🔥 Firebase Firestore initialized");

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:9002",
      "http://localhost:3001",
    ],
    credentials: true,
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
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

export default app;
