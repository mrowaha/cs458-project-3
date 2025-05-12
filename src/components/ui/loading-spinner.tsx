import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    visible?: boolean;
    message?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    fullScreen?: boolean;
}

export const LoadingSpinner = ({
    visible = true,
    message = "Loading",
    className,
    size = "md",
    fullScreen = false,
}: LoadingSpinnerProps) => {
    if (!visible) return null;

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center bg-black/50 z-50",
                fullScreen ? "fixed inset-0" : "absolute inset-0",
                className
            )}
        >
            <div className="bg-zinc-900 rounded-lg p-6 flex flex-col items-center shadow-lg border border-zinc-800">
                <Loader2 className={cn("text-accent-base animate-spin", sizeClasses[size])} />
                {message && (
                    <p className="mt-4 text-zinc-300 font-medium text-center">{message}</p>
                )}
            </div>
        </div>
    );
};