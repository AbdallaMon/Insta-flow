import type { Metadata } from "next";
import { Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";
import { HiPauseCircle, HiArrowLeft } from "react-icons/hi2";
import { ACCOUNT_INACTIVE_DATA } from "@/features/auth/data";
import { APP_CONSTANTS } from "@/shared/data/app-constants";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - الحساب غير مُفعّل`,
  description: "حسابك غير مفعّل حالياً",
};

export default function AccountInactivePage() {
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
            bgcolor: "warning.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <HiPauseCircle size={48} color="#F59E0B" />
        </Box>

        <Typography variant="h4" component="h1" fontWeight={700} mb={2}>
          {ACCOUNT_INACTIVE_DATA.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          {ACCOUNT_INACTIVE_DATA.message}
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
            {ACCOUNT_INACTIVE_DATA.backToLogin}
          </Button>
        </Link>
      </Paper>
    </Box>
  );
}
