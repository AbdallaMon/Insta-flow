import type { Metadata } from "next";
import { Box } from "@mui/material";
import { APP_CONSTANTS } from "@/shared/data/app-constants";
import UnauthorizedContent from "./content";

export const metadata: Metadata = {
  title: `${APP_CONSTANTS.appName} - تم رفض الوصول`,
  description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
};

export default function UnauthorizedPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <UnauthorizedContent />
    </Box>
  );
}
