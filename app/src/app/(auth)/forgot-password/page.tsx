import type { Metadata } from "next";
import { Box } from "@mui/material";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { APP_CONSTANTS } from "@/shared/data/app-constants";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - نسيت كلمة المرور`,
  description: "استعادة كلمة المرور",
};

export default function ForgotPasswordPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <ForgotPasswordForm />
    </Box>
  );
}
