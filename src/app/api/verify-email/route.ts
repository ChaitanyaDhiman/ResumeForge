import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyOtp } from '@/lib/otp';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();
        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const isValid = await verifyOtp(email, otp);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Mark user as verified
        await prisma.user.update({
            where: { email },
            data: { isEmailVerified: true },
        });

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
