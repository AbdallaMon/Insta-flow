/**
 * Sign up page static data
 */

export const SIGNUP_DATA = {
  // Page content
  title: "إنشاء حساب جديد",
  subtitle: "انضم إلينا واستمتع بإدارة مالية أفضل",

  // Form labels
  labels: {
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
  },

  // Buttons
  buttons: {
    submit: "إنشاء الحساب",
    submitting: "جاري إنشاء الحساب...",
  },

  // Links
  links: {
    hasAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
  },

  // Validation messages
  validation: {
    nameRequired: "الاسم مطلوب",
    nameMinLength: "يجب أن يكون الاسم حرفين على الأقل",
    nameMaxLength: "يجب ألا يتجاوز الاسم 100 حرف",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "عنوان البريد الإلكتروني غير صالح",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMinLength: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
  },

  // Error messages
  errors: {
    signUpFailed: "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.",
  },

  // Features list (shown on branding side)
  features: [
    "إدارة المدفوعات بسهولة",
    "تقارير مالية متقدمة",
    "أمان عالي المستوى",
    "دعم فني على مدار الساعة",
  ],

  // Misc
  dividerText: "أو",
} as const;

export type SignupData = typeof SIGNUP_DATA;
