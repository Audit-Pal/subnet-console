"use client";

import { motion } from "framer-motion";
import { Hammer, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlurOverlayProps {
    title?: string;
    description?: string;
    className?: string;
}

export function BlurOverlay({
    title = "Under Construction",
    description = "This feature is currently being developed for this benchmark. Stay tuned for updates!",
    className
}: BlurOverlayProps) {
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
                {/* Lock Container */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl ring-1 ring-white/5 mb-2">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white/90" />
                </div>

                <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-white tracking-[0.25em] uppercase text-center">
                        RESTRICTED ACCESS
                    </h3>

                    <p className="text-zinc-500 text-[9px] font-medium leading-relaxed max-w-[200px] mx-auto">
                        Vulnerability details are classified. Only authorized miners with consensus proof can decrypt this report.
                    </p>
                </div>

                {/* Status Badge */}
                <div className="pt-2">
                    <div className="px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-[0.1em] flex items-center gap-2.5 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        Miner Consensus Pending
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
