import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
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
            async authorize(credentials, req) {
                // Add your own logic here to find the user from the credentials supplied
                // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

                // if (user) {
                //   // Any object returned will be saved in `user` property of the JWT
                //   return user
                // } else {
                //   // If you return null then an error will be displayed advising the user to check their details.
                //   return null

                //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                // }
                return null
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async session({ session, token }) {
            return session
        },
    }
})

export { handler as GET, handler as POST }
