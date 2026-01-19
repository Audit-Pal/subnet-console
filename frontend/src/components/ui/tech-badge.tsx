"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "success" | "warning" | "danger" | "neutral";
    animate?: boolean;
}

export function TechBadge({
    children,
    className,
    variant = "default",
    animate = true
}: TechBadgeProps) {
    const colors = {
        default: "text-primary border-primary/30 bg-primary/5",
        success: "text-emerald-500 border-emerald-500/30 bg-emerald-500/5",
        warning: "text-amber-500 border-amber-500/30 bg-amber-500/5",
        danger: "text-red-500 border-red-500/30 bg-red-500/5",
        neutral: "text-zinc-500 border-zinc-500/30 bg-zinc-500/5",
    };

    const dots = {
        default: "bg-primary",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-red-500",
        neutral: "bg-zinc-500",
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-sm border font-mono text-[10px] uppercase tracking-widest select-none",
            colors[variant],
            className
        )}>
            {animate && (
                <motion.div
                    className={cn("w-1.5 h-1.5 rounded-full", dots[variant])}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
            )}
            <span>{children}</span>
        </div>
    );
}
