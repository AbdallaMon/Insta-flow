import { UserType, UserStatus } from "../../generated/prisma/client.js";

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  type?: UserType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
  status: UserStatus;
  parentUserId: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}
export type MessageText = {
  message: string;
};

export interface LoginResponse extends MessageText {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface SignUpResponse extends MessageText {
  user: AuthUser;
  tokens: AuthTokens;
  message: string;
}

export interface ForgotPasswordResponse extends MessageText {
  resetToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// JWT PAYLOAD TYPES
// ============================================================================

export interface AccessTokenPayload {
  userId: string;
  email: string;
  type: UserType;
  parentUserId: string | null; // For STAFF, this is the OWNER's ID
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number; // For token invalidation
  iat?: number;
  exp?: number;
}

export interface ResetPasswordTokenPayload {
  userId: string;
  email: string;
  purpose: "reset_password";
  iat?: number;
  exp?: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "البريد إلكتروني أو كلمة المرور غير صحيحة",
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "المستخدم غير موجود",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "الايميل مستخدم بالفعل",
    field: "email",
  },
  INVALID_TOKEN: {
    code: "INVALID_TOKEN",
    message: "الرمز غير صالح",
  },
  TOKEN_EXPIRED: {
    code: "TOKEN_EXPIRED",
    message: "انتهت صلاحية الرمز",
  },
  USER_INACTIVE: {
    code: "USER_INACTIVE",
    message: "المستخدم غير نشط",
  },
  USER_SUSPENDED: {
    code: "USER_SUSPENDED",
    message: "المستخدم معلق",
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "المصادقة مطلوبة",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "ليس لديك إذن للوصول إلى هذا المورد",
  },
  INVALID_PASSWORD: {
    code: "INVALID_PASSWORD",
    message: "كلمة المرور الحالية غير صحيحة",
  },
  TOKEN_REVOKED: {
    code: "TOKEN_REVOKED",
    message: "تم إبطال الرمز. يرجى تسجيل الدخول مرة أخرى.",
  },
} as const;
