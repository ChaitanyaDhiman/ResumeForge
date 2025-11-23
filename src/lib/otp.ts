import { prisma } from '@/lib/db';

/**
 * Generates a 6-digit numeric OTP as a string.
 */
export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Creates an OTP token entry in the database for the given email.
 * The token expires after the configured OTP_EXPIRY_MINUTES (default 15).
 */
export async function createOtpToken(email: string, token: string): Promise<void> {
    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 15;
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expiryMinutes);

    await prisma.otpToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });
}

/**
 * Verifies the provided OTP for the given email.
 * Returns true if the token exists and is not expired; otherwise false.
 * On successful verification the token is deleted.
 */
export async function verifyOtp(email: string, token: string): Promise<boolean> {
    const record = await prisma.otpToken.findUnique({
        where: {
            identifier_token: {
                identifier: email,
                token,
            },
        },
    });

    if (!record) return false;
    if (record.expires < new Date()) {
        // Expired – clean up
        await prisma.otpToken.delete({
            where: { identifier_token: { identifier: email, token } },
        });
        return false;
    }

    // Valid – delete the token and return true
    await prisma.otpToken.delete({
        where: { identifier_token: { identifier: email, token } },
    });
    return true;
}
