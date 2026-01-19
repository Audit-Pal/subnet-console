"use client";

import { cn } from "@/lib/utils";
import { X, Minus, Square } from "lucide-react";

interface WindowCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export function WindowCard({ title, children, className, headerClassName }: WindowCardProps) {
    return (
        <div className={cn("overflow-hidden rounded-lg border border-primary bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,255,0.2)]", className)}>
            {/* Window Header */}
            <div className={cn("flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground", headerClassName)}>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold uppercase tracking-wider">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" />
                    <Square className="h-3 w-3 opacity-50 hover:opacity-100 cursor-pointer" />
                    <X className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" />
                </div>
            </div>

            {/* Window Content */}
            <div className="bg-primary p-4 font-mono text-sm text-white">
                {children}
            </div>
        </div>
    );
}
