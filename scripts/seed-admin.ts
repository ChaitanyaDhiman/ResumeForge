import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load admin credentials from .env.admin.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.admin.local') });

const prisma = new PrismaClient();

async function seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
        console.error('❌ Error: Admin credentials not found in .env.admin.local');
        console.error('Please ensure ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME are set.');
        process.exit(1);
    }

    console.log('🔐 Seeding admin user...');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);

    try {
        // Check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        const hashedPassword = await hash(adminPassword, 12);

        if (existingUser) {
            // Update existing user to admin
            const updatedUser = await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    name: adminName,
                    password: hashedPassword,
                    role: 'ADMIN',
                    optimizationLimit: null, // unlimited
                    isEmailVerified: true
                }
            });
            console.log('✅ Admin user updated successfully!');
            console.log(`   ID: ${updatedUser.id}`);
            console.log(`   Role: ${updatedUser.role}`);
            console.log(`   Optimization Limit: Unlimited`);
        } else {
            // Create new admin user
            const newUser = await prisma.user.create({
                data: {
                    email: adminEmail,
                    name: adminName,
                    password: hashedPassword,
                    role: 'ADMIN',
                    optimizationLimit: null, // unlimited
                    isEmailVerified: true
                }
            });
            console.log('✅ Admin user created successfully!');
            console.log(`   ID: ${newUser.id}`);
            console.log(`   Role: ${newUser.role}`);
            console.log(`   Optimization Limit: Unlimited`);
        }

        console.log('\n🎉 Admin seeding completed!');
        console.log('⚠️  Remember to change the password in .env.admin.local for security');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
