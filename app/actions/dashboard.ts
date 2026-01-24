'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.email) return { error: "unauthenticated" }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { connectAccount: true, ledgerAccounts: true }
        })

        if (!user) return { error: "user_not_found" }

        const balance = user?.ledgerAccounts
            .filter((acc: { type: string }) => acc.type === "ASSET")
            .reduce((sum: number, acc: { balance: bigint }) => sum + Number(acc.balance), 0) ?? 0

        const kycStatus = user?.connectAccount?.kycStatus ?? "PENDING"

        return {
            success: true,
            data: {
                balance: balance.toString(),
                kycStatus,
                isVerified: kycStatus === "VERIFIED"
            }
        }
    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error)
        return { error: "server_error" }
    }
}
