import { InputHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-cash-text-gray mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-transparent border-b border-cash-gray py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-cash-green transition-colors text-lg",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
