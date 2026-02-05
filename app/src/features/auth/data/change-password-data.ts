/**
 * Change password page static data
 */

export const CHANGE_PASSWORD_DATA = {
  // Page content
  title: "تغيير كلمة المرور",
  subtitle: "قم بتحديث كلمة المرور الخاصة بك للحفاظ على أمان حسابك",

  // Success message
  success: "تم تغيير كلمة المرور بنجاح!",

  // Form labels
  labels: {
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
  },

  // Buttons
  buttons: {
    submit: "تغيير كلمة المرور",
    submitting: "جاري التغيير...",
  },

  // Validation messages
  validation: {
    currentPasswordRequired: "كلمة المرور الحالية مطلوبة",
    newPasswordRequired: "كلمة المرور الجديدة مطلوبة",
    passwordMinLength: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    confirmPasswordRequired: "يرجى تأكيد كلمة المرور الجديدة",
    passwordsMismatch: "كلمتا المرور غير متطابقتين",
  },
} as const;

export type ChangePasswordData = typeof CHANGE_PASSWORD_DATA;
