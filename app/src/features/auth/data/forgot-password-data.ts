/**
 * Forgot password page static data
 */

export const FORGOT_PASSWORD_DATA = {
  // Page content
  title: "نسيت كلمة المرور؟",
  subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",

  // Success state
  success: {
    title: "تفقّد بريدك الإلكتروني",
    message:
      "إذا كان الحساب موجوداً، تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
  },

  // Form labels
  labels: {
    email: "البريد الإلكتروني",
  },

  // Buttons
  buttons: {
    submit: "إرسال رابط إعادة التعيين",
    submitting: "جاري الإرسال...",
  },

  // Links
  links: {
    backToLogin: "العودة لتسجيل الدخول",
  },

  // Validation messages
  validation: {
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "عنوان البريد الإلكتروني غير صالح",
  },
} as const;

export type ForgotPasswordData = typeof FORGOT_PASSWORD_DATA;
