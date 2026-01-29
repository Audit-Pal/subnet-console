"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { diffWords } from "diff";
import {
    Maximize2,
    Minimize2,
    X,
    Copy,
    Check,
    ArrowRight,
    Split,
    FileDiff,
    Terminal,
    Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataModule } from "@/components/ui/data-module";
import { TechBadge } from "@/components/ui/tech-badge";
import { useEffect } from "react";

interface PromptComparisonProps {
    originalPrompt: string;
    optimizedPrompt: string;
}

export default function PromptComparison({
    originalPrompt,
    optimizedPrompt,
}: PromptComparisonProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [viewMode, setViewMode] = useState<"split" | "diff">("split");
    const [copiedOriginal, setCopiedOriginal] = useState(false);
    const [copiedOptimized, setCopiedOptimized] = useState(false);

    // Close on Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isExpanded) {
                setIsExpanded(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isExpanded]);

    const handleCopy = (text: string, isOriginal: boolean) => {
        navigator.clipboard.writeText(text);
        if (isOriginal) {
            setCopiedOriginal(true);
            setTimeout(() => setCopiedOriginal(false), 2000);
        } else {
            setCopiedOptimized(true);
            setTimeout(() => setCopiedOptimized(false), 2000);
        }
    };

    const diff = diffWords(originalPrompt, optimizedPrompt);

    return (
        <>
            {/* Close button */}
            {isExpanded && (
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => setIsExpanded(false)}
                    className="fixed top-6 right-6 z-[200] shadow-xl bg-red-600 hover:bg-red-700 text-white border-0 px-6 py-3 text-base font-bold"
                >
                    <X className="w-5 h-5 mr-2" />
                    Close
                </Button>
            )}
            <DataModule
                className={`transition-all duration-500 ease-in-out ${isExpanded ? "fixed inset-4 z-[100] h-[calc(100vh-2rem)] bg-zinc-950 shadow-2xl rounded-2xl border border-white/10" : "h-[450px] bg-zinc-950 border border-white/5 rounded-2xl"}`}
                contentClassName="p-0 h-full overflow-hidden"
                title="PROMPT_EVOLUTION_MATRIX"
                icon={<Code2 className="w-4 h-4 text-kast-teal" />}
                action={
                    <div className="flex items-center gap-2">
                        <div className="flex bg-black p-0.5 rounded-md border border-white/10">
                            <button
                                onClick={() => setViewMode("split")}
                                className={`p-1.5 rounded-sm transition-all ${viewMode === "split" ? "bg-white/10 shadow-sm text-kast-teal" : "text-zinc-500 hover:text-white"}`}
                                title="Split View"
                            >
                                <Split className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode("diff")}
                                className={`p-1.5 rounded-sm transition-all ${viewMode === "diff" ? "bg-white/10 shadow-sm text-kast-teal" : "text-zinc-500 hover:text-white"}`}
                                title="Diff View"
                            >
                                <FileDiff className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        {isExpanded ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(false)}
                                className="h-8 px-3 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-600 font-bold uppercase tracking-wider text-[10px]"
                            >
                                <Minimize2 className="w-4 h-4 mr-2" />
                                Minimize
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsExpanded(true)}
                                className="h-7 w-7 text-zinc-500 hover:text-kast-teal hover:bg-kast-teal/10"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                }
            >
                <div className="h-full flex flex-col">
                    {viewMode === "split" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                            {/* Original Prompt */}
                            <div className="flex flex-col h-full min-h-0 bg-black/20">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                                    <TechBadge variant="neutral">v1.0 :: ORIGINAL</TechBadge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(originalPrompt, true)}
                                        className="h-6 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-kast-teal"
                                    >
                                        {copiedOriginal ? (
                                            <span className="flex items-center gap-1 text-emerald-500 font-bold"><Check className="w-3 h-3" /> COPIED</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> COPY_BUFFER</span>
                                        )}
                                    </Button>
                                </div>
                                <div className="flex-1 min-h-0 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-zinc-500 whitespace-pre-wrap">
                                    {originalPrompt}
                                </div>
                            </div>

                            {/* Optimized Prompt */}
                            <div className="flex flex-col h-full min-h-0 bg-kast-teal/5">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-kast-teal/10">
                                    <TechBadge variant="default">v2.0 :: OPTIMIZED</TechBadge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(optimizedPrompt, false)}
                                        className="h-6 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-kast-teal"
                                    >
                                        {copiedOptimized ? (
                                            <span className="flex items-center gap-1 text-emerald-500 font-bold"><Check className="w-3 h-3" /> COPIED</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> COPY_BUFFER</span>
                                        )}
                                    </Button>
                                </div>
                                <div className="flex-1 min-h-0 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-white whitespace-pre-wrap relative">
                                    {/* Scanline effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(30,186,152,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
                                    {optimizedPrompt}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col bg-black/20">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                                <TechBadge variant="warning">DIFF_ANALYSIS_MODE</TechBadge>
                                <div className="flex gap-4 text-[10px] font-mono">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500/20 border border-red-500/50 rounded-sm"></span> REMOVED</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500/20 border border-emerald-500/50 rounded-sm"></span> ADDED</span>
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {diff.map((part, index) => {
                                    const color = part.added
                                        ? "bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20"
                                        : part.removed
                                            ? "bg-red-500/10 text-red-400 decoration-red-500/30 line-through decoration-2"
                                            : "text-zinc-500 font-bold";
                                    return (
                                        <span key={index} className={`${color} px-0.5 py-0.5 rounded-sm transition-colors duration-300`}>
                                            {part.value}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </DataModule>
        </>
    );
}
