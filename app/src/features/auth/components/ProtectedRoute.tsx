"use client";

/**
 * Protected Route Wrapper
 * Redirects to login if not authenticated
 */

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<"SUPER_ADMIN" | "OWNER" | "STAFF">;
}

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role-based access
    if (
      !isLoading &&
      isAuthenticated &&
      requiredRoles &&
      user &&
      !requiredRoles.includes(user.type)
    ) {
      router.push("/unauthorized");
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.type)) {
    return null;
  }

  return <>{children}</>;
}
