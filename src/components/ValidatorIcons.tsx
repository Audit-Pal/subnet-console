"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ValidatorInfo {
    address: string;
    name?: string;
    color?: string;
}

interface ValidatorIconsProps {
    validators: (string | ValidatorInfo)[];
    className?: string;
    size?: "sm" | "md" | "lg";
}

const getValidatorColor = (address: string) => {
    // Generate a consistent color based on the address
    const hash = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-emerald-500",
        "bg-amber-500",
        "bg-rose-500",
        "bg-indigo-500",
        "bg-cyan-500",
    ];
    return colors[hash % colors.length];
};

const getInitials = (address: string) => {
    if (address.length < 2) return "?";
    return address.slice(1, 3).toUpperCase(); // Typical substrate addresses start with 5, so take next 2
};

export function ValidatorIcons({ validators, className, size = "md" }: ValidatorIconsProps) {
    if (!validators || validators.length === 0) return null;

    const sizeClasses = {
        sm: "w-5 h-5 text-[8px]",
        md: "w-6 h-6 text-[10px]",
        lg: "w-8 h-8 text-xs",
    };

    return (
        <TooltipProvider delayDuration={100}>
            <div className={cn("flex items-center -space-x-2", className)}>
                {validators.map((v, i) => {
                    const address = typeof v === "string" ? v : v.address;
                    const name = typeof v === "string" ? null : v.name;
                    const color = typeof v === "string" ? getValidatorColor(address) : v.color || getValidatorColor(address);
                    const initials = getInitials(address);

                    return (
                        <Tooltip key={`${address}-${i}`}>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "rounded-full border-2 border-black flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/10 select-none cursor-help",
                                        sizeClasses[size],
                                        color
                                    )}
                                >
                                    {initials}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-zinc-900 border-white/10 text-[10px] font-mono p-2">
                                <p className="font-bold text-kast-teal mb-0.5">{name || "Validator"}</p>
                                <p className="text-zinc-400 break-all max-w-[200px] leading-tight">{address}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
}
