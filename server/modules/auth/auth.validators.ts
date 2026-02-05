import { Request, Response, NextFunction } from "express";
import {
  SignUpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
} from "./auth.types.js";
import { AUTH_MESSAGES } from "./auth.messages.js";

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,128}$/;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

interface ValidationError {
  field: string;
  message: string;
}

function validateEmail(email: string): ValidationError | null {
  if (!email || typeof email !== "string") {
    return {
      field: "email",
      message: AUTH_MESSAGES.ERRORS.VALIDATION.EMAIL.REQUIRED,
    };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return {
      field: "email",
      message: AUTH_MESSAGES.ERRORS.VALIDATION.EMAIL.FORMAT,
    };
  }
  return null;
}

function validatePassword(
  password: string,
  fieldName = "password",
): ValidationError | null {
  if (!password || typeof password !== "string") {
    return {
      field: fieldName,
      message: AUTH_MESSAGES.ERRORS.VALIDATION.PASSWORD.REQUIRED,
    };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      field: fieldName,
      message: AUTH_MESSAGES.ERRORS.VALIDATION.PASSWORD.MIN_LENGTH,
    };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      field: fieldName,
      message: AUTH_MESSAGES.ERRORS.VALIDATION.PASSWORD.MAX_LENGTH,
    };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      field: fieldName,
      message: AUTH_MESSAGES.ERRORS.VALIDATION.PASSWORD.FORMAT,
    };
  }
  return null;
}

function validateName(name: string): ValidationError | null {
  if (!name || typeof name !== "string") {
    return {
      field: "name",
      message: AUTH_MESSAGES.ERRORS.VALIDATION.NAME.REQUIRED,
    };
  }
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN_LENGTH) {
    return {
      field: "name",
      message: AUTH_MESSAGES.ERRORS.VALIDATION.NAME.MIN_LENGTH,
    };
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return {
      field: "name",
      message: AUTH_MESSAGES.ERRORS.VALIDATION.NAME.MAX_LENGTH,
    };
  }
  return null;
}

function sendValidationError(res: Response, errors: ValidationError[]) {
  return res.status(400).json({
    success: false,
    code: "VALIDATION_ERROR",
    message: AUTH_MESSAGES.ERRORS.VALIDATION.INVALID_CREDENTIALS.message,
    errors,
  });
}

// ============================================================================
// VALIDATORS
// ============================================================================

export function validateSignUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.body as SignUpRequest;

  const emailError = validateEmail(body.email);
  if (emailError) {
    throw new Error(emailError.message);
  }

  const passwordError = validatePassword(body.password);
  if (passwordError) throw new Error(passwordError.message);

  const nameError = validateName(body.name);
  if (nameError) throw new Error(nameError.message);

  // Sanitize
  req.body.email = body.email.trim().toLowerCase();
  req.body.name = body.name.trim();

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const body = req.body as LoginRequest;

  const emailError = validateEmail(body.email);
  if (emailError) throw new Error(emailError.message);

  if (!body.password || typeof body.password !== "string") {
    throw new Error(AUTH_MESSAGES.ERRORS.VALIDATION.PASSWORD.REQUIRED);
  }

  // Sanitize
  req.body.email = body.email.trim().toLowerCase();

  next();
}

export function validateForgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.body as ForgotPasswordRequest;

  const emailError = validateEmail(body.email);
  if (emailError) throw new Error(emailError.message);

  // Sanitize
  req.body.email = body.email.trim().toLowerCase();

  next();
}

export function validateResetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.body as ResetPasswordRequest;
  if (!body.token || typeof body.token !== "string") {
    throw new Error(AUTH_MESSAGES.ERRORS.VALIDATION.TOKEN.REQUIRED);
  }

  const passwordError = validatePassword(body.newPassword, "newPassword");
  if (passwordError) {
    throw new Error(passwordError.message);
  }

  next();
}

export function validateChangePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.body as ChangePasswordRequest;

  if (!body.currentPassword || typeof body.currentPassword !== "string") {
    throw new Error(AUTH_MESSAGES.ERRORS.VALIDATION.PASSWORD.REQUIRED);
  }

  const passwordError = validatePassword(body.newPassword, "newPassword");
  if (passwordError) throw new Error(passwordError.message);

  next();
}

export function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.body as RefreshTokenRequest;

  if (!body.refreshToken || typeof body.refreshToken !== "string") {
    throw new Error(AUTH_MESSAGES.ERRORS.VALIDATION.TOKEN.REQUIRED);
  }

  next();
}
