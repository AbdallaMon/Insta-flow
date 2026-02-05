import "dotenv/config";

import { sendEmail } from "../utility/sendEmail.js";
const FRONTEND_URL = process.env.FRONTEND_URL;
const EMAIL_TEMPLATES = {
  RESET_PASSWORD: {
    subject: "أعادة تعيين كلمة السر",
    htmlContent: ({ resetToken }: { resetToken: string }) => `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">إعادة تعيين كلمة السر</h2>
            <p>لقد طلبت إعادة تعيين كلمة السر الخاصة بك. الرجاء استخدام الرابط التالي لإعادة تعيين كلمة السر الخاصة بك:</p>
            <a href="${FRONTEND_URL}/reset-password?token=${resetToken}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة السر</a>
            <p>إذا لم تطلب إعادة تعيين كلمة السر، يرجى تجاهل هذا البريد الإلكتروني.</p>
        </div>
        `,
  },
};
export async function sendResetPasswordEmail(
  email: string,
  resetToken: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: EMAIL_TEMPLATES.RESET_PASSWORD.subject,
    htmlContent: EMAIL_TEMPLATES.RESET_PASSWORD.htmlContent({ resetToken }),
  });
}
