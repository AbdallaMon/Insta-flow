"use client";

import { Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  HiOutlineLockClosed,
  HiOutlineViewGrid,
  HiOutlineLogout,
} from "react-icons/hi";
import { UNAUTHORIZED_DATA } from "@/features/auth/data";

export default function UnauthorizedContent() {
  const { logout } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "error.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <HiOutlineLockClosed size={48} color="#EF4444" />
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} mb={2}>
          {UNAUTHORIZED_DATA.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          {UNAUTHORIZED_DATA.message}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Link href="/dashboard">
            <Button
              variant="outlined"
              size="large"
              startIcon={<HiOutlineViewGrid size={18} />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {UNAUTHORIZED_DATA.buttons.dashboard}
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => logout()}
            startIcon={<HiOutlineLogout size={18} />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {UNAUTHORIZED_DATA.buttons.logout}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
