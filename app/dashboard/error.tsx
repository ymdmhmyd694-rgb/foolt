'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-cash-black text-white p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-cash-text-gray mb-6">Failed to load dashboard.</p>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}
