import { Request, Response, NextFunction } from "express";
import { PermissionPage } from "../generated/prisma/client.js";
import { UserType } from "../generated/prisma/client.js";
import prisma from "../prisma/index.js";
import { AUTH_MESSAGES } from "../modules/auth/auth.messages.js";
// ============================================================================
// PERMISSION CHECK MIDDLEWARE
// ============================================================================

type PermissionAction = "read" | "create" | "update" | "delete";

/**
 * Middleware to check if user has specific permission for a page
 * Must be used after authenticate middleware
 *
 * OWNER always has full access to their account
 * STAFF needs explicit permissions
 * SUPER_ADMIN has access to everything
 */
export function requirePermission(
  page: PermissionPage,
  action: PermissionAction,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: AUTH_MESSAGES.ERRORS.UNAUTHORIZED.code,
          message: "Authentication required",
        });
      }

      // SUPER_ADMIN has all permissions
      if (req.user.type === UserType.SUPER_ADMIN) {
        return next();
      }

      // OWNER has all permissions for their own account
      if (req.user.type === UserType.OWNER) {
        return next();
      }

      // STAFF needs to check permissions
      if (req.user.type === UserType.STAFF) {
        const permission = await prisma.userPermission.findUnique({
          where: {
            userId_page: {
              userId: req.user.userId,
              page: page,
            },
          },
        });

        if (!permission) {
          return res.status(403).json({
            success: false,
            code: AUTH_MESSAGES.ERRORS.FORBIDDEN.code,
            message: `You do not have ${action} permission for ${page}`,
          });
        }

        const hasPermission =
          (action === "read" && permission.canRead) ||
          (action === "create" && permission.canCreate) ||
          (action === "update" && permission.canUpdate) ||
          (action === "delete" && permission.canDelete);

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            code: AUTH_MESSAGES.ERRORS.FORBIDDEN.code,
            message: `You do not have ${action} permission for ${page}`,
          });
        }

        return next();
      }

      // Unknown user type
      return res.status(403).json({
        success: false,
        code: AUTH_MESSAGES.ERRORS.FORBIDDEN.code,
        message: "Access denied",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Failed to check permissions",
      });
    }
  };
}

// ============================================================================
// CONVENIENCE PERMISSION MIDDLEWARES
// ============================================================================

// Integration permissions
export const canReadIntegration = requirePermission(
  PermissionPage.INTEGRATION,
  "read",
);
export const canCreateIntegration = requirePermission(
  PermissionPage.INTEGRATION,
  "create",
);
export const canUpdateIntegration = requirePermission(
  PermissionPage.INTEGRATION,
  "update",
);
export const canDeleteIntegration = requirePermission(
  PermissionPage.INTEGRATION,
  "delete",
);

// Receivers permissions
export const canReadReceivers = requirePermission(
  PermissionPage.RECEIVERS,
  "read",
);
export const canCreateReceivers = requirePermission(
  PermissionPage.RECEIVERS,
  "create",
);
export const canUpdateReceivers = requirePermission(
  PermissionPage.RECEIVERS,
  "update",
);
export const canDeleteReceivers = requirePermission(
  PermissionPage.RECEIVERS,
  "delete",
);

// Payment Links permissions
export const canReadPaymentLinks = requirePermission(
  PermissionPage.PAYMENT_LINKS,
  "read",
);
export const canCreatePaymentLinks = requirePermission(
  PermissionPage.PAYMENT_LINKS,
  "create",
);
export const canUpdatePaymentLinks = requirePermission(
  PermissionPage.PAYMENT_LINKS,
  "update",
);
export const canDeletePaymentLinks = requirePermission(
  PermissionPage.PAYMENT_LINKS,
  "delete",
);

// Review permissions
export const canReadReview = requirePermission(PermissionPage.REVIEW, "read");
export const canCreateReview = requirePermission(
  PermissionPage.REVIEW,
  "create",
);
export const canUpdateReview = requirePermission(
  PermissionPage.REVIEW,
  "update",
);
export const canDeleteReview = requirePermission(
  PermissionPage.REVIEW,
  "delete",
);

// Payments permissions
export const canReadPayments = requirePermission(
  PermissionPage.PAYMENTS,
  "read",
);
export const canCreatePayments = requirePermission(
  PermissionPage.PAYMENTS,
  "create",
);
export const canUpdatePayments = requirePermission(
  PermissionPage.PAYMENTS,
  "update",
);
export const canDeletePayments = requirePermission(
  PermissionPage.PAYMENTS,
  "delete",
);

// Customers permissions
export const canReadCustomers = requirePermission(
  PermissionPage.CUSTOMERS,
  "read",
);
export const canCreateCustomers = requirePermission(
  PermissionPage.CUSTOMERS,
  "create",
);
export const canUpdateCustomers = requirePermission(
  PermissionPage.CUSTOMERS,
  "update",
);
export const canDeleteCustomers = requirePermission(
  PermissionPage.CUSTOMERS,
  "delete",
);

// Users permissions
export const canReadUsers = requirePermission(PermissionPage.USERS, "read");
export const canCreateUsers = requirePermission(PermissionPage.USERS, "create");
export const canUpdateUsers = requirePermission(PermissionPage.USERS, "update");
export const canDeleteUsers = requirePermission(PermissionPage.USERS, "delete");

// Settings permissions
export const canReadSettings = requirePermission(
  PermissionPage.SETTINGS,
  "read",
);
export const canUpdateSettings = requirePermission(
  PermissionPage.SETTINGS,
  "update",
);

// Logs permissions
export const canReadLogs = requirePermission(PermissionPage.LOGS, "read");

// Devices permissions
export const canReadDevices = requirePermission(PermissionPage.DEVICES, "read");
export const canCreateDevices = requirePermission(
  PermissionPage.DEVICES,
  "create",
);
export const canDeleteDevices = requirePermission(
  PermissionPage.DEVICES,
  "delete",
);
