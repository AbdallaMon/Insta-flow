"use client";

/**
 * Authentication Provider
 * Manages global authentication state
 */

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AuthUser,
  LoginRequest,
  SignUpRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LoginResponse,
  SignUpResponse,
} from "@/features/auth/types";
import {
  setAccessToken,
  setRefreshToken,
  setStoredUser,
  clearAllTokens,
  getStoredUser,
} from "@/shared/utlis/auth-tokens";
import { toast } from "react-toastify";
import { submitData } from "@/shared/lib/fetchers/submit";
import { getData } from "@/shared/lib/fetchers/get";
import { useLoading } from "./LoadingProvider";

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<boolean>;
  signUp: (data: SignUpRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<boolean>;
  resetPassword: (data: ResetPasswordRequest) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

// ============================================================================
// PROVIDER
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading } = useLoading();

  // ============================================================================
  // Initialize auth state on mount
  // ============================================================================

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = getStoredUser() as AuthUser | null;
        if (storedUser) {
          setUser(storedUser);
        }

        // Verify with backend
        const response = await getData<{ user: AuthUser }>({
          path: "/auth/me",
          setLoading: setIsLoading,
          setData: (data) => {
            if (data && "user" in data) {
              setUser(data.user);
              setStoredUser(data.user);
            }
          },
          setError: () => {
            clearAllTokens();
            setUser(null);
          },
        });

        if (!response || !response.data) {
          // Invalid session
          clearAllTokens();
          setUser(null);
        }
      } catch {
        // Session invalid or network error
        clearAllTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ============================================================================
  // LOGIN
  // ============================================================================

  const login = useCallback(
    async (data: LoginRequest): Promise<boolean> => {
      try {
        const response = await submitData<LoginResponse, LoginRequest>({
          data,
          path: "/auth/login",
          setLoading,
          setData: (responseData) => {
            if (
              responseData &&
              "user" in responseData &&
              "tokens" in responseData
            ) {
              const { user, tokens } = responseData;
              setAccessToken(tokens.accessToken);
              setRefreshToken(tokens.refreshToken);
              setStoredUser(user);
              setUser(user);
            }
          },
          toastMessage: "جاري تسجيل الدخول...",
          method: "post",
          options: { skipAuth: true },
        });

        if (response.data) {
          router.push("/dashboard");
          return true;
        }
        return false;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "حصل خطأ أثناء تسجيل الدخول";
        toast.error(errorMessage);
        return false;
      }
    },
    [router, setLoading],
  );

  // ============================================================================
  // SIGN UP
  // ============================================================================

  const signUp = useCallback(
    async (data: SignUpRequest): Promise<boolean> => {
      try {
        const response = await submitData<SignUpResponse, SignUpRequest>({
          data,
          path: "/auth/signup",
          setLoading,
          setData: (responseData) => {
            if (
              responseData &&
              "user" in responseData &&
              "tokens" in responseData
            ) {
              const { user, tokens } = responseData;
              setAccessToken(tokens.accessToken);
              setRefreshToken(tokens.refreshToken);
              setStoredUser(user);
              setUser(user);
            }
          },
          toastMessage: "جاري إنشاء الحساب...",
          method: "post",
          options: { skipAuth: true },
        });

        if (response.data) {
          router.push("/dashboard");
          return true;
        }
        return false;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "حصل خطأ أثناء إنشاء الحساب";
        toast.error(errorMessage);
        return false;
      }
    },
    [router, setLoading],
  );

  // ============================================================================
  // LOGOUT
  // ============================================================================

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call backend logout
      await submitData<void, never>({
        path: "/auth/logout",
        setLoading,
        toastMessage: "جاري تسجيل الخروج...",
        method: "post",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state
      clearAllTokens();
      setUser(null);
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
    }
  }, [router, setLoading]);

  // ============================================================================
  // CHANGE PASSWORD
  // ============================================================================

  const changePassword = useCallback(
    async (data: ChangePasswordRequest): Promise<boolean> => {
      try {
        const response = await submitData<void, ChangePasswordRequest>({
          data,
          path: "/auth/change-password",
          setLoading,
          toastMessage: "جاري تغيير كلمة المرور...",
          method: "post",
        });

        return !!response.message;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "حصل خطأ أثناء تغيير كلمة المرور";
        toast.error(errorMessage);
        return false;
      }
    },
    [setLoading],
  );

  // ============================================================================
  // FORGOT PASSWORD
  // ============================================================================

  const forgotPassword = useCallback(
    async (data: ForgotPasswordRequest): Promise<boolean> => {
      try {
        const response = await submitData<void, ForgotPasswordRequest>({
          data,
          path: "/auth/forgot-password",
          setLoading,
          toastMessage: "جاري إرسال رابط إعادة تعيين كلمة المرور...",
          method: "post",
          options: { skipAuth: true },
        });

        return !!response.message;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "حصل خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور";
        toast.error(errorMessage);
        return false;
      }
    },
    [setLoading],
  );

  // ============================================================================
  // RESET PASSWORD
  // ============================================================================

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest): Promise<boolean> => {
      try {
        const response = await submitData<void, ResetPasswordRequest>({
          data,
          path: "/auth/reset-password",
          setLoading,
          toastMessage: "جاري إعادة تعيين كلمة المرور...",
          method: "post",
          options: { skipAuth: true },
        });

        if (response.message) {
          router.push("/login");
          return true;
        }
        return false;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "حصل خطأ أثناء إعادة تعيين كلمة المرور";
        toast.error(errorMessage);
        return false;
      }
    },
    [router, setLoading],
  );

  // ============================================================================
  // REFRESH USER
  // ============================================================================

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      await getData<{ user: AuthUser }>({
        path: "/auth/me",
        setLoading,
        setData: (data) => {
          if (data && "user" in data) {
            setUser(data.user);
            setStoredUser(data.user);
          }
        },
      });
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  }, [setLoading]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signUp,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
