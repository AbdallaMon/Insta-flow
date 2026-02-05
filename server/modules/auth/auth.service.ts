import "dotenv/config";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserType, UserStatus } from "../../generated/prisma/client.js";
import {
  SignUpRequest,
  LoginRequest,
  AuthUser,
  AuthTokens,
  LoginResponse,
  SignUpResponse,
  AccessTokenPayload,
  RefreshTokenPayload,
  ResetPasswordTokenPayload,
  ForgotPasswordResponse,
} from "./auth.types.js";
import prisma from "../../prisma/index.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import { sendResetPasswordEmail } from "./auth.emails.js";

// ============================================================================
// AUTH SERVICE CLASS
// ============================================================================

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRY = "30m"; // 30 minutes
  private readonly REFRESH_TOKEN_EXPIRY = "7d"; // 7 days
  private readonly RESET_TOKEN_EXPIRY = "2h"; // 2 hour
  private readonly BCRYPT_ROUNDS = 12;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET!;
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

    // Validate environment variables
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.warn(
        "⚠️ Warning: Using default JWT secrets. Please set JWT_SECRET and JWT_REFRESH_SECRET in .env",
      );
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private mapUserToAuthUser(user: {
    id: string;
    email: string;
    name: string;
    type: UserType;
    status: UserStatus;
    parentUserId: string | null;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      status: user.status,
      parentUserId: user.parentUserId,
    };
  }

  private generateAccessToken(user: AuthUser): string {
    const payload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      type: user.type,
      parentUserId: user.parentUserId,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  private generateRefreshToken(userId: string, tokenVersion = 0): string {
    const payload: RefreshTokenPayload = {
      userId,
      tokenVersion,
    };

    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  private generateResetToken(userId: string, email: string): string {
    const payload: ResetPasswordTokenPayload = {
      userId,
      email,
      purpose: "reset_password",
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.RESET_TOKEN_EXPIRY,
    });
  }

  private generateTokens(user: AuthUser, tokenVersion = 0): AuthTokens {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user.id, tokenVersion),
      expiresIn: 30 * 60, // 30 minutes in seconds
    };
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  // ============================================================================
  // PUBLIC SERVICE METHODS
  // ============================================================================

  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw {
        status: 409,
        ...AUTH_MESSAGES.ERRORS.EMAIL_ALREADY_EXISTS,
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, this.BCRYPT_ROUNDS);

    // Create user (default type is OWNER)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        type: data.type || UserType.OWNER,
        status: UserStatus.ACTIVE,
        tokenVersion: 0,
      },
    });

    const authUser = this.mapUserToAuthUser(user);
    const tokens = this.generateTokens(authUser, user.tokenVersion);

    // Update last login
    await this.updateLastLogin(user.id);

    return {
      user: authUser,
      tokens,
      message: AUTH_MESSAGES.SUCCESS.SIGN_UP,
    };
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw {
        status: 401,
        ...AUTH_MESSAGES.ERRORS.INVALID_CREDENTIALS,
      };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw {
        status: 401,
        ...AUTH_MESSAGES.ERRORS.INVALID_CREDENTIALS,
      };
    }

    // Check user status
    if (user.status === UserStatus.INACTIVE) {
      throw {
        status: 403,
        ...AUTH_MESSAGES.ERRORS.USER_INACTIVE,
      };
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw {
        status: 403,
        ...AUTH_MESSAGES.ERRORS.USER_SUSPENDED,
      };
    }

    const authUser = this.mapUserToAuthUser(user);
    const tokens = this.generateTokens(authUser, user.tokenVersion);

    // Update last login
    await this.updateLastLogin(user.id);

    return {
      user: authUser,
      tokens,
      message: AUTH_MESSAGES.SUCCESS.LOGIN,
    };
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(
        token,
        this.JWT_REFRESH_SECRET,
      ) as RefreshTokenPayload;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw {
          status: 401,
          ...AUTH_MESSAGES.ERRORS.USER_NOT_FOUND,
        };
      }

      // Validate token version (invalidates tokens after logout)
      if (payload.tokenVersion !== user.tokenVersion) {
        throw {
          status: 401,
          ...AUTH_MESSAGES.ERRORS.TOKEN_REVOKED,
        };
      }

      // Check user status
      if (user.status !== UserStatus.ACTIVE) {
        throw {
          status: 403,
          ...AUTH_MESSAGES.ERRORS.USER_INACTIVE,
        };
      }

      const authUser = this.mapUserToAuthUser(user);
      return this.generateTokens(authUser, user.tokenVersion);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw {
          status: 401,
          ...AUTH_MESSAGES.ERRORS.TOKEN_EXPIRED,
        };
      }
      if (error.name === "JsonWebTokenError") {
        throw {
          status: 401,
          ...AUTH_MESSAGES.ERRORS.INVALID_TOKEN,
        };
      }
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      // Return a fake token (won't be valid) to prevent timing attacks
      return {
        resetToken: crypto.randomBytes(32).toString("hex"),
        message: AUTH_MESSAGES.ERRORS.USER_NOT_FOUND.message,
      };
    }

    const resetToken = this.generateResetToken(user.id, user.email);

    // TODO: Send email with reset link
    await sendResetPasswordEmail(user.email, resetToken);
    console.log("Reset token (for testing):", resetToken);
    console.log("user.email token (for user.email):", user.email);

    return {
      resetToken,
      message: AUTH_MESSAGES.SUCCESS.PASSWORD_RESET_EMAIL_SENT,
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = jwt.verify(
        token,
        this.JWT_SECRET,
      ) as ResetPasswordTokenPayload;

      if (payload.purpose !== "reset_password") {
        throw {
          status: 400,
          ...AUTH_MESSAGES.ERRORS.INVALID_TOKEN,
        };
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);

      // Update password
      await prisma.user.update({
        where: { id: payload.userId },
        data: { passwordHash },
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw {
          status: 400,
          ...AUTH_MESSAGES.ERRORS.TOKEN_EXPIRED,
        };
      }
      if (error.name === "JsonWebTokenError") {
        throw {
          status: 400,
          ...AUTH_MESSAGES.ERRORS.INVALID_TOKEN,
        };
      }
      throw error;
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw {
        status: 404,
        ...AUTH_MESSAGES.ERRORS.USER_NOT_FOUND,
      };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw {
        status: 400,
        ...AUTH_MESSAGES.ERRORS.INVALID_PASSWORD,
      };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw {
        status: 404,
        ...AUTH_MESSAGES.ERRORS.USER_NOT_FOUND,
      };
    }

    return this.mapUserToAuthUser(user);
  }

  async logout(userId: string): Promise<void> {
    // Increment tokenVersion to invalidate all existing refresh tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as AccessTokenPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw {
          status: 401,
          ...AUTH_MESSAGES.ERRORS.TOKEN_EXPIRED,
        };
      }
      throw {
        status: 401,
        ...AUTH_MESSAGES.ERRORS.INVALID_TOKEN,
      };
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const authService = new AuthService();
