import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOtp, createOtpToken } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Rate limit resending OTP per email
        const rateLimitResult = rateLimit(`resend-otp:${email}`, RATE_LIMITS.RESEND_OTP || { maxRequests: 5, windowMs: 10 * 60 * 1000 });
        if (!rateLimitResult.success) {
            return NextResponse.json({ error: 'Too many OTP requests. Please try again later.' }, {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': (RATE_LIMITS.RESEND_OTP?.maxRequests ?? 5).toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                },
            });
        }

        // Generate new OTP and store
        const otp = generateOtp();
        await createOtpToken(email, otp);
        await sendOtpEmail(email, otp);

        return NextResponse.json({ message: 'OTP resent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
