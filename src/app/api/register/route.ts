import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { isValidEmail, isStrongPassword } from '@/lib/validation';
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit';
import { generateOtp, createOtpToken } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        // 1. Rate limiting by IP
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rateLimitResult = rateLimit(`register:${ip}`, RATE_LIMITS.REGISTER);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { message: 'Too many registration attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': RATE_LIMITS.REGISTER.maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                    }
                }
            );
        }

        // 2. Parse and validate input
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // 3. Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // 4. Validate password strength
        const passwordValidation = isStrongPassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: passwordValidation.message },
                { status: 400 }
            );
        }

        // 5. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        // 6. Hash password
        const hashedPassword = await hash(password, 12);

        // 7. Create user
        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashedPassword,
            },
        });

        // Generate OTP and send verification email
        const otp = generateOtp();
        await createOtpToken(email, otp);
        await sendOtpEmail(email, otp);

        return NextResponse.json(
            {
                message: 'User created successfully. Verification email sent.',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: false
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'An error occurred during registration. Please try again.' },
            { status: 500 }
        );
    }
}
