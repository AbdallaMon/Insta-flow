"use client";

/**
 * Staff Dashboard
 */

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && user.type !== "STAFF") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading your dashboard...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated || user?.type !== "STAFF") {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <div>
            <Typography variant="h3" component="h1" mb={2}>
              Staff Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome, {user?.name}!
            </Typography>
          </div>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/change-password")}
            >
              Change Password
            </Button>
            <Button variant="contained" color="error" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                My Transactions
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.palette.primary.main }}
              >
                —
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today&apos;s Sales
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.palette.secondary.main }}
              >
                —
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Orders
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: theme.palette.warning.main }}
              >
                —
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Account Status
              </Typography>
              theme.palette.success.main
              <Typography variant="h5" sx={{ color: "green" }}>
                {user?.status}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* User Info */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Account Information
            </Typography>
            <Typography variant="body2" mb={1}>
              Email: {user?.email}
            </Typography>
            <Typography variant="body2" mb={1}>
              Role: {user?.type}
            </Typography>
            <Typography variant="body2">Status: {user?.status}</Typography>
            {user?.parentUserId && (
              <Typography variant="body2" mt={1}>
                Organization ID: {user?.parentUserId}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Available Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Staff Features
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="contained" color="primary">
                New Transaction
              </Button>
              <Button variant="contained" color="primary">
                View History
              </Button>
              <Button variant="outlined" color="primary">
                My Profile
              </Button>
              <Button variant="outlined" color="primary">
                Help & Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
