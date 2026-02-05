"use client";

import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { Suspense } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
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
          <HiExclamationCircle size={48} color="#EF4444" />
        </Box>

        <Typography variant="h5" fontWeight={700} mb={2}>
          رابط غير صالح
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد لإعادة تعيين
          كلمة المرور.
        </Typography>
        <Link
          href="/forgot-password"
          style={{
            color: "inherit",
            fontWeight: 600,
          }}
        >
          طلب رابط جديد
        </Link>
      </Paper>
    );
  }

  return <ResetPasswordForm token={token} />;
}

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RiSecurePaymentLine size={32} color="white" />
      </Box>
      <CircularProgress />
      <Typography color="text.secondary">جاري التحميل...</Typography>
    </Box>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordContent />
      </Suspense>
    </Box>
  );
}
