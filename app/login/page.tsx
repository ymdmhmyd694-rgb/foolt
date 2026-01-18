'use client'

import { useFormState } from 'react-dom'
import { authenticate } from '@/app/lib/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function Page() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-cash-black p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Sign In</h1>
                </div>

                <form action={dispatch} className="space-y-6">
                    <Input name="email" type="email" placeholder="Email or Phone" required />
                    <Input name="password" type="password" placeholder="Password" required />

                    <div className="flex justify-center pt-4">
                        <Button className="w-full">Sign In</Button>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-center text-sm">{errorMessage}</div>
                    )}
                </form>
            </div>
        </main>
    )
}
