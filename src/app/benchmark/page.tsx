"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Bug, Lock, Scale, Radio, Layers, Users, Clock, Trophy, ArrowRight, Zap, Terminal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuantumText } from "@/components/ui/quantum-text";
import { TechBadge } from "@/components/ui/tech-badge";

const benchmarks = [
    {
        id: "solidity-suite",
        name: "Auditpal-Solbench-30",
        category: "EVM-V2",
        description: "Advanced verification engine for Ethereum Virtual Machine contracts. Executes deep semantic analysis, data flow tracing, and formal verification of complex DeFi logic.",
        icon: Shield,
        href: "/benchmark/solidity-suite",
        status: "live",
        score: "98.2",
        agents: 12,
        duration: "15m",
        difficulty: "EXPERT",
        color: "text-kast-teal",
        bgColor: "bg-kast-teal/10",
        borderColor: "border-kast-teal/20",
    },
    {
        id: "solana-suite",
        name: "Solana Runtime Audit",
        category: "SVM-CORE",
        description: "Specialized auditing suite for Solana's Sealevel runtime. Validates account ownership, Borsh (de)serialization, and instruction-level safety across program interactions.",
        icon: Activity,
        href: "/benchmark/solana-suite",
        status: "live",
        locked: true,
        score: "94.5",
        agents: 8,
        duration: "12m",
        difficulty: "EXPERT",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
    },
];

export default function BenchmarksPage() {
    const liveBenchmarks = benchmarks.filter(c => c.status === "live");
    const upcomingBenchmarks = benchmarks.filter(c => c.status === "upcoming");
    const completedBenchmarks = benchmarks.filter(c => c.status === "completed");

    return (
        <div className="min-h-screen relative bg-black text-white overflow-hidden selection:bg-kast-teal selection:text-black pt-12">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-kast-teal/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="container mx-auto px-6 py-6 md:py-10 max-w-7xl relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-8 border-b border-white/5 pb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl space-y-3"
                    >
                        <div className="flex items-center gap-3 text-[10px] font-black text-kast-teal tracking-[0.3em] uppercase">
                            <Terminal className="w-3 h-3" />
                            AGENT_BENCHMARKS_V1
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                            <QuantumText text="Benchmarks" />
                        </h1>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl font-mono">
                            Validate your audit agents against industry-standard suites.
                            Achieve <span className="text-kast-teal font-bold uppercase tracking-wider">high precision</span> scores for global ranking.
                        </p>
                    </motion.div>

                    <div className="flex gap-3">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg min-w-[130px] backdrop-blur-md">
                            <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Active Suites</p>
                            <p className="text-xl font-black text-white font-mono">{liveBenchmarks.length}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg min-w-[130px] backdrop-blur-md">
                            <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Audit Score</p>
                            <p className="text-xl font-black text-kast-teal font-mono">96.4</p>
                        </div>
                    </div>
                </div>

                {/* Live Benchmarks */}
                {liveBenchmarks.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-kast-teal animate-pulse shadow-[0_0_8px_rgba(30,186,152,0.8)]" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Benchmarks</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {liveBenchmarks.map((benchmark, index) => (
                                <BenchmarkCard key={benchmark.id} benchmark={benchmark} index={index} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Benchmarks */}
                {upcomingBenchmarks.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">In Queue</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingBenchmarks.map((benchmark, index) => (
                                <BenchmarkCard key={benchmark.id} benchmark={benchmark} index={index} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Completed Benchmarks */}
                {completedBenchmarks.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <Trophy className="w-4 h-4 text-emerald-500" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Archive</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {completedBenchmarks.map((benchmark, index) => (
                                <BenchmarkCard key={benchmark.id} benchmark={benchmark} index={index} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

interface BenchmarkCardProps {
    benchmark: typeof benchmarks[0];
    index: number;
}

function BenchmarkCard({ benchmark, index }: BenchmarkCardProps) {
    const isLive = benchmark.status === "live" && !benchmark.locked;
    const isUpcoming = benchmark.status === "upcoming" || benchmark.locked;
    const isCompleted = benchmark.status === "completed";

    const CardContent = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative border transition-all duration-500 flex flex-col p-8 h-full min-h-[280px] overflow-hidden rounded-lg",
                isLive
                    ? "bg-white/[0.08] border-kast-teal/30"
                    : benchmark.locked
                        ? "bg-white/[0.02] border-white/5 cursor-not-allowed"
                        : "bg-black/40 border-white/5 opacity-60"
            )}
        >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "w-12 h-12 rounded flex items-center justify-center border transition-all duration-500 shadow-[0_0_20px_rgba(30,186,152,0.2)] scale-110",
                    benchmark.bgColor,
                    benchmark.borderColor,
                    benchmark.color,
                    !isLive && "grayscale shadow-none scale-100"
                )}>
                    {isUpcoming ? <Lock className="w-5 h-5 opacity-50" /> : <benchmark.icon className="w-6 h-6" strokeWidth={1.5} />}
                </div>

                <div className="flex items-center gap-2">
                    {isLive && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-kast-teal/10 border border-kast-teal/20 text-[9px] font-black uppercase tracking-widest text-kast-teal rounded-full">
                            <Zap className="w-2.5 h-2.5 animate-pulse" />
                            ACTIVE
                        </span>
                    )}
                    {isUpcoming && (
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-500 rounded-full flex items-center gap-1.5">
                            <Lock className="w-2.5 h-2.5" />
                            LOCKED
                        </span>
                    )}
                    {isCompleted && (
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-500 rounded-full">
                            ARCHIVED
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={cn("space-y-3 flex-1", !isLive && "opacity-50")}>
                <div className="flex items-center gap-2">
                    <TechBadge variant="neutral">{benchmark.category}</TechBadge>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", benchmark.color)}>
                        {benchmark.difficulty}
                    </span>
                </div>
                <h3 className={cn(
                    "text-2xl font-black uppercase tracking-tighter transition-colors",
                    isLive ? "text-white" : "text-zinc-600"
                )}>
                    {benchmark.name}
                </h3>
                <p className="text-sm text-zinc-500 font-mono leading-relaxed">
                    {benchmark.description}
                </p>
            </div>

            {/* Footer */}
            <div className={cn("mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-4", !isLive && "opacity-30 contrast-75")}>
                <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Base Score</p>
                    <p className="font-mono font-bold text-kast-teal">{benchmark.score}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Agents</p>
                    <p className="font-mono font-bold text-white">{benchmark.agents}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Duration</p>
                    <p className={cn(
                        "font-mono font-bold",
                        isLive ? "text-kast-teal" : "text-zinc-500"
                    )}>{benchmark.duration}</p>
                </div>
            </div>

            {/* CTA */}
            {isLive && (
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-kast-teal transition-colors flex items-center gap-2">
                        Run Benchmark <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            )}


        </motion.div>
    );

    if (isLive) {
        return <Link href={benchmark.href} className="h-full block">{CardContent}</Link>;
    }

    return <div className="h-full cursor-not-allowed">{CardContent}</div>;
}
