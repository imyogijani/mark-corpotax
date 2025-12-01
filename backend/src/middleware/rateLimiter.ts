import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "300"), // 300 requests (increased from 100)
  duration: parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60, // Per 15 minutes by default
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || req.connection.remoteAddress || "unknown";
    await rateLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes?.remainingPoints || 0;
    const msBeforeNext = rejRes?.msBeforeNext || 1000;

    res.set("Retry-After", Math.round(msBeforeNext / 1000).toString());
    res.set("X-RateLimit-Limit", process.env.RATE_LIMIT_MAX_REQUESTS || "100");
    res.set("X-RateLimit-Remaining", remainingPoints.toString());
    res.set(
      "X-RateLimit-Reset",
      new Date(Date.now() + msBeforeNext).toISOString()
    );

    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
      retryAfter: Math.round(msBeforeNext / 1000),
    });
  }
};
