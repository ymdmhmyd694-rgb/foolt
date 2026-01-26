'use client'

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/Button"
import Link from "next/link"
import { getDashboardData } from "../actions/dashboard"
import Loading from "./loading"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/Input"
import { addCash, cashOut } from "../actions/transaction"

export default function Dashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Transaction State
    const [isAddCashOpen, setIsAddCashOpen] = useState(false)
    const [isCashOutOpen, setIsCashOutOpen] = useState(false)
    const [transactionState, setTransactionState] = useState<{ success?: boolean; message?: string } | null>(null)

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

    async function handleTransaction(action: any, formData: FormData) {
        setTransactionState(null)
        const result = await action(null, formData)

        if (result.success) {
            setIsAddCashOpen(false)
            setIsCashOutOpen(false)
            // Refresh data
            const newData = await getDashboardData()
            if (newData.data) setData(newData.data)
            alert(result.message)
        } else {
            setTransactionState(result)
        }
    }

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
                <Button variant="secondary" className="w-full" onClick={() => setIsAddCashOpen(true)}>Add Cash</Button>
                <Button variant="secondary" className="w-full" onClick={() => setIsCashOutOpen(true)}>Cash Out</Button>
            </section>

            {/* Add Cash Modal */}
            <Modal isOpen={isAddCashOpen} onClose={() => setIsAddCashOpen(false)} title="Add Cash">
                <form action={(fd) => handleTransaction(addCash, fd)} className="space-y-4">
                    <div>
                        <Input
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="$0.00"
                            className="text-center text-2xl"
                            autoFocus
                        />
                    </div>
                    {transactionState?.message && !transactionState.success && (
                        <p className="text-red-500 text-sm text-center">{transactionState.message}</p>
                    )}
                    <Button className="w-full">Add Money</Button>
                </form>
            </Modal>

            {/* Cash Out Modal */}
            <Modal isOpen={isCashOutOpen} onClose={() => setIsCashOutOpen(false)} title="Cash Out">
                <form action={(fd) => handleTransaction(cashOut, fd)} className="space-y-4">
                    <div>
                        <Input
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="$0.00"
                            className="text-center text-2xl"
                            autoFocus
                        />
                    </div>
                    {transactionState?.message && !transactionState.success && (
                        <p className="text-red-500 text-sm text-center">{transactionState.message}</p>
                    )}
                    <Button className="w-full">Cash Out</Button>
                </form>
            </Modal>


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
