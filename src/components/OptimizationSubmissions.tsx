"use client";

import { motion } from "framer-motion";
import { Search, Filter, AppWindow, CheckCircle2, XCircle, Clock, Info, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

// Types matching the Prompt Optimization Challenge
interface Submission {
    id: string;
    minerId: string;
    agentId: string;
    status: 'graded' | 'failed' | 'submitted' | 'running';
    score: string;       // DAS Score
    accuracy: string;    // Recall (%)
    compression: string; // Precision (%)
    tokens: string;      // FP Count
    message: string;
    timestamp: string;
    version: string;
}

const submissionsData: Submission[] = [
    {
        id: "1",
        minerId: "305817",
        agentId: "access-v4",
        status: "submitted",
        score: "-",
        accuracy: "-",
        compression: "-",
        tokens: "-",
        message: "Successfully enqueued 1 Job",
        timestamp: "Mon, 22 Dec 2025 04:31:50",
        version: "v1.4.2"
    },
    {
        id: "2",
        minerId: "305816",
        agentId: "sentry-v12",
        status: "failed",
        score: "0.000",
        accuracy: "-",
        compression: "-",
        tokens: "-",
        message: "compiling model for neuron failed",
        timestamp: "Mon, 22 Dec 2025 04:20:21",
        version: "v1.4.1"
    },
    {
        id: "3",
        minerId: "305815",
        agentId: "gov-v3",
        status: "graded",
        score: "0.847",
        accuracy: "97.2%",
        compression: "0.45",
        tokens: "682",
        message: "Evaluation completed",
        timestamp: "Mon, 22 Dec 2025 04:05:49",
        version: "v1.4.0"
    },
    {
        id: "4",
        minerId: "305814",
        agentId: "auth-v1",
        status: "graded",
        score: "0.823",
        accuracy: "96.1%",
        compression: "0.42",
        tokens: "720",
        message: "Evaluation completed",
        timestamp: "Mon, 22 Dec 2025 03:30:39",
        version: "v1.3.9"
    },
    {
        id: "5",
        minerId: "305813",
        agentId: "comm-v2",
        status: "submitted",
        score: "-",
        accuracy: "-",
        compression: "-",
        tokens: "-",
        message: "Successfully enqueued 1 Job",
        timestamp: "Mon, 22 Dec 2025 03:16:09",
        version: "v1.3.8"
    },
    {
        id: "6",
        minerId: "305812",
        agentId: "crypto-v9",
        status: "failed",
        score: "0.000",
        accuracy: "-",
        compression: "-",
        tokens: "-",
        message: "Runtime Error: Out of memory",
        timestamp: "Mon, 22 Dec 2025 02:38:07",
        version: "v1.3.7"
    },
    {
        id: "7",
        minerId: "305811",
        agentId: "econ-v8",
        status: "graded",
        score: "0.792",
        accuracy: "95.3%",
        compression: "0.38",
        tokens: "768",
        message: "Evaluation completed",
        timestamp: "Mon, 22 Dec 2025 02:36:31",
        version: "v1.3.6"
    }
];

const StatusBadge = ({ status }: { status: Submission['status'] }) => {
    switch (status) {
        case 'graded':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Graded
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3 h-3" />
                    Failed
                </span>
            );
        case 'submitted':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Clock className="w-3 h-3 animate-pulse" />
                    Submitted
                </span>
            );
        case 'running':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Clock className="w-3 h-3 animate-spin" />
                    Running
                </span>
            );
    }
};

interface OptimizationSubmissionsProps {
    benchmarkId?: string;
}

