'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { getDashboardData } from "@/app/actions/dashboard"
import Loading from "./loading"

export default function Dashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const result = await getDashboardData()
                if (result.error) {
                    setError(result.error)
                } else {
                    setData(result.data)
                }
            } catch (e) {
                setError("failed_load")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <Loading />

    if (error === "unauthenticated") {
        return (
            <main className="min-h-screen bg-cash-black text-white p-6 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold mb-4">Access Denied</h1>
                <p className="text-cash-text-gray mb-8">You need to be logged in to view this page.</p>
                <Link href="/login" className="w-full max-w-xs">
                    <Button variant="secondary" className="w-full pointer-events-none" tabIndex={-1}>Log In</Button>
                </Link>
            </main>
        )
    }

    if (error === "user_not_found") {
        return (
            <main className="min-h-screen bg-cash-black text-white p-6 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold mb-4">Account Not Found</h1>
                <p className="text-cash-text-gray mb-8">We couldn&apos;t find your account details.</p>
                <Link href="/login" className="w-full max-w-xs">
                    <Button variant="secondary" className="w-full pointer-events-none" tabIndex={-1}>Log In Again</Button>
                </Link>
            </main>
        )
    }

    if (error || !data) {
        return (
            <main className="min-h-screen bg-cash-black text-white p-6 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
                <p className="text-cash-text-gray mb-8">Unable to load dashboard data.</p>
                <Button variant="secondary" className="w-full max-w-xs" onClick={() => window.location.reload()}>Try Again</Button>
            </main>
        )
    }

    const { balance, isVerified } = data

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
                    ${(Number(balance) / 100).toFixed(2)}
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

            {/* KYC Prompt (Simplified for Client Comp) */}
            {!isVerified && (
                <section className="bg-cash-dark p-6 rounded-3xl border border-white/10 mb-6">
                    <h3 className="text-lg font-bold mb-2">Verify your Identity</h3>
                    <p className="text-cash-text-gray text-sm mb-4">
                        To send and receive money, you need to verify your account with Stripe.
                    </p>
                    {/* Form actions in Client Components work but better to use onClick or keep native form. 
                         For simplicity and robust fix, we link to a verify page or keep basic button. 
                         The action MUST be imported if passed to form. "createStripeOnboarding".
                     */}
                    <Link href="/verify-identity">
                        <Button className="w-full">Complete Setup</Button>
                    </Link>
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
