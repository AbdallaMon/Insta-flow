/**
 * Status pages static data (account-inactive, account-suspended, unauthorized)
 */

export const ACCOUNT_INACTIVE_DATA = {
  title: "الحساب غير مُفعّل",
  message: "حسابك غير مفعّل حالياً. يرجى التواصل مع الدعم الفني للمساعدة.",
  backToLogin: "العودة لتسجيل الدخول",
} as const;

export const ACCOUNT_SUSPENDED_DATA = {
  title: "الحساب موقوف",
  message: "تم إيقاف حسابك. يرجى التواصل مع الدعم الفني لمزيد من المعلومات.",
  backToLogin: "العودة لتسجيل الدخول",
} as const;

export const UNAUTHORIZED_DATA = {
  title: "تم رفض الوصول",
  message: "ليس لديك صلاحية للوصول إلى هذه الصفحة.",
  buttons: {
    dashboard: "اللوحة الرئيسية",
    logout: "تسجيل الخروج",
  },
} as const;

export type AccountInactiveData = typeof ACCOUNT_INACTIVE_DATA;
export type AccountSuspendedData = typeof ACCOUNT_SUSPENDED_DATA;
export type UnauthorizedData = typeof UNAUTHORIZED_DATA;
