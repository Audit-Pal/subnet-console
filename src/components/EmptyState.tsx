"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">{title}</h3>
            <p className="text-zinc-500 max-w-md mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    variant="outline"
                    className="border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
