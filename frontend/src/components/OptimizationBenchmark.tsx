"use client";

import { motion } from "framer-motion";
import { BarChart, Gauge, Target, Zap, Play, ArrowRight, Settings, Database, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataModule } from "@/components/ui/data-module";
import { Button } from "@/components/ui/button";

// Benchmark Stats Card
const StatCard = ({ icon: Icon, title, value, subtext, color }: any) => (
    <DataModule className={cn(
        "relative overflow-hidden group p-5 border transition-all duration-300 hover:shadow-md bg-zinc-950/60 backdrop-blur-xl",
        color === "indigo" ? "border-white/5 hover:border-kast-teal/30" :
            color === "emerald" ? "border-white/5 hover:border-emerald-500/30" :
                color === "violet" ? "border-white/5 hover:border-purple-500/30" :
                    "border-white/5 hover:border-white/20"
    )}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <div className="text-2xl font-bold text-white font-sans mb-1">{value}</div>
                {subtext && <p className="text-xs text-zinc-500 font-medium">{subtext}</p>}
            </div>
            <div className={cn(
                "p-2 rounded-lg",
                color === "indigo" ? "bg-white/5 text-kast-teal" :
                    color === "emerald" ? "bg-white/5 text-emerald-400" :
                        color === "violet" ? "bg-white/5 text-purple-400" :
                            "bg-white/5 text-zinc-400"
            )}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </DataModule>
);

// Benchmark Item Row
const BenchmarkItem = ({ name, status, score, latency, cost, type }: any) => (
    <div className="group flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-white/5 hover:border-kast-teal/30 hover:shadow-sm transition-all">
        <div className="flex items-center gap-4">
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center border",
                type === 'core' ? "bg-white/5 border-white/10 text-kast-teal" :
                    type === 'edge' ? "bg-white/5 border-white/10 text-amber-400" :
                        "bg-white/5 border-white/10 text-zinc-500"
            )}>
                <Database className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white">{name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm",
                        status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-500"
                    )}>
                        {status}
                    </span>
                    <span className="text-xs text-zinc-500">{type === 'core' ? 'Core Dataset' : 'Edge Cases'}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="text-right">
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Score</div>
                <div className="text-sm font-mono font-bold text-white">{score || '-'}</div>
            </div>
            <div className="text-right hidden sm:block">
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Avg Latency</div>
                <div className="text-sm font-mono font-bold text-zinc-300">{latency || '-'}</div>
            </div>
            <div className="text-right hidden sm:block">
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Cost</div>
                <div className="text-sm font-mono font-bold text-zinc-300">{cost || '-'}</div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white">
                <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
);

export function OptimizationBenchmark() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto px-4"
        >
            <div className="relative mb-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-kast-teal/20 blur-3xl rounded-full scale-150 animate-pulse" />

                <div className="relative bg-zinc-950 p-6 rounded-2xl shadow-xl border border-white/10 ring-4 ring-white/5">
                    <BarChart className="w-12 h-12 text-kast-teal" />
                </div>

                {/* Floating elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 -top-4 bg-zinc-900 p-2.5 rounded-xl shadow-lg border border-white/10"
                >
                    <Target className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-6 -bottom-2 bg-zinc-900 p-2.5 rounded-xl shadow-lg border border-white/10"
                >
                    <Settings className="w-5 h-5 text-amber-400" />
                </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                Audit Suite <span className="text-red-500">Coming Soon</span>
            </h2>

            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
                We're building a comprehensive evaluation engine to audit your agents against
                standardized security suites like <span className="font-semibold text-white">SCSVS-CODE</span>, <span className="font-semibold text-white">SWC-Registry</span>, and <span className="font-semibold text-white">Slither-Analyze</span>.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Development in Progress
            </div>
        </motion.div>
    );
}
