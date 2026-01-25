'use client'

import { useFormState } from 'react-dom'
import { registerUser } from '../lib/actions'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import Link from 'next/link'

export default function RegisterPage() {
    const [state, dispatch] = useFormState(registerUser, undefined)

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-cash-black p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Sign Up</h1>
                    <p className="text-cash-text-gray mt-2">Create your Cash App account</p>
                </div>

                <form action={dispatch} className="space-y-6">
                    <Input name="email" type="email" placeholder="Email" required />
                    <Input name="name" type="text" placeholder="Full Name" required />
                    <Input name="cashtag" type="text" placeholder="$Cashtag" required />
                    <Input name="password" type="password" placeholder="Password" required />

                    <div className="flex justify-center pt-4">
                        <Button className="w-full">Create Account</Button>
                    </div>

                    {state?.message && (
                        <div className={`text-center text-sm ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                            {state.message}
                        </div>
                    )}
                </form>

                <div className="text-center text-cash-text-gray text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-cash-green hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </main>
    )
}
