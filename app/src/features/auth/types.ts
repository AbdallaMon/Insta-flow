// ============================================================================
// ENUMS
// ============================================================================

export type UserType = "SUPER_ADMIN" | "OWNER" | "STAFF";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface SignUpRequest {
  email: string; // Required, valid email format
  password: string; // Required, min 8 characters
  name: string; // Required, 2-100 characters
}

export interface LoginRequest {
  email: string; // Required
  password: string; // Required
}

export interface ForgotPasswordRequest {
  email: string; // Required
}

export interface ResetPasswordRequest {
  token: string; // Required, from email link
  newPassword: string; // Required, min 8 characters
}

export interface ChangePasswordRequest {
  currentPassword: string; // Required
  newPassword: string; // Required, min 8 chars, must differ from current
}

export interface RefreshTokenRequest {
  refreshToken: string; // Required
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
  parentUserId: string | null; // For STAFF, this is the OWNER's ID
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 3600 (seconds = 60 min)
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
  message?: string;
}

export interface SignUpResponse {
  user: AuthUser;
  tokens: AuthTokens;
  message?: string;
}

// ============================================================================
// API RESPONSE WRAPPER
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  field?: string; // Which field caused the error
  errors?: ValidationError[]; // Multiple validation errors
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// AUTH STATE
// ============================================================================

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
