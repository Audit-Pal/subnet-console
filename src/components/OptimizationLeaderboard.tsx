"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Search, Trophy, Users } from "lucide-react";
import { DataModule } from "@/components/ui/data-module";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AgentLeaderboardRow {
    rank: number;
    miner_uid: number;
    agent: string | null;
    benchmark: number;
    incentive: number;
    emission: number;
    consensus: number;
    findings_discovered: number;
}

interface OptimizationLeaderboardProps {
    benchmarkId?: string;
}

const shortAgent = (agent: string | null): string => {
    if (!agent) return "N/A";
    if (agent.length <= 44) return agent;
    return `${agent.slice(0, 28)}...${agent.slice(-12)}`;
};

export function OptimizationLeaderboard({ benchmarkId: _benchmarkId }: OptimizationLeaderboardProps = {}) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [rows, setRows] = useState<AgentLeaderboardRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const run = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/subnet/network/agents?timeRange=30d&limit=200", {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                const data = (await res.json()) as AgentLeaderboardRow[];
                setRows(Array.isArray(data) ? data : []);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Failed to fetch real leaderboard", error);
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
        return rows.filter((row) => {
            const miner = String(row.miner_uid);
            const agent = row.agent?.toLowerCase() || "";
            return miner.includes(q) || agent.includes(q);
        });
    }, [rows, searchQuery]);

    const topThree = [filteredRows[1], filteredRows[0], filteredRows[2]].filter(Boolean) as AgentLeaderboardRow[];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-kast-teal border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 font-mono text-sm">Loading real leaderboard...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end justify-center max-w-5xl mx-auto pt-8">
                {topThree.map((item, index) => {
                    const isFirst = item.rank === 1;
                    const isSecond = item.rank === 2;
                    return (
                        <motion.div
                            key={`${item.miner_uid}-${item.rank}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative",
                                isFirst ? "md:-mt-10 order-1 md:order-2 z-10" : isSecond ? "order-2 md:order-1" : "order-3"
                            )}
                        >
                            <Link href={`/miner/${item.miner_uid}`} className="block">
                                <DataModule
                                    className={cn(
                                        "relative overflow-hidden cursor-pointer transition-colors hover:border-kast-teal/60",
                                        isFirst
                                            ? "bg-zinc-900 border-amber-500 shadow-[0_8px_30px_rgb(251,191,36,0.15)]"
                                            : "bg-zinc-950 border-white/5"
                                    )}
                                >
                                    <div className="p-4 text-center space-y-3">
                                        <div className="text-sm font-black font-mono text-zinc-400">#{item.rank}</div>
                                        <div className="flex justify-center">
                                            {isFirst ? <Crown className="w-8 h-8 text-amber-500" /> : <Medal className="w-7 h-7 text-zinc-400" />}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Miner {item.miner_uid}</h3>
                                            <p className="text-[11px] text-zinc-500 font-mono" title={item.agent || ""}>{shortAgent(item.agent)}</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-black font-mono text-kast-teal">{item.benchmark.toFixed(1)}%</p>
                                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Avg Score (30D)</p>
                                        </div>
                                    </div>
                                </DataModule>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1">
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 h-12 w-12 flex items-center justify-center rounded-md border border-white/10 text-white">
                        <Trophy className="w-6 h-6 text-kast-teal" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Leaderboard</h2>
                        <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
                            Real data from /api/subnet/network/agents (30D)
                        </p>
                    </div>
                </div>
                <div className="relative w-full sm:w-80">
                    <div className="relative bg-zinc-950 rounded-md border border-white/10 flex items-center px-4 py-2.5">
                        <Search className="w-4 h-4 text-zinc-500 mr-3" />
                        <input
                            type="text"
                            placeholder="Search miner UID / agent..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-white placeholder:text-zinc-500 font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 rounded-lg border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">#</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Miner UID</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Agent</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Avg Score</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Total Reward</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Participations</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Success Rate</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Findings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRows.map((item) => (
                                <tr
                                    key={`${item.miner_uid}-${item.rank}`}
                                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/miner/${item.miner_uid}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            router.push(`/miner/${item.miner_uid}`);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <td className="px-6 py-4 font-mono text-zinc-300">{item.rank}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-white">{item.miner_uid}</td>
                                    <td className="px-6 py-4 max-w-[340px]">
                                        <span className="text-sm text-zinc-300 font-mono truncate block" title={item.agent || ""}>
                                            {item.agent || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-kast-teal">{item.benchmark.toFixed(1)}%</td>
                                    <td className="px-6 py-4 text-right font-mono text-emerald-400">{item.incentive.toFixed(4)}</td>
                                    <td className="px-6 py-4 text-right font-mono text-zinc-300">{item.emission.toFixed(0)}</td>
                                    <td className="px-6 py-4 text-right font-mono text-zinc-300">{item.consensus.toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-right font-mono text-zinc-400">{item.findings_discovered}</td>
                                </tr>
                            ))}
                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-zinc-500 font-mono text-sm">
                                        No leaderboard rows available for the current data.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <Users className="w-3 h-3" />
                Units: `Avg Score`/`Success Rate` in %, `Total Reward` in score units.
            </div>
        </motion.div>
    );
}
