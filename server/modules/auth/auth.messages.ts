import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "./auth.validators.js";

export const AUTH_MESSAGES = {
  ERRORS: {
    VALIDATION: {
      NAME: {
        MIN_LENGTH: `يجب ألا يقل الاسم عن ${NAME_MIN_LENGTH} حرفًا`,
        MAX_LENGTH: `يجب ألا يزيد الاسم عن ${NAME_MAX_LENGTH} حرفًا`,
        REQUIRED: "الاسم مطلوب",
      },
      PASSWORD: {
        MIN_LENGTH: `يجب ألا تقل كلمة المرور عن ${PASSWORD_MIN_LENGTH} حرفًا`,
        MAX_LENGTH: `يجب ألا تزيد كلمة المرور عن ${PASSWORD_MAX_LENGTH} حرفًا`,
        FORMAT:
          "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل، وحرف صغير واحد على الأقل، ورقم واحد على الأقل",
        REQUIRED: "كلمة المرور مطلوبة",
      },
      EMAIL: {
        REQUIRED: "البريد الإلكتروني مطلوب",
        FORMAT: "صيغة البريد الإلكتروني غير صحيحة",
      },
      TOKEN: {
        REQUIRED: "الرمز مطلوب",
      },
      INVALID_CREDENTIALS: {
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      },
    },
    INVALID_CREDENTIALS: {
      code: "INVALID_CREDENTIALS",
      message: "البريد إلكتروني أو كلمة المرور غير صحيحة",
    },
    USER_NOT_FOUND: {
      code: "USER_NOT_FOUND",
      message: "المستخدم غير موجود",
    },
    EMAIL_ALREADY_EXISTS: {
      code: "EMAIL_ALREADY_EXISTS",
      message: "البريد الإلكتروني مستخدم بالفعل",
      field: "email",
    },
    INVALID_TOKEN: {
      code: "INVALID_TOKEN",
      message: "الرمز غير صالح",
    },
    TOKEN_EXPIRED: {
      code: "TOKEN_EXPIRED",
      message: "انتهت صلاحية الرمز",
    },
    USER_INACTIVE: {
      code: "USER_INACTIVE",
      message: "المستخدم غير نشط",
    },
    USER_SUSPENDED: {
      code: "USER_SUSPENDED",
      message: "المستخدم معلق",
    },
    UNAUTHORIZED: {
      code: "UNAUTHORIZED",
      message: "المصادقة مطلوبة",
    },
    FORBIDDEN: {
      code: "FORBIDDEN",
      message: "ليس لديك إذن للوصول إلى هذا المورد",
    },

    INVALID_PASSWORD: {
      code: "INVALID_PASSWORD",
      message: "كلمة المرور الحالية غير صحيحة",
    },
    TOKEN_REVOKED: {
      code: "TOKEN_REVOKED",
      message: "تم إبطال الرمز. يرجى تسجيل الدخول مرة أخرى.",
    },
  },
  SUCCESS: {
    SIGN_UP: "تم إنشاء الحساب بنجاح",
    LOGIN: "تم تسجيل الدخول بنجاح",
    LOGOUT: "تم تسجيل الخروج بنجاح",
    PASSWORD_RESET_EMAIL_SENT:
      "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    PASSWORD_CHANGED: "تم تغيير كلمة المرور بنجاح",
  },
} as const;
