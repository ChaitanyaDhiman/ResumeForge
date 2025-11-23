import { PrismaClient } from '@prisma/client';
import { canOptimizeResume, getRemainingOptimizations } from '../../src/lib/auth';

// Simple test runner since we don't have a full test framework installed for TS
const prisma = new PrismaClient();

async function runTests() {
    console.log('🚀 Starting Unit Tests for src/lib/auth.ts...\n');

    const testUsers = {
        admin: {
            email: 'unit_test_admin@example.com',
            role: 'ADMIN' as const,
            optimizationLimit: null
        },
        premium: {
            email: 'unit_test_premium@example.com',
            role: 'PREMIUM' as const,
            optimizationLimit: null
        },
        free: {
            email: 'unit_test_free@example.com',
            role: 'FREE' as const,
            optimizationLimit: 3
        }
    };

    try {
        // Setup
        console.log('🧹 Setting up test data...');
        for (const user of Object.values(testUsers)) {
            await prisma.optimizationLog.deleteMany({ where: { user: { email: user.email } } });
            await prisma.user.deleteMany({ where: { email: user.email } });

            await prisma.user.create({
                data: {
                    email: user.email,
                    role: user.role,
                    optimizationLimit: user.optimizationLimit,
                    isEmailVerified: true
                }
            });
        }

        const adminUser = await prisma.user.findUnique({ where: { email: testUsers.admin.email } });
        const premiumUser = await prisma.user.findUnique({ where: { email: testUsers.premium.email } });
        const freeUser = await prisma.user.findUnique({ where: { email: testUsers.free.email } });

        if (!adminUser || !premiumUser || !freeUser) throw new Error('Failed to create test users');

        console.log('✅ Test data setup complete\n');

        // Test 1: Admin Access
        console.log('🧪 Test 1: Admin Access');
        const adminCanOptimize = await canOptimizeResume(adminUser.id);
        if (adminCanOptimize !== true) throw new Error('Admin should be able to optimize');
        console.log('  ✓ Admin can optimize');

        const adminRemaining = await getRemainingOptimizations(adminUser.id);
        if (adminRemaining !== null) throw new Error('Admin should have null remaining');
        console.log('  ✓ Admin has null remaining');

        // Test 2: Premium Access (Unlimited)
        console.log('\n🧪 Test 2: Premium Access (Unlimited)');
        const premiumCanOptimize = await canOptimizeResume(premiumUser.id);
        if (premiumCanOptimize !== true) throw new Error('Premium should be able to optimize');
        console.log('  ✓ Premium can optimize');

        const premiumRemaining = await getRemainingOptimizations(premiumUser.id);
        if (premiumRemaining !== null) throw new Error('Premium should have null remaining');
        console.log('  ✓ Premium has null remaining');

        // Test 3: Free Access (Limited)
        console.log('\n🧪 Test 3: Free Access (Limited)');

        // Initially should have 3 remaining
        let freeRemaining = await getRemainingOptimizations(freeUser.id);
        if (freeRemaining !== 3) throw new Error(`Free user should have 3 remaining, got ${freeRemaining}`);
        console.log('  ✓ Free user starts with 3 remaining');

        // Use up 3 optimizations
        for (let i = 0; i < 3; i++) {
            await prisma.optimizationLog.create({ data: { userId: freeUser.id } });
        }

        // Should now have 0 remaining
        freeRemaining = await getRemainingOptimizations(freeUser.id);
        if (freeRemaining !== 0) throw new Error(`Free user should have 0 remaining, got ${freeRemaining}`);
        console.log('  ✓ Free user has 0 remaining after usage');

        const freeCanOptimize = await canOptimizeResume(freeUser.id);
        if (freeCanOptimize !== false) throw new Error('Free user should NOT be able to optimize');
        console.log('  ✓ Free user blocked from optimization');

        console.log('\n🎉 All Unit Tests Passed!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error);
        process.exit(1);
    } finally {
        // Cleanup
        console.log('\n🧹 Cleaning up...');
        for (const user of Object.values(testUsers)) {
            await prisma.optimizationLog.deleteMany({ where: { user: { email: user.email } } });
            await prisma.user.deleteMany({ where: { email: user.email } });
        }
        await prisma.$disconnect();
    }
}

runTests();
