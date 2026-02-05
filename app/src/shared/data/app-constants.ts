/**
 * App-wide constants and branding
 */

export const APP_CONSTANTS = {
  // Branding
  appName: "انستافلو",
  appNameEn: "InstaFlow",
  appTagline: "نظام إدارة المدفوعات الآمن والسريع",
  appDescription: "ابدأ رحلتك نحو إدارة مالية أذكى",

  // Contact
  supportEmail: "support@instaflow.com",
  contactEmail: "contact@instaflow.com",

  // Social Links
  social: {
    twitter: "https://twitter.com/instaflow",
    facebook: "https://facebook.com/instaflow",
    linkedin: "https://linkedin.com/company/instaflow",
  },

  // Branding Features
  brandFeatures: ["سريع", "آمن", "موثوق"],

  // URLs
  urls: {
    termsOfService: "/terms",
    privacyPolicy: "/privacy",
    helpCenter: "/help",
  },

  // Validation
  validation: {
    minPasswordLength: 8,
    minNameLength: 2,
    maxNameLength: 100,
  },
} as const;

export type AppConstants = typeof APP_CONSTANTS;
