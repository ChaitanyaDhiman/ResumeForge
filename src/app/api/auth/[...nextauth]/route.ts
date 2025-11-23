import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        // Session expires after 30 days of inactivity
        maxAge: 30 * 24 * 60 * 60, // 30 days
        // Update session age on every request (sliding sessions)
        updateAge: 24 * 60 * 60, // 24 hours
    },
    // Secure cookie configuration
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // For Google OAuth, mark existing users as email verified
            if (account?.provider === "google" && user.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email }
                });

                if (existingUser && !existingUser.isEmailVerified) {
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { isEmailVerified: true }
                    });
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
                session.user.isNewUser = token.isNewUser || false;
                session.user.isEmailVerified = token.isEmailVerified || false;
            }
            return session;
        },
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id;
                token.isEmailVerified = (user as any).isEmailVerified ?? false;
                token.role = user.role || "FREE";

                // For OAuth users, auto-verify email and mark as new user on first sign-in
                if (account?.provider === "google") {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: user.id }
                    });

                    if (dbUser) {
                        // Auto-verify Google OAuth users
                        if (!dbUser.isEmailVerified) {
                            await prisma.user.update({
                                where: { id: user.id },
                                data: { isEmailVerified: true }
                            });
                            token.isEmailVerified = true;
                            // This is a new user (first time signing in)
                            token.isNewUser = true;
                        } else {
                            token.isNewUser = false;
                        }
                        // Always sync role from database
                        token.role = dbUser.role;
                    }
                } else {
                    token.isNewUser = false;
                }
            } else if (token.isNewUser) {
                // Clear the flag after first session
                token.isNewUser = false;
            }

            // Handle session updates (e.g., after email verification)
            if (trigger === 'update' && token.email) {
                const updatedUser = await prisma.user.findUnique({
                    where: { email: token.email as string }
                });
                if (updatedUser) {
                    token.isEmailVerified = updatedUser.isEmailVerified;
                }
            }

            return token;
        }
    },
    // Enhanced JWT configuration
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // Enable debug in development
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
