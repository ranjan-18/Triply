import { Resend } from "resend";
import env from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export const sendOtpEmail = async (toEmail, otpCode) => {
  const { error } = await resend.emails.send({
    from: "Triply <onboarding@resend.dev>",
    to: [toEmail],
    subject: "Your Triply Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h2 style="color: #7c3aed;">Welcome to Triply!</h2>
        <p>Use the following OTP to verify your email address and complete your registration:</p>
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937; margin: 20px 0;">
          ${otpCode}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }
};
