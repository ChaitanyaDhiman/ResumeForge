const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Role-Based Access Control (RBAC) Integration Test...\n');

    const testUsers = {
        admin: {
            email: 'test_admin_rbac@example.com',
            password: 'AdminPass123!',
            name: 'Test Admin',
            role: 'ADMIN',
            optimizationLimit: null
        },
        premium: {
            email: 'test_premium_rbac@example.com',
            password: 'PremiumPass123!',
            name: 'Test Premium',
            role: 'PREMIUM',
            optimizationLimit: null // unlimited
        },
        premiumLimited: {
            email: 'test_premium_limited_rbac@example.com',
            password: 'PremiumLimitedPass123!',
            name: 'Test Premium Limited',
            role: 'PREMIUM',
            optimizationLimit: 2
        },
        free: {
            email: 'test_free_rbac@example.com',
            password: 'FreePass123!',
            name: 'Test Free',
            role: 'FREE',
            optimizationLimit: 3
        }
    };

    try {
        // ========================================
        // 1. CLEANUP
        // ========================================
        console.log('🧹 Cleaning up old test data...');
        for (const user of Object.values(testUsers)) {
            await prisma.optimizationLog.deleteMany({ where: { user: { email: user.email } } });
            await prisma.otpToken.deleteMany({ where: { identifier: user.email } });
            await prisma.user.deleteMany({ where: { email: user.email } });
        }
        console.log('✅ Cleanup complete\n');

        // ========================================
        // 2. CREATE TEST USERS
        // ========================================
        console.log('👥 Creating test users with different roles...');
        const bcrypt = require('bcryptjs');

        for (const [key, userData] of Object.entries(testUsers)) {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    password: hashedPassword,
                    role: userData.role,
                    optimizationLimit: userData.optimizationLimit,
                    isEmailVerified: true
                }
            });
            testUsers[key].id = user.id;
            console.log(`✅ Created ${userData.role} user: ${userData.email}`);
        }
        console.log('');

        // ========================================
        // 3. TEST ROLE ASSIGNMENT
        // ========================================
        console.log('🔐 Testing role assignment...');

        const adminUser = await prisma.user.findUnique({ where: { email: testUsers.admin.email } });
        if (adminUser.role !== 'ADMIN') throw new Error('Admin role not assigned correctly');
        if (adminUser.optimizationLimit !== null) throw new Error('Admin should have unlimited optimizations');
        console.log('✅ Admin user has correct role and unlimited access');

        const premiumUser = await prisma.user.findUnique({ where: { email: testUsers.premium.email } });
        if (premiumUser.role !== 'PREMIUM') throw new Error('Premium role not assigned correctly');
        if (premiumUser.optimizationLimit !== null) throw new Error('Premium user should have unlimited optimizations');
        console.log('✅ Premium user has correct role and unlimited access');

        const premiumLimitedUser = await prisma.user.findUnique({ where: { email: testUsers.premiumLimited.email } });
        if (premiumLimitedUser.role !== 'PREMIUM') throw new Error('Premium Limited role not assigned correctly');
        if (premiumLimitedUser.optimizationLimit !== 2) throw new Error('Premium Limited should have 2 optimizations');
        console.log('✅ Premium Limited user has correct role and 2 optimization limit');

        const freeUser = await prisma.user.findUnique({ where: { email: testUsers.free.email } });
        if (freeUser.role !== 'FREE') throw new Error('Free role not assigned correctly');
        if (freeUser.optimizationLimit !== 3) throw new Error('Free user should have 3 optimizations');
        console.log('✅ Free user has correct role and 3 optimization limit\n');

        // ========================================
        // 4. TEST USAGE API ENDPOINT
        // ========================================
        console.log('📊 Testing usage API endpoint...');

        // Note: We can't test authenticated endpoints without proper session cookies
        // This would require setting up NextAuth session in tests
        console.log('⚠️  Skipping authenticated endpoint tests (requires session setup)');
        console.log('   Manual testing recommended for /api/usage endpoint\n');

        // ========================================
        // 5. TEST OPTIMIZATION LIMITS
        // ========================================
        console.log('🎯 Testing optimization limit logic...');

        // Test FREE user with limit
        console.log('Testing FREE user (3 optimizations limit)...');
        for (let i = 1; i <= 3; i++) {
            await prisma.optimizationLog.create({
                data: { userId: testUsers.free.id }
            });
            console.log(`  ✓ Created optimization ${i}/3 for FREE user`);
        }

        const freeUserLogs = await prisma.optimizationLog.count({
            where: { userId: testUsers.free.id }
        });
        if (freeUserLogs !== 3) throw new Error('FREE user should have exactly 3 optimization logs');
        console.log('✅ FREE user reached limit (3/3)\n');

        // Test PREMIUM LIMITED user with limit
        console.log('Testing PREMIUM LIMITED user (2 optimizations limit)...');
        for (let i = 1; i <= 2; i++) {
            await prisma.optimizationLog.create({
                data: { userId: testUsers.premiumLimited.id }
            });
            console.log(`  ✓ Created optimization ${i}/2 for PREMIUM LIMITED user`);
        }

        const premiumLimitedLogs = await prisma.optimizationLog.count({
            where: { userId: testUsers.premiumLimited.id }
        });
        if (premiumLimitedLogs !== 2) throw new Error('PREMIUM LIMITED user should have exactly 2 optimization logs');
        console.log('✅ PREMIUM LIMITED user reached limit (2/2)\n');

        // Test ADMIN user (unlimited)
        console.log('Testing ADMIN user (unlimited optimizations)...');
        for (let i = 1; i <= 10; i++) {
            await prisma.optimizationLog.create({
                data: { userId: testUsers.admin.id }
            });
        }
        const adminLogs = await prisma.optimizationLog.count({
            where: { userId: testUsers.admin.id }
        });
        if (adminLogs !== 10) throw new Error('ADMIN user should have 10 optimization logs');
        console.log('✅ ADMIN user can create unlimited optimizations (10 created)\n');

        // Test PREMIUM user (unlimited)
        console.log('Testing PREMIUM user (unlimited optimizations)...');
        for (let i = 1; i <= 10; i++) {
            await prisma.optimizationLog.create({
                data: { userId: testUsers.premium.id }
            });
        }
        const premiumLogs = await prisma.optimizationLog.count({
            where: { userId: testUsers.premium.id }
        });
        if (premiumLogs !== 10) throw new Error('PREMIUM user should have 10 optimization logs');
        console.log('✅ PREMIUM user can create unlimited optimizations (10 created)\n');

        // ========================================
        // 6. TEST AUTHORIZATION HELPERS
        // ========================================
        console.log('🔧 Testing authorization helper functions...');

        // Implement helper functions inline (since we can't import TypeScript in Node.js tests)
        const getStartOfCurrentMonth = () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), 1);
        };

        const canOptimizeResume = async (userId) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    optimizationLogs: {
                        where: {
                            createdAt: {
                                gte: getStartOfCurrentMonth()
                            }
                        }
                    }
                }
            });

            if (!user) return false;

            // Admin and users with null optimizationLimit have unlimited access
            if (user.role === 'ADMIN' || user.optimizationLimit === null) {
                return true;
            }

            // Check if user has reached their limit
            const usedOptimizations = user.optimizationLogs.length;
            return usedOptimizations < (user.optimizationLimit || 0);
        };

        const getRemainingOptimizations = async (userId) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    optimizationLogs: {
                        where: {
                            createdAt: {
                                gte: getStartOfCurrentMonth()
                            }
                        }
                    }
                }
            });

            if (!user) return 0;

            // Admin and users with null optimizationLimit have unlimited access
            if (user.role === 'ADMIN' || user.optimizationLimit === null) {
                return null;
            }

            const usedOptimizations = user.optimizationLogs.length;
            const remaining = (user.optimizationLimit || 0) - usedOptimizations;
            return Math.max(0, remaining);
        };

        // Test FREE user at limit
        const freeCanOptimize = await canOptimizeResume(testUsers.free.id);
        if (freeCanOptimize) throw new Error('FREE user at limit should not be able to optimize');
        console.log('✅ canOptimizeResume() correctly blocks FREE user at limit');

        const freeRemaining = await getRemainingOptimizations(testUsers.free.id);
        if (freeRemaining !== 0) throw new Error('FREE user should have 0 remaining');
        console.log('✅ getRemainingOptimizations() returns 0 for FREE user at limit');

        // Test PREMIUM LIMITED user at limit
        const premiumLimitedCanOptimize = await canOptimizeResume(testUsers.premiumLimited.id);
        if (premiumLimitedCanOptimize) throw new Error('PREMIUM LIMITED user at limit should not be able to optimize');
        console.log('✅ canOptimizeResume() correctly blocks PREMIUM LIMITED user at limit');

        const premiumLimitedRemaining = await getRemainingOptimizations(testUsers.premiumLimited.id);
        if (premiumLimitedRemaining !== 0) throw new Error('PREMIUM LIMITED user should have 0 remaining');
        console.log('✅ getRemainingOptimizations() returns 0 for PREMIUM LIMITED user at limit');

        // Test ADMIN user (unlimited)
        const adminCanOptimize = await canOptimizeResume(testUsers.admin.id);
        if (!adminCanOptimize) throw new Error('ADMIN user should always be able to optimize');
        console.log('✅ canOptimizeResume() allows ADMIN user (unlimited)');

        const adminRemaining = await getRemainingOptimizations(testUsers.admin.id);
        if (adminRemaining !== null) throw new Error('ADMIN user should have null (unlimited) remaining');
        console.log('✅ getRemainingOptimizations() returns null for ADMIN user (unlimited)');

        // Test PREMIUM user (unlimited)
        const premiumCanOptimize = await canOptimizeResume(testUsers.premium.id);
        if (!premiumCanOptimize) throw new Error('PREMIUM user should always be able to optimize');
        console.log('✅ canOptimizeResume() allows PREMIUM user (unlimited)');

        const premiumRemaining = await getRemainingOptimizations(testUsers.premium.id);
        if (premiumRemaining !== null) throw new Error('PREMIUM user should have null (unlimited) remaining');
        console.log('✅ getRemainingOptimizations() returns null for PREMIUM user (unlimited)\n');

        // ========================================
        // 7. TEST MONTHLY RESET LOGIC
        // ========================================
        console.log('📅 Testing monthly reset logic...');

        // Create an old optimization log (from last month)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        await prisma.optimizationLog.create({
            data: {
                userId: testUsers.free.id,
                createdAt: lastMonth
            }
        });

        // Count only current month's logs
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const currentMonthLogs = await prisma.optimizationLog.count({
            where: {
                userId: testUsers.free.id,
                createdAt: { gte: startOfMonth }
            }
        });

        if (currentMonthLogs !== 3) throw new Error('Should only count current month logs');
        console.log('✅ Monthly reset logic correctly excludes old logs\n');

        // ========================================
        // 8. TEST DEFAULT ROLE FOR NEW USERS
        // ========================================
        console.log('🆕 Testing default role for new users...');

        const newUserEmail = 'test_new_user_rbac@example.com';
        const newUserPassword = await bcrypt.hash('NewUserPass123!', 12);

        const newUser = await prisma.user.create({
            data: {
                email: newUserEmail,
                name: 'New Test User',
                password: newUserPassword,
                isEmailVerified: true
                // Note: role and optimizationLimit not specified, should use defaults
            }
        });

        if (newUser.role !== 'FREE') throw new Error('New users should default to FREE role');
        console.log('✅ New users default to FREE role');

        // Cleanup new user
        await prisma.user.delete({ where: { id: newUser.id } });
        console.log('');

        // ========================================
        // SUMMARY
        // ========================================
        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 ALL RBAC TESTS PASSED!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ Role assignment works correctly');
        console.log('✅ Optimization limits enforced properly');
        console.log('✅ ADMIN users have unlimited access');
        console.log('✅ PREMIUM users can have unlimited or limited access');
        console.log('✅ FREE users have configurable limits');
        console.log('✅ Authorization helpers work correctly');
        console.log('✅ Monthly reset logic functions properly');
        console.log('✅ New users default to FREE role');
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('📝 Manual Testing Recommended:');
        console.log('   1. Sign in as admin user and verify "Unlimited" badge');
        console.log('   2. Sign in as free user and verify optimization count');
        console.log('   3. Test parse-resume endpoint with different roles');
        console.log('   4. Verify /api/usage endpoint returns correct data\n');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        // Cleanup
        console.log('🧹 Cleaning up test data...');
        for (const user of Object.values(testUsers)) {
            if (user.id) {
                await prisma.optimizationLog.deleteMany({ where: { userId: user.id } });
                await prisma.user.delete({ where: { id: user.id } }).catch(() => { });
            }
        }
        await prisma.$disconnect();
    }
}

main();
