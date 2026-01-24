export default function Loading() {
    return (
        <div className="min-h-screen bg-cash-black text-white p-6 flex flex-col items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-10 w-10 bg-cash-gray rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-600 rounded mb-2"></div>
                <div className="h-8 w-48 bg-gray-700 rounded"></div>
            </div>
        </div>
    )
}
