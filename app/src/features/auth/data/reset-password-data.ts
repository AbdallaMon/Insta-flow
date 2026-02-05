/**
 * Reset password page static data
 */

export const RESET_PASSWORD_DATA = {
  // Page content
  title: "إعادة تعيين كلمة المرور",
  subtitle: "أدخل كلمة المرور الجديدة أدناه",

  // Invalid token state
  invalidToken: {
    title: "رابط غير صالح",
    message:
      "الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.",
    requestNewLink: "طلب رابط جديد",
  },

  // Loading state
  loading: "جاري التحميل...",

  // Form labels
  labels: {
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
  },

  // Buttons
  buttons: {
    submit: "إعادة تعيين كلمة المرور",
    submitting: "جاري إعادة التعيين...",
  },

  // Validation messages
  validation: {
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMinLength: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    confirmPasswordRequired: "يرجى تأكيد كلمة المرور",
    passwordsMismatch: "كلمتا المرور غير متطابقتين",
  },
} as const;

export type ResetPasswordData = typeof RESET_PASSWORD_DATA;
