import type { Metadata } from "next";
import { Box } from "@mui/material";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { APP_CONSTANTS } from "@/shared/data/app-constants";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - تسجيل الدخول`,
  description: "تسجيل الدخول إلى حسابك الآمن",
};

export default function LoginPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <LoginForm />
    </Box>
  );
}
