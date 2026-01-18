'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function createStripeOnboarding() {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { connectAccount: true }
    })

    if (!user) throw new Error("User not found")

    let accountId = user.connectAccount?.stripeAccountId

    if (!accountId) {
        const account = await stripe.accounts.create({
            type: 'custom',
            country: 'US',
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
                treasury: { requested: true },
                card_issuing: { requested: true },
            },
            business_type: 'individual',
        })

        accountId = account.id

        await prisma.stripeConnectAccount.create({
            data: {
                userId: user.id,
                stripeAccountId: accountId,
                kycStatus: "PENDING"
            }
        })
    }

    const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        type: 'account_onboarding',
    })

    redirect(accountLink.url)
}