export function OptimizationSubmissions({ benchmarkId }: OptimizationSubmissionsProps = {}) {
    const [filter, setFilter] = useState<'all' | 'graded' | 'failed'>('all');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const res = await fetch('/api/subnet/leaderboard');
                if (res.ok) {
                    const data = await res.json();

                    // Map Real Miner data to Submission format to show "recent" activity
                    let mapped: Submission[] = data.map((miner: any) => ({
                        id: miner.uid.toString(),
                        minerId: miner.uid.toString(),
                        agentId: `agent-${miner.uid}`,
                        status: miner.incentive > 0 ? 'graded' : 'submitted',
                        score: (miner.incentive).toFixed(4),
                        accuracy: (miner.incentive * 100).toFixed(1) + "%",
                        compression: miner.trust.toFixed(2),
                        tokens: "0", // Derived from FP count if we had it
                        message: miner.incentive > 0 ? "Evaluation completed" : "Successfully enqueued Job",
                        timestamp: new Date().toLocaleDateString(), // We don't have exact sub time from metagraph
                        version: "v1.4.2"
                    }));

                    if (benchmarkId === 'evm-bench') {
                        const evmSubmissions: Submission[] = [
                            {
                                id: "evm-sub-01",
                                minerId: "OpenAI-Agent",
                                agentId: "o1-preview",
                                status: "graded",
                                score: "0.852",
                                accuracy: "22.5%",
                                compression: "0.91",
                                tokens: "1,140",
                                message: "Reasoning SOTA Baseline",
                                timestamp: "Fri, 13 Feb 2026 10:00:00",
                                version: "v1.0.0"
                            },
                            {
                                id: "evm-sub-02",
                                minerId: "OpenAI-Agent",
                                agentId: "o1-mini",
                                status: "graded",
                                score: "0.831",
                                accuracy: "21.1%",
                                compression: "0.89",
                                tokens: "1,200",
                                message: "Reasoning SOTA Baseline",
                                timestamp: "Fri, 13 Feb 2026 09:30:00",
                                version: "v1.0.0"
                            },
                            {
                                id: "evm-sub-03",
                                minerId: "OpenAI-Agent",
                                agentId: "GPT-4o",
                                status: "graded",
                                score: "0.722",
                                accuracy: "18.4%",
                                compression: "0.89",
                                tokens: "1,240",
                                message: "Official EVMBench Research Submission",
                                timestamp: "Fri, 13 Feb 2026 10:00:00",
                                version: "v4.0.0"
                            },
                            {
                                id: "evm-sub-04",
                                minerId: "Anthropic-RSRCH",
                                agentId: "Claude 3 Opus",
                                status: "graded",
                                score: "0.685",
                                accuracy: "16.8%",
                                compression: "0.82",
                                tokens: "1,560",
                                message: "Collaboration Technical Baseline",
                                timestamp: "Thu, 12 Feb 2026 14:30:00",
                                version: "v3.0.0"
                            },
                            {
                                id: "evm-sub-05",
                                minerId: "OpenAI-Agent",
                                agentId: "GPT-4 Turbo",
                                status: "graded",
                                score: "0.650",
                                accuracy: "15.0%",
                                compression: "0.80",
                                tokens: "1,600",
                                message: "Technical Baseline",
                                timestamp: "Thu, 12 Feb 2026 10:00:00",
                                version: "v4.0.0-t"
                            },
                            {
                                id: "evm-sub-06",
                                minerId: "Anthropic-RSRCH",
                                agentId: "Claude 3.5 Sonnet",
                                status: "graded",
                                score: "0.610",
                                accuracy: "14.1%",
                                compression: "0.78",
                                tokens: "1,650",
                                message: "Technical Baseline",
                                timestamp: "Wed, 11 Feb 2026 16:20:00",
                                version: "v3.5.0"
                            },
                            {
                                id: "evm-sub-07",
                                minerId: "DeepSeek-Open",
                                agentId: "Coder V2",
                                status: "graded",
                                score: "0.580",
                                accuracy: "12.5%",
                                compression: "0.75",
                                tokens: "1,800",
                                message: "Open-Weight Baseline",
                                timestamp: "Wed, 11 Feb 2026 12:15:00",
                                version: "v2.0.0"
                            },
                            {
                                id: "evm-sub-08",
                                minerId: "Google-DeepMind",
                                agentId: "Gemini 1.5 Pro",
                                status: "graded",
                                score: "0.550",
                                accuracy: "11.9%",
                                compression: "0.72",
                                tokens: "1,900",
                                message: "Technical Baseline",
                                timestamp: "Tue, 10 Feb 2026 10:45:00",
                                version: "v1.5.0"
                            },
                            {
                                id: "evm-sub-09",
                                minerId: "Meta-AI",
                                agentId: "Llama 3 70B",
                                status: "graded",
                                score: "0.420",
                                accuracy: "6.8%",
                                compression: "0.60",
                                tokens: "2,200",
                                message: "Open-Weight Baseline",
                                timestamp: "Mon, 09 Feb 2026 09:10:00",
                                version: "v3.0.0"
                            },
                            {
                                id: "evm-sub-10",
                                minerId: "Mistral-AI",
                                agentId: "Mixtral 8x7B",
                                status: "graded",
                                score: "0.250",
                                accuracy: "3.5%",
                                compression: "0.45",
                                tokens: "2,800",
                                message: "Open-Weight Baseline",
                                timestamp: "Sun, 08 Feb 2026 14:00:00",
                                version: "v8x7b"
                            },
                            {
                                id: "evm-sub-11",
                                minerId: "OpenAI-Agent",
                                agentId: "GPT-3.5 Turbo",
                                status: "graded",
                                score: "0.100",
                                accuracy: "1.2%",
                                compression: "0.30",
                                tokens: "3,500",
                                message: "Legacy Baseline",
                                timestamp: "Sat, 07 Feb 2026 11:30:00",
                                version: "v3.5.0"
                            }
                        ];
                        mapped = evmSubmissions;
                    }

                    setSubmissions(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentActivity();
    }, [benchmarkId]);

    const filteredSubmissions = submissions.filter(item =>
        filter === 'all' ? true : item.status === filter
    );

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
                    "space-y-6 pb-20 transition-all duration-700",
                    isUnderConstruction && "blur-[6px] grayscale opacity-40 pointer-events-none select-none"
                )}
            >
                {/* Header / Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 p-2 rounded-lg shadow-sm border border-white/10 text-zinc-400">
                            <List className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={cn(
                                    "text-sm font-bold tracking-wide transition-colors uppercase font-mono px-1 pb-1",
                                    filter === 'all' ? "text-kast-teal border-b border-kast-teal" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                All Submissions
                            </button>
                            <button
                                onClick={() => setFilter('graded')}
                                className={cn(
                                    "text-sm font-bold tracking-wide transition-colors uppercase font-mono px-1 pb-1",
                                    filter === 'graded' ? "text-emerald-500 border-b border-emerald-500" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                Graded
                            </button>
                            <button
                                onClick={() => setFilter('failed')}
                                className={cn(
                                    "text-sm font-bold tracking-wide transition-colors uppercase font-mono px-1 pb-1",
                                    filter === 'failed' ? "text-rose-500 border-b border-rose-500" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                Failed
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search Miner / Agent ID..."
                            className="w-full bg-zinc-950 border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-kast-teal/20 transition-all font-bold placeholder:text-zinc-600 text-white"
                        />
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-zinc-950 backdrop-blur-md rounded-xl shadow-sm border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans">MINER ID</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans">AGENT_ID</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans w-32">STATUS</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans">LOG_RESULT</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans text-center">SCORE</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans text-center">RECALL</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans text-center">PRECISION</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans text-center">F_POS</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest font-sans text-right">DATE</th>
                                    <th className="px-6 py-3 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-mono font-bold text-xs text-white">#{sub.minerId}</span>
                                                <span className="text-[10px] text-zinc-500 font-mono">{sub.version}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="font-mono font-bold text-xs text-kast-teal">{sub.agentId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={sub.status} />
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            <span className="text-xs text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                                                {sub.message}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "font-mono font-bold text-xs",
                                                sub.status === 'graded' ? "text-white" : "text-zinc-600"
                                            )}>
                                                {sub.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "text-xs font-mono font-bold",
                                                sub.status === 'graded' ? "text-emerald-400" : "text-zinc-600"
                                            )}>{sub.accuracy}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "text-xs font-mono",
                                                sub.status === 'graded' ? "text-kast-teal font-bold" : "text-zinc-600"
                                            )}>{sub.compression}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "text-xs font-mono",
                                                sub.status === 'graded' ? "text-zinc-400" : "text-zinc-600"
                                            )}>{sub.tokens}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <span className="text-xs text-zinc-500">{sub.timestamp}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/miner/${sub.id}`}>
                                                <Button
                                                    size="sm"
                                                    className="bg-white/5 hover:bg-kast-teal text-zinc-400 hover:text-black border border-white/10 hover:border-kast-teal shadow-sm font-bold text-[10px] uppercase tracking-wider h-7 px-3 rounded transition-all"
                                                >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                            <List className="w-8 h-8 text-kast-teal animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Activity Log Initialization</h3>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
                            Submission protocols and real-time evaluation logs will initialize upon mainnet synchronization.
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                Current Phase: Isolated Evaluation & Research
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );

}
