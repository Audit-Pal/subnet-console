"use client";

import { motion } from "framer-motion";
import { Hammer, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlurOverlayProps {
    title?: string;
    description?: string;
    className?: string;
    variant?: 'restricted' | 'construction';
}

export function BlurOverlay({
    title,
    description,
    className,
    variant = 'restricted'
}: BlurOverlayProps) {
    const isConstruction = variant === 'construction';
    const defaultTitle = isConstruction ? "Under Construction" : "RESTRICTED ACCESS";
    const defaultDescription = isConstruction
        ? "This feature is currently being developed for this benchmark. Stay tuned for updates!"
        : "Vulnerability details are classified. Only authorized miners with consensus proof can decrypt this report.";

    return (
        <div className={cn("absolute inset-0 z-50 flex items-center justify-center p-6 text-center overflow-hidden", className)}>
            {/* The Blur Layer */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md space-y-6 flex flex-col items-center"
            >
                {/* Icon Container */}
                <div className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border shadow-2xl ring-1 ring-white/5 mb-2",
                    isConstruction ? "border-kast-teal/20 text-kast-teal" : "border-white/10 text-white/90"
                )}>
                    {isConstruction ? (
                        <Hammer className="w-6 h-6 sm:w-8 sm:h-8" />
                    ) : (
                        <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                </div>

                <div className="space-y-1.5">
                    <h3 className={cn(
                        "text-xs font-bold tracking-[0.25em] uppercase text-center",
                        isConstruction ? "text-kast-teal" : "text-white"
                    )}>
                        {title || defaultTitle}
                    </h3>

                    <p className="text-zinc-500 text-[9px] font-medium leading-relaxed max-w-[200px] mx-auto">
                        {description || defaultDescription}
                    </p>
                </div>

                {/* Status Badge */}
                <div className="pt-2">
                    <div className={cn(
                        "px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2.5",
                        isConstruction
                            ? "bg-kast-teal/10 border-kast-teal/20 text-kast-teal shadow-[0_0_20px_rgba(45,212,191,0.1)]"
                            : "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    )}>
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            isConstruction
                                ? "bg-kast-teal shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                                : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        )} />
                        {isConstruction ? "Beta Testing in Progress" : "Miner Consensus Pending"}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
