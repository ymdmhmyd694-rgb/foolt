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
        // Authorized callback removed to prevent build-time redirects.
        // Route protection is handled by the Page component.
    },
} satisfies NextAuthConfig
