/**
 * Login page static data
 */

export const LOGIN_DATA = {
  // Page content
  title: "مرحباً بعودتك",
  subtitle: "سجّل دخولك للوصول إلى حسابك",

  // Form labels
  labels: {
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
  },

  // Buttons
  buttons: {
    submit: "تسجيل الدخول",
    submitting: "جاري تسجيل الدخول...",
  },

  // Links
  links: {
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب جديد",
  },

  // Validation messages
  validation: {
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "عنوان البريد الإلكتروني غير صالح",
    passwordRequired: "كلمة المرور مطلوبة",
  },

  // Error messages
  errors: {
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  },

  // Misc
  dividerText: "أو",
} as const;

export type LoginData = typeof LOGIN_DATA;
