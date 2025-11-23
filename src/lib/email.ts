// src/lib/email.ts
// Utility for sending OTP emails using Resend (https://resend.com)
// Ensure the environment variable RESEND_API_KEY is set in .env

interface ResendResponse {
    id?: string;
    error?: {
        message: string;
        name: string;
    };
}

/**
 * Sends an OTP code to the specified email address with retry logic.
 * @param email Recipient email address
 * @param otp   6‑digit OTP string
 * @throws Error if email sending fails after retries
 */
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        const error = 'RESEND_API_KEY not configured in environment variables';
        console.error('[Email Service]', error);
        throw new Error('Email service not configured');
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

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data: ResendResponse = await response.json();

            if (!response.ok) {
                const errorMessage = data.error?.message || `HTTP ${response.status}`;
                throw new Error(`Resend API error: ${errorMessage}`);
            }

            if (data.id) {
                console.log(`[Email Service] Successfully sent OTP to ${email} (ID: ${data.id})`);
                return; // Success!
            } else {
                throw new Error('Resend API returned success but no email ID');
            }
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            console.error(`[Email Service] Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

            // Don't retry on client errors (4xx), only on server errors (5xx) or network issues
            if (error instanceof Error && error.message.includes('HTTP 4')) {
                throw lastError;
            }

            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // All retries failed
    console.error(`[Email Service] Failed to send OTP to ${email} after ${maxRetries} attempts`);
    throw lastError || new Error('Failed to send email');
}
