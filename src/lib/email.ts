// src/lib/email.ts
// Utility for sending OTP emails using Resend (https://resend.com)
// Ensure the environment variable RESEND_API_KEY is set in .env



/**
 * Sends an OTP code to the specified email address.
 * @param email Recipient email address
 * @param otp   6‑digit OTP string
 */
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('Resend API key not configured');
        return;
    }

    const body = {
        from: 'ResumeForge <no-reply@resumeforge.com>',
        to: email,
        subject: 'Your ResumeForge verification code',
        html: `
      <p>Hello,</p>
      <p>Your verification code is <strong style="font-size: 1.2em;">${otp}</strong>. It will expire in 15 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>Thanks,<br/>ResumeForge Team</p>
    `,
    };

    await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}
