import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "ADMIN";
}

/**
 * Check if the current user is premium or admin
 */
export async function isPremium(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "PREMIUM" || session?.user?.role === "ADMIN";
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<"ADMIN" | "PREMIUM" | "FREE" | null> {
    const session = await getServerSession(authOptions);
    return session?.user?.role || null;
}

/**
 * Check if a user can optimize their resume
 * @param userId - The user's ID
 * @returns true if the user has optimizations remaining or unlimited access
 */
export async function canOptimizeResume(userId: string): Promise<boolean> {
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

    if (!user) {
        return false;
    }

    // Admin and users with null optimizationLimit have unlimited access
    if (user.role === "ADMIN" || user.optimizationLimit === null) {
        return true;
    }

    // Check if user has reached their limit
    const usedOptimizations = user.optimizationLogs.length;
    return usedOptimizations < (user.optimizationLimit || 0);
}

/**
 * Get the number of remaining optimizations for a user
 * @param userId - The user's ID
 * @returns The number of remaining optimizations, or null for unlimited
 */
export async function getRemainingOptimizations(userId: string): Promise<number | null> {
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

    if (!user) {
        return 0;
    }

    // Admin and users with null optimizationLimit have unlimited access
    if (user.role === "ADMIN" || user.optimizationLimit === null) {
        return null;
    }

    const usedOptimizations = user.optimizationLogs.length;
    const remaining = (user.optimizationLimit || 0) - usedOptimizations;
    return Math.max(0, remaining);
}

/**
 * Get the start of the current month
 */
function getStartOfCurrentMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Require admin access - throws error if not admin
 */
export async function requireAdmin(): Promise<void> {
    const admin = await isAdmin();
    if (!admin) {
        throw new Error("Unauthorized: Admin access required");
    }
}

/**
 * Require premium or admin access - throws error if not premium/admin
 */
export async function requirePremium(): Promise<void> {
    const premium = await isPremium();
    if (!premium) {
        throw new Error("Unauthorized: Premium access required");
    }
}
