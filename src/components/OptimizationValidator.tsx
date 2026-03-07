"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurOverlay } from "./BlurOverlay";


interface ValidatorRow {
    validator_address: string;
    sessions_submitted: number;
    avg_reward_score: number;
    last_submission_ts: number;
}

interface OptimizationValidatorProps {
    benchmarkId?: string;
}

const shortAddress = (address: string): string => {
    if (!address) return "N/A";
    if (address.length <= 16) return address;
    return `${address.slice(0, 7)}...${address.slice(-6)}`;
};

const formatDate = (unixSeconds: number): string => {
    if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) return "N/A";
    return new Date(unixSeconds * 1000).toLocaleString();
};

export function OptimizationValidator({ benchmarkId }: OptimizationValidatorProps = {}) {
    const [rows, setRows] = useState<ValidatorRow[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const run = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/subnet/validators", { signal: controller.signal });
                if (!res.ok) throw new Error("Failed to fetch validators");
                const data = (await res.json()) as ValidatorRow[];
                const clean = Array.isArray(data) ? data : [];
                clean.sort((a, b) => b.sessions_submitted - a.sessions_submitted);
                setRows(clean);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Failed to fetch validators", error);
                    setRows([]);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        run();
        return () => controller.abort();
    }, []);

    const filteredRows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((row) => row.validator_address.toLowerCase().includes(q));
    }, [rows, searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kast-teal" />
            </div>
        );
    }

    if (benchmarkId === "evm-bench") {
        return (
            <div className="relative h-[400px] w-full mt-8">
                <BlurOverlay
                    variant="construction"
                    title="Validators Locked"
                    description="Validator performance metrics for EVMBench are coming soon. The validation engine is currently in beta."
                />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 max-w-6xl mx-auto relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                        <Users className="w-6 h-6 text-kast-teal" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Validator Activity</h2>
                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Real data from /api/subnet/validators</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search validator address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-md py-2 pl-9 pr-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-kast-teal/20 placeholder:text-zinc-600 text-white"
                    />
                </div>
            </div>

            <div className="bg-zinc-950 rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">#</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Validator</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Sessions</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Avg Score</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Last Submission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRows.map((row, index) => (
                                <tr key={`${row.validator_address}-${index}`} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-zinc-400">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-white" title={row.validator_address}>
                                            {shortAddress(row.validator_address)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-zinc-300">{row.sessions_submitted}</td>
                                    <td className="px-6 py-4 text-right font-mono text-kast-teal">
                                        {(Math.max(0, Number(row.avg_reward_score || 0)) * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-zinc-500">{formatDate(row.last_submission_ts)}</td>
                                </tr>
                            ))}
                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-mono text-sm">
                                        No validators found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
