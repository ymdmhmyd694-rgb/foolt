import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-cash-black text-white relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cash-green/10 via-cash-black to-cash-black z-0 pointer-events-none" />

            <div className="z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-cash-green rounded-[1.25rem] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(0,214,50,0.3)]">
                        <span className="text-3xl font-bold text-white">$</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Cash App</h1>
                    <p className="text-cash-text-gray text-lg">
                        The easiest way to send, spend, bank, and invest.
                    </p>
                </div>

                <div className="bg-cash-dark p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
                    <Input placeholder="$Cashtag or Phone" label="Identifier" />

                    <Button className="w-full text-lg shadow-[0_0_20px_rgba(0,214,50,0.4)]">
                        Get Started
                    </Button>
                </div>

                <div className="flex justify-center space-x-4 text-sm text-cash-text-gray">
                    <span>Security</span>
                    <span>•</span>
                    <span>Privacy</span>
                    <span>•</span>
                    <span>Terms</span>
                </div>
            </div>
        </main>
    );
}
