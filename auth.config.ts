import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                // Logic to verify user against Prisma DB would go here
                // For MVP/Build verification, returning a mock user if matching dev creds
                if (credentials.email === "dev@cash.app" && credentials.password === "password") {
                    return { id: "1", name: "Dev User", email: "dev@cash.app" }
                }
                return null;
            }
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig
