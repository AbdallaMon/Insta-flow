import type { Metadata } from "next";
import { Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";
import { HiNoSymbol, HiArrowLeft } from "react-icons/hi2";
import { ACCOUNT_SUSPENDED_DATA } from "@/features/auth/data";
import { APP_CONSTANTS } from "@/shared/data/app-constants";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - الحساب موقوف`,
  description: "حسابك موقوف حالياً",
};

export default function AccountSuspendedPage() {
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
          <HiNoSymbol size={48} color="#EF4444" />
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} mb={2}>
          {ACCOUNT_SUSPENDED_DATA.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          {ACCOUNT_SUSPENDED_DATA.message}
        </Typography>
        <Link href="/login">
          <Button
            variant="contained"
            size="large"
            startIcon={<HiArrowLeft size={18} />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {ACCOUNT_SUSPENDED_DATA.backToLogin}
          </Button>
        </Link>
      </Paper>
    </Box>
  );
}
