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
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // This callback is called when a user signs in
            // For OAuth providers, we can check if this is a new user
            if (account?.provider === "google") {
                // Check if user already exists in database
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                });

                // If user doesn't exist, they will be created by the adapter
                // We'll mark them as new in the JWT callback
                if (!existingUser) {
                    // User will be created by adapter, mark as new
                    (user as any).isNewUser = true;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                (session.user as any).isNewUser = token.isNewUser || false;
                (session.user as any).isEmailVerified = token.isEmailVerified || false;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.isEmailVerified = (user as any).isEmailVerified ?? false;
                // Check if this is a new user (marked in signIn callback)
                if ((user as any).isNewUser) {
                    token.isNewUser = true;
                } else {
                    token.isNewUser = false;
                }
            } else if (token.isNewUser) {
                // Clear the flag after first session
                token.isNewUser = false;
            }
            return token;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
