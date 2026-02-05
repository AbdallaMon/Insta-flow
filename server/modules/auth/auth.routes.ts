import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { authService } from "./auth.service.js";
import * as validators from "./auth.validators.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  SignUpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
} from "./auth.types.js";
import { AUTH_MESSAGES } from "./auth.messages.js";

const router = Router();

// ============================================================================
// RATE LIMITERS
// ============================================================================

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many password reset requests. Please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /api/auth/signup
 * Register a new user (OWNER by default)
 */
router.post(
  "/signup",
  authRateLimiter,
  validators.validateSignUp,
  async (req: Request, res: Response) => {
    try {
      const data = req.body as SignUpRequest;
      const result = await authService.signUp(data);

      res.status(201).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "An error occurred",
        field: error.field,
      });
    }
  },
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  "/login",
  authRateLimiter,
  validators.validateLogin,
  async (req: Request, res: Response) => {
    try {
      const data = req.body as LoginRequest;
      const result = await authService.login(data);

      res.json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "An error occurred",
      });
    }
  },
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  "/refresh",
  validators.validateRefreshToken,
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body as RefreshTokenRequest;
      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "An error occurred",
      });
    }
  },
);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validators.validateForgotPassword,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body as ForgotPasswordRequest;
      const request = await authService.forgotPassword(email);

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: request.message,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "An error occurred",
      });
    }
  },
);

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post(
  "/reset-password",
  validators.validateResetPassword,
  async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body as ResetPasswordRequest;
      console.log("Received reset-password request with token:", token);
      await authService.resetPassword(token, newPassword);

      console.log("Password reset successful for token:", token);
      res.json({
        success: true,
        message: AUTH_MESSAGES.SUCCESS.PASSWORD_CHANGED,
      });
    } catch (error: any) {
      console.error("Error in reset-password route:", error);
      res.status(error.status || 500).json({
        success: false,
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "An error occurred",
      });
    }
  },
);

/**
 * POST /api/auth/change-password
 * Change password (requires authentication)
 */
router.post(
  "/change-password",
  authenticate,
  validators.validateChangePassword,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } =
        req.body as ChangePasswordRequest;
      const userId = req.user!.userId;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: AUTH_MESSAGES.SUCCESS.PASSWORD_CHANGED,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        code: error.code || "INTERNAL_ERROR",
        message: error.message || "An error occurred",
      });
    }
  },
);

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await authService.getMe(userId);
    console.log(user, "user");
    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "An error occurred",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout and invalidate all refresh tokens
 */
router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    await authService.logout(userId);

    res.json({
      success: true,
      message: AUTH_MESSAGES.SUCCESS.LOGOUT,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "An error occurred",
    });
  }
});

export default router;
