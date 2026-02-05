import type { Metadata } from "next";
import { Box } from "@mui/material";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { APP_CONSTANTS } from "@/shared/data/app-constants";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - إنشاء حساب`,
  description: "إنشاء حساب جديد آمن",
};

export default function SignUpPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <SignUpForm />
    </Box>
  );
}
