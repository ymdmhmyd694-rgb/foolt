'use server'

import { auth } from "../../auth"
import { prisma } from "../../lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const TransactionSchema = z.object({
    amount: z.coerce.number().positive(),
})

export async function addCash(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { success: false, message: "Unauthorized" }

    const validated = TransactionSchema.safeParse({
        amount: formData.get("amount")
    })

    if (!validated.success) {
        return { success: false, message: "Invalid amount" }
    }

    const amount = validated.data.amount
    // Convert to cents for storage
    const amountInCents = Math.round(amount * 100)

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { ledgerAccounts: true }
        })

        if (!user) return { success: false, message: "User not found" }

        const assetAccount = user.ledgerAccounts.find(acc => acc.type === "ASSET")
        if (!assetAccount) return { success: false, message: "Account not found" }

        // Create transaction and update balance
        await prisma.$transaction([
            prisma.ledgerAccount.update({
                where: { id: assetAccount.id },
                data: {
                    balance: {
                        increment: amountInCents
                    }
                }
            }),
            prisma.ledgerTransaction.create({
                data: {
                    description: "Cash Deposit",
                    entries: {
                        create: [
                            {
                                amount: amountInCents,
                                direction: "DEBIT", // Debit asset = increase
                                accountId: assetAccount.id
                            }
                        ]
                    }
                }
            })
        ])

        revalidatePath("/dashboard")
        return { success: true, message: `Added $${amount.toFixed(2)}` }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Transaction failed" }
    }
}

export async function cashOut(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { success: false, message: "Unauthorized" }

    const validated = TransactionSchema.safeParse({
        amount: formData.get("amount")
    })

    if (!validated.success) {
        return { success: false, message: "Invalid amount" }
    }

    const amount = validated.data.amount
    const amountInCents = Math.round(amount * 100)

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { ledgerAccounts: true }
        })

        if (!user) return { success: false, message: "User not found" }

        const assetAccount = user.ledgerAccounts.find(acc => acc.type === "ASSET")
        if (!assetAccount) return { success: false, message: "Account not found" }

        if (Number(assetAccount.balance) < amountInCents) {
            return { success: false, message: "Insufficient funds" }
        }

        // Create transaction and update balance
        await prisma.$transaction([
            prisma.ledgerAccount.update({
                where: { id: assetAccount.id },
                data: {
                    balance: {
                        decrement: amountInCents
                    }
                }
            }),
            prisma.ledgerTransaction.create({
                data: {
                    description: "Cash Out",
                    entries: {
                        create: [
                            {
                                amount: amountInCents,
                                direction: "CREDIT", // Credit asset = decrease
                                accountId: assetAccount.id
                            }
                        ]
                    }
                }
            })
        ])

        revalidatePath("/dashboard")
        return { success: true, message: `Cashed out $${amount.toFixed(2)}` }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Transaction failed" }
    }
}
