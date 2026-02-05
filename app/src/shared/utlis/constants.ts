// src/theme/colors.ts
// InstaFlow Theme A — Fintech Clean
// keys مباشرة: colors.primary / colors.bg / colors.success ... إلخ

export const colors = {
  // Brand
  primary: "#2563EB", // Trust Blue - primary actions / links
  accent: "#22C55E", // Success Green - confirmations / "Paid"

  // Semantics (Statuses)
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",

  // Neutrals
  bg: "#F8FAFC", // page background
  surface: "#FFFFFF", // cards / modals / table surface
  text: "#0F172A", // main text
  muted: "#64748B", // secondary text / placeholders
  border: "#E2E8F0", // borders / dividers

  // States (Hover/Active/Focus/Disabled)
  primaryHover: "#1D4ED8",
  primaryActive: "#1E40AF",
  accentHover: "#16A34A",
  accentActive: "#15803D",
  focusRing: "rgba(37, 99, 235, 0.25)",
  disabledBg: "#E2E8F0",
  disabledText: "#94A3B8",

  // Tints (Backgrounds for badges/alerts)
  primaryBg: "#EFF6FF",
  accentBg: "#ECFDF5",
  successBg: "#ECFDF5",
  warningBg: "#FFFBEB",
  dangerBg: "#FEF2F2",
  infoBg: "#F0F9FF",

  // Badge text (good contrast on tints)
  primaryText: "#1D4ED8",
  successText: "#166534",
  warningText: "#92400E",
  dangerText: "#991B1B",
  infoText: "#075985",

  // Layout helpers
  tableHeaderBg: "#F1F5F9",
  rowHoverBg: "#F8FAFC",
  divider: "#E2E8F0",

  // Gradient (Hero)
  heroGradient: "linear-gradient(90deg, #2563EB 0%, #0EA5E9 100%)",
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
export const initialPageLimit = 10 as const;
export const totalLimitPages = [10, 20, 50, 100];
