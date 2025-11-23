import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's id. */
            id: string
            /** The user's role. */
            role: "ADMIN" | "PREMIUM" | "FREE"
            /** Whether the user's email is verified. */
            isEmailVerified: boolean
            /** Whether the user is new. */
            isNewUser?: boolean
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role?: "ADMIN" | "PREMIUM" | "FREE"
        isEmailVerified?: boolean
        isNewUser?: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: "ADMIN" | "PREMIUM" | "FREE"
        isEmailVerified: boolean
        isNewUser?: boolean
    }
}
