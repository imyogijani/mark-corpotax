import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserService } from "../services/firebaseService";
import { EmailService } from "../services/emailService";
import { protect } from "../middleware/auth";

const router = express.Router();

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    // Create user using Firebase
    const user = await UserService.create({
      name,
      email,
      password,
      role: role || "user",
    });

    // Generate token
    const token = generateToken(user.id!);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    // Check for user using Firebase
    const user = await UserService.findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Update last login
    await UserService.updateLastLogin(user.id!);

    // Generate token
    const token = generateToken(user.id!);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req: any, res: Response) => {
  try {
    const user = await UserService.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error getting user profile",
    });
  }
});

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
router.get("/verify", protect, async (req: any, res: Response) => {
  try {
    const user = await UserService.findById(req.user.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
});

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
router.post("/check-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const user = await UserService.findByEmail(email);

    res.status(200).json({
      success: true,
      message: "Email check completed",
      data: {
        exists: !!user,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error checking email",
    });
  }
});

// @desc    Request password reset (send email with reset link)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    // Find user
    const user = await UserService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent",
      });
      return;
    }

    // Generate reset token and store in Firebase
    const resetToken = await EmailService.generatePasswordResetToken(email);
    if (!resetToken) {
      res.status(500).json({
        success: false,
        message: "Failed to generate reset token",
      });
      return;
    }

    // Create reset URL
    const clientUrl = process.env.CLIENT_URL || "https://markcorpotax.com";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    // Send password reset email
    const emailSent = await EmailService.sendPasswordResetEmail(
      email,
      resetUrl
    );
    if (!emailSent) {
      res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error sending reset email",
    });
  }
});

// @desc    Verify reset token
// @route   POST /api/auth/verify-reset-token
// @access  Public
router.post("/verify-reset-token", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
      return;
    }

    const result = await EmailService.verifyPasswordResetToken(token);

    if (!result.valid) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: { email: result.email },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error verifying token",
    });
  }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
      return;
    }

    // Verify token
    const result = await EmailService.verifyPasswordResetToken(token);
    if (!result.valid || !result.email) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
      return;
    }

    // Find user
    const user = await UserService.findByEmail(result.email);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await UserService.update(user.id!, { password: hashedPassword });

    // Mark token as used
    await EmailService.markTokenAsUsed(token);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error resetting password",
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put("/change-password", protect, async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
      return;
    }

    // Get user with password
    const user = await UserService.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await UserService.update(user.id!, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error changing password",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put("/profile", protect, async (req: any, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await UserService.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updates: any = {};

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "Email already in use",
        });
        return;
      }
      updates.email = email;
    }

    if (name) updates.name = name;

    const updatedUser = await UserService.update(user.id!, updates);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser?.id,
          name: updatedUser?.name,
          email: updatedUser?.email,
          role: updatedUser?.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error updating profile",
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", protect, async (req: any, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during logout",
    });
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post("/refresh", protect, async (req: any, res: Response) => {
  try {
    const user = await UserService.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Generate new token
    const token = generateToken(user.id!);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error refreshing token",
    });
  }
});

export default router;
