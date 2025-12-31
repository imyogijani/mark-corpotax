import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService, IUser } from "../services/firebaseService";

interface AuthRequest extends Request {
  user?: IUser;
}

// Protect routes - verify JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
      return;
    }

    // Development mode static token bypass
    if (
      process.env.NODE_ENV === "development" &&
      token === "dev-static-token-12345"
    ) {
      req.user = {
        id: "dev-admin-id",
        name: "Dev Admin",
        email: "admin@markcorpotax.com",
        role: "admin",
        isActive: true,
      } as any;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret"
      ) as any;

      // Get user from token using Firebase
      const user = await UserService.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword as IUser;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};
