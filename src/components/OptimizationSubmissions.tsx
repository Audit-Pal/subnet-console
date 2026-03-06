"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, List, Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionSubmissionRow {
    session_id: string;
    project_id: string | null;
    project_name: string | null;
    state: string;
    timestamp: string;
    sampled_miner_count: number;
    validator_address: string | null;
    avg_reward_score: number;
}

interface RecentSessionsResponse {
    sessions?: SessionSubmissionRow[];
    is_real?: boolean;
}

interface OptimizationSubmissionsProps {
    benchmarkId?: string;
}

type SessionFilter = "all" | "completed" | "failed" | "in-progress" | "pending";

const stateBadgeClass = (state: string): string => {
    const s = state.toLowerCase();
    if (s === "completed") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "failed") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (s === "in-progress") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
};

const shortId = (id: string): string => {
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
};

const shortAddress = (value: string | null): string => {
    if (!value) return "N/A";
    if (value.length <= 16) return value;
    return `${value.slice(0, 7)}...${value.slice(-6)}`;
};

const formatTimestamp = (value: string): string => {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "N/A";
    return dt.toLocaleString();
};

export function OptimizationSubmissions({ benchmarkId: _benchmarkId }: OptimizationSubmissionsProps = {}) {
    const [filter, setFilter] = useState<SessionFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [rows, setRows] = useState<SessionSubmissionRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const run = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/subnet/validation/sessions/recent?limit=200&skip=0", {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Failed to fetch recent sessions");
                const data = (await res.json()) as RecentSessionsResponse;
                const sessions = Array.isArray(data.sessions) ? data.sessions : [];
                sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setRows(sessions);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Failed to fetch real submissions", error);
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
        return rows.filter((row) => {
            const stateOk = filter === "all" ? true : row.state.toLowerCase() === filter;
            if (!stateOk) return false;
            if (!q) return true;
            const project = `${row.project_name || ""} ${row.project_id || ""}`.toLowerCase();
            const session = row.session_id.toLowerCase();
            const validator = (row.validator_address || "").toLowerCase();
            return project.includes(q) || session.includes(q) || validator.includes(q);
        });
    }, [rows, filter, searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kast-teal" />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-zinc-400">
                        <List className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-4">
                        {(["all", "completed", "failed", "in-progress", "pending"] as SessionFilter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "text-sm font-bold tracking-wide transition-colors uppercase font-mono px-1 pb-1",
                                    filter === f ? "text-kast-teal border-b border-kast-teal" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search session / project / validator..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-md py-2 pl-9 pr-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-kast-teal/20 placeholder:text-zinc-600 text-white"
                    />
                </div>
            </div>

            <div className="bg-zinc-950 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Session</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Avg Score</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Sampled Miners</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Validator</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRows.map((row) => {
                                const stateLower = row.state.toLowerCase();
                                return (
                                    <tr key={row.session_id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-xs text-white" title={row.session_id}>
                                                {shortId(row.session_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-[240px]">
                                            <span className="text-xs text-zinc-300 font-medium block truncate" title={row.project_name || row.project_id || ""}>
                                                {row.project_name || row.project_id || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                stateBadgeClass(row.state)
                                            )}>
                                                {stateLower === "completed" ? <CheckCircle2 className="w-3 h-3" /> : stateLower === "failed" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {row.state}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-kast-teal">
                                            {(Math.max(0, Number(row.avg_reward_score || 0)) * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-zinc-300">
                                            {row.sampled_miner_count}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-zinc-400" title={row.validator_address || ""}>
                                                {shortAddress(row.validator_address)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap text-xs text-zinc-500">
                                            {formatTimestamp(row.timestamp)}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 font-mono text-sm">
                                        No session rows available for this filter.
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
