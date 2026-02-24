"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Circle, MoreHorizontal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Validator {
    rank: number;
    name: string;
    uid: number;
    hotkey: string;
    stake: string;
    trust: number;
    status: 'online' | 'offline';
}

import { useState, useEffect } from "react";

interface OptimizationValidatorProps {
    benchmarkId?: string;
}

export function OptimizationValidator({ benchmarkId }: OptimizationValidatorProps = {}) {
    const [validators, setValidators] = useState<Validator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchValidators = async () => {
            try {
                const res = await fetch('/api/subnet/validators');
                if (res.ok) {
                    const data = await res.json();

                    let mapped: Validator[] = data.map((val: any, index: number) => ({
                        rank: index + 1,
                        name: val.uid === 1 ? "Opentensor Foundation" : `Validator ${val.uid}`,
                        uid: val.uid,
                        hotkey: val.hotkey,
                        stake: (val.stake / 1_000_000).toFixed(2) + "M τ",
                        trust: Math.round(val.trust * 100),
                        status: 'online' as const
                    }));

                    if (benchmarkId === 'evm-bench') {
                        const evmValidators: Validator[] = [
                            {
                                rank: 1,
                                name: "OpenAI Grading Harness",
                                uid: 999,
                                hotkey: "evm-rust-validator-01",
                                stake: "1.24M τ",
                                trust: 100,
                                status: 'online'
                            },
                            {
                                rank: 2,
                                name: "Paradigm Anvil-Node",
                                uid: 888,
                                hotkey: "paradigm-validator-sol",
                                stake: "0.98M τ",
                                trust: 100,
                                status: 'online'
                            }
                        ];
                        mapped = evmValidators.map((v, i) => ({ ...v, rank: i + 1 }));
                    }

                    setValidators(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch validators:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchValidators();
    }, [benchmarkId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kast-teal"></div>
            </div>
        );
    }

    const isUnderConstruction = benchmarkId === 'evm-bench';

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "space-y-6 pb-20 max-w-6xl mx-auto transition-all duration-700",
                    isUnderConstruction && "blur-[6px] grayscale opacity-40 pointer-events-none select-none"
                )}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between py-8 px-2 border-b border-white/5 mb-4">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-sm">
                            <Users className="w-7 h-7 text-kast-teal" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase font-sans mb-1">
                                {benchmarkId === 'evm-bench' ? "Grading Infrastructure" : "Security Nodes"}
                            </h2>
                            <p className="text-sm text-zinc-500 font-medium tracking-wide">
                                {benchmarkId === 'evm-bench'
                                    ? "Rust-based harness utilizing isolated Anvil environments"
                                    : "Top auditing nodes by stake"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-black border border-white/10 rounded-lg shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{validators.length} Active</span>
                        </div>
                    </div>
                </div>

                {/* Validator List Table */}
                <div className="bg-zinc-950 rounded-xl border border-white/5 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-20 text-center font-sans">#</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Validator</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">UID</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Hotkey</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right font-sans">Stake</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-64 font-sans">Trust Score</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right font-sans">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {validators.map((validator) => (
                                    <tr key={validator.rank} className="group hover:bg-white/5 transition-all duration-200">
                                        <td className="px-8 py-6 text-center">
                                            <span className={cn(
                                                "font-mono font-bold text-sm",
                                                validator.rank === 1 ? "text-amber-500" :
                                                    validator.rank === 2 ? "text-amber-500/80" :
                                                        validator.rank === 3 ? "text-amber-500/60" : "text-zinc-300"
                                            )}>
                                                {validator.rank}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-sm text-white font-sans tracking-tight group-hover:text-kast-teal transition-colors">
                                                {validator.name}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-mono font-bold text-zinc-400">
                                                {validator.uid}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 text-zinc-500 font-mono font-medium tracking-tight">
                                                {validator.hotkey}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="font-bold text-sm text-zinc-300 font-mono tracking-tight">
                                                {validator.stake}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold text-zinc-400 font-mono tracking-tight">
                                                    {validator.trust}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full shadow-sm",
                                                    validator.status === 'online' ? "bg-emerald-400" : "bg-zinc-300"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider font-sans",
                                                    validator.status === 'online' ? "text-emerald-400" : "text-zinc-500"
                                                )}>
                                                    {validator.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Button variant="ghost" className="text-zinc-600 hover:text-white font-mono text-xs uppercase tracking-widest gap-2">
                        View Network Stats <ExternalLink className="w-3 h-3" />
                    </Button>
                </div>
            </motion.div>

            {isUnderConstruction && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 min-h-[400px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
                    >
                        <div className="w-16 h-16 bg-kast-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-kast-teal/20">
                            <ShieldCheck className="w-8 h-8 text-kast-teal animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Validator Setup Pending</h3>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
                            Security nodes and grading infrastructure will initialize upon mainnet synchronization. Currently utilizing isolated research nodes.
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                Infrastructure: Pre-Deployment Phase
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );

}
