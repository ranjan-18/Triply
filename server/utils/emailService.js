import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT || 587,
  secure: env.SMTP_PORT == 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otpCode) => {
  const info = await transporter.sendMail({
    from: `"Triply" <${env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your Triply Verification Code",
    text: `Welcome to Triply! Your verification code is: ${otpCode}. It will expire in 10 minutes.`,
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

  console.log("OTP email sent successfully. Message ID:", info.messageId);
};
