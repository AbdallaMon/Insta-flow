import type { Metadata } from "next";
import { Box } from "@mui/material";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { APP_CONSTANTS } from "@/shared/data/app-constants";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - تغيير كلمة المرور`,
  description: "تغيير كلمة المرور الخاصة بك",
};

export default function ChangePasswordPage() {
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
      <ChangePasswordForm />
    </Box>
  );
}
