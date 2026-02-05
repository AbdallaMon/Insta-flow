"use client";

/**
 * Dashboard Page - Route Resolver
 * Redirects to role-specific dashboard
 */

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Route based on user type
    if (user?.type === "SUPER_ADMIN") {
      router.push("/dashboard/admin");
    } else if (user?.type === "OWNER") {
      router.push("/dashboard/owner");
    } else if (user?.type === "STAFF") {
      router.push("/dashboard/staff");
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Loading state
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
