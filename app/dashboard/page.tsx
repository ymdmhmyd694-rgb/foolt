import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createStripeOnboarding } from "@/app/lib/stripe-actions"
import { Button } from "@/components/ui/Button"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { connectAccount: true, ledgerAccounts: true }
    })

    // Calculate Balance (Sum of ASSET accounts)
    const balance = user?.ledgerAccounts
        .filter((acc: { type: string }) => acc.type === "ASSET")
        .reduce((sum: number, acc: { balance: bigint }) => sum + Number(acc.balance), 0) ?? 0

    const kycStatus = user?.connectAccount?.kycStatus ?? "PENDING"
    const isVerified = kycStatus === "VERIFIED"

    return (
        <main className="min-h-screen bg-cash-black text-white p-6 pb-24">
            <header className="flex justify-between items-center mb-8">
                <div className="w-10 h-10 bg-cash-gray rounded-full" />
                <div className="flex gap-4">
                    {/* User Profile / Settings */}
                </div>
            </header>

            {/* Balance Card */}
            <section className="flex flex-col items-center justify-center py-10 space-y-2">
                <h1 className="text-6xl font-bold tracking-tighter">
                    ${(balance / 100).toFixed(2)}
                </h1>
                <p className="text-cash-text-gray text-sm uppercase tracking-widest">
                    Cash Balance
                </p>
            </section>

            {/* Action Buttons */}
            <section className="grid grid-cols-2 gap-4 mb-8">
                <Button variant="secondary" className="w-full">Add Cash</Button>
                <Button variant="secondary" className="w-full">Cash Out</Button>
            </section>

            {/* KYC Prompt */}
            {!isVerified && (
                <section className="bg-cash-dark p-6 rounded-3xl border border-white/10 mb-6">
                    <h3 className="text-lg font-bold mb-2">Verify your Identity</h3>
                    <p className="text-cash-text-gray text-sm mb-4">
                        To send and receive money, you need to verify your account with Stripe.
                    </p>
                    <form action={createStripeOnboarding}>
                        <Button className="w-full">Complete Setup</Button>
                    </form>
                </section>
            )}

            {/* Transaction Feed Placeholder */}
            <section>
                <h3 className="text-lg font-medium mb-4 text-cash-text-gray">Activity</h3>
                <div className="space-y-4">
                    {/* Feed Items go here */}
                    <div className="bg-cash-dark p-4 rounded-2xl flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                            <div>
                                <p className="font-semibold">Welcome Bonus</p>
                                <p className="text-xs text-green-500">Completed</p>
                            </div>
                        </div>
                        <span className="font-bold text-cash-green">+$0.00</span>
                    </div>
                </div>
            </section>

        </main>
    )
}
