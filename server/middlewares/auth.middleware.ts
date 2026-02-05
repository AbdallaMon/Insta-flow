import { Request, Response, NextFunction } from "express";
import { UserType } from "../generated/prisma/client.js";
import { authService } from "../modules/auth/auth.service.js";
import { AccessTokenPayload } from "../modules/auth/auth.types.js";
import { AUTH_MESSAGES } from "../modules/auth/auth.messages.js";

// ============================================================================
// EXTEND EXPRESS REQUEST TYPE
// ============================================================================

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Middleware to authenticate requests using JWT
 * Extracts token from Authorization header (Bearer token)
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader, "authHeader");
    console.log(req.headers, "authHeader");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        code: AUTH_MESSAGES.ERRORS.UNAUTHORIZED.code,
        message: "No authorization header provided",
      });
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        code: AUTH_MESSAGES.ERRORS.UNAUTHORIZED.code,
        message: "Invalid authorization header format",
      });
    }

    const payload = authService.verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error: any) {
    return res.status(error.status || 401).json({
      success: false,
      code: error.code || AUTH_MESSAGES.ERRORS.UNAUTHORIZED.code,
      message: error.message || "Authentication failed",
    });
  }
}

// ============================================================================
// AUTHORIZATION MIDDLEWARES (ROLE-BASED)
// ============================================================================

/**
 * Middleware to check if user has one of the allowed types
 * Must be used after authenticate middleware
 */
export function requireUserType(...allowedTypes: UserType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: AUTH_MESSAGES.ERRORS.UNAUTHORIZED.code,
        message: "Authentication required",
      });
    }

    if (!allowedTypes.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        code: AUTH_MESSAGES.ERRORS.FORBIDDEN.code,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
}

/**
 * Only SUPER_ADMIN can access
 */
export const requireSuperAdmin = requireUserType(UserType.SUPER_ADMIN);

/**
 * Only OWNER can access
 */
export const requireOwner = requireUserType(UserType.OWNER);

/**
 * OWNER or STAFF can access (normal merchant users)
 */
export const requireMerchant = requireUserType(UserType.OWNER, UserType.STAFF);

/**
 * Any authenticated user type can access
 */
export const requireAnyUser = requireUserType(
  UserType.SUPER_ADMIN,
  UserType.OWNER,
  UserType.STAFF,
);

// ============================================================================
// HELPER: GET OWNER ID
// ============================================================================

/**
 * Gets the owner ID for the current user
 * - If user is OWNER: returns their ID
 * - If user is STAFF: returns parentUserId (the OWNER they belong to)
 * - If user is SUPER_ADMIN: returns null (they don't belong to any merchant)
 */
export function getOwnerIdFromRequest(req: Request): string | null {
  if (!req.user) return null;

  if (req.user.type === UserType.OWNER) {
    return req.user.userId;
  }

  if (req.user.type === UserType.STAFF) {
    return req.user.parentUserId;
  }

  // SUPER_ADMIN doesn't have an owner
  return null;
}

/**
 * Middleware that adds ownerId to request for convenience
 */
export function attachOwnerId(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    (req as any).ownerId = getOwnerIdFromRequest(req);
  }
  next();
}
