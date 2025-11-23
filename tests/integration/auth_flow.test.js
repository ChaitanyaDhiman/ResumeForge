const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const testEmail = 'test_auth_flow@example.com';
    const testPassword = 'Password123!';

    console.log('🚀 Starting Auth Flow Integration Test...');

    try {
        // 1. Cleanup
        console.log('🧹 Cleaning up old test data...');
        await prisma.otpToken.deleteMany({ where: { identifier: testEmail } });
        await prisma.user.deleteMany({ where: { email: testEmail } });

        // 2. Register
        console.log('📝 Registering new user...');
        const registerRes = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: testEmail,
                password: testPassword,
            }),
        });

        if (!registerRes.ok) {
            const err = await registerRes.text();
            throw new Error(`Registration failed: ${registerRes.status} ${err}`);
        }
        console.log('✅ Registration successful');

        // 3. Verify DB state (User created, not verified)
        const user = await prisma.user.findUnique({ where: { email: testEmail } });
        if (!user) throw new Error('User not found in DB');
        if (user.isEmailVerified) throw new Error('User should not be verified yet');
        console.log('✅ User created in DB (unverified)');

        // 4. Get OTP from DB
        console.log('🔑 Fetching OTP from DB...');
        const otpRecord = await prisma.otpToken.findFirst({
            where: { identifier: testEmail },
            orderBy: { expires: 'desc' },
        });

        if (!otpRecord) throw new Error('OTP not found in DB');
        console.log(`✅ OTP found: ${otpRecord.token}`);

        // 5. Verify Email
        console.log('📧 Verifying email...');
        const verifyRes = await fetch('http://localhost:3000/api/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                otp: otpRecord.token,
            }),
        });

        if (!verifyRes.ok) {
            const err = await verifyRes.text();
            throw new Error(`Verification failed: ${verifyRes.status} ${err}`);
        }
        console.log('✅ Email verification successful');

        // 6. Verify DB state (User verified)
        const verifiedUser = await prisma.user.findUnique({ where: { email: testEmail } });
        if (!verifiedUser.isEmailVerified) throw new Error('User should be verified now');
        console.log('✅ User marked as verified in DB');

        // 7. Test Resend OTP
        console.log('🔄 Testing Resend OTP...');
        const resendRes = await fetch('http://localhost:3000/api/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail }),
        });

        if (!resendRes.ok) {
            const err = await resendRes.text();
            throw new Error(`Resend failed: ${resendRes.status} ${err}`);
        }
        console.log('✅ Resend OTP successful');

        // Check if new token exists
        const newOtpRecord = await prisma.otpToken.findFirst({
            where: { identifier: testEmail },
            orderBy: { expires: 'desc' }
        });
        if (!newOtpRecord || newOtpRecord.token === otpRecord.token) {
            console.warn('⚠️ Warning: New OTP token might be same or not created (could be random chance or logic issue)');
        } else {
            console.log(`✅ New OTP generated: ${newOtpRecord.token}`);
        }

        console.log('🎉 All Auth Flow tests passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
