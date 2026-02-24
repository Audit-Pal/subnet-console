"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { DataModule } from "@/components/ui/data-module";
import { Trophy, Users, Filter, Search, Pin, ChevronUp, ChevronDown, Minus, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Enhanced Sparkline component with fuller stroke and gradient
const Sparkline = ({ data, color, height = 40, width = 160 }: { data: number[], color: string, height?: number, width?: number }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
                fill={`url(#gradient-${color})`}
                stroke="none"
            />
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

interface LeaderboardEntry {
    rank: number;
    previousRank: number;
    name: string;
    winRate: string;
    wins: number;
    attempts: number;
    rewards: string;
    age: string;
    trend: number[];
    isTeam: boolean;
}


const RankDelta = ({ current, previous }: { current: number, previous: number }) => {
    if (current < previous) {
        return (
            <div className="flex items-center text-emerald-400 gap-0.5">
                <ChevronUp className="w-3 h-3 stroke-[3]" />
                <span className="text-[10px] font-bold">{previous - current}</span>
            </div>
        );
    }
    if (current > previous) {
        return (
            <div className="flex items-center text-rose-400 gap-0.5">
                <ChevronDown className="w-3 h-3 stroke-[3]" />
                <span className="text-[10px] font-bold">{current - previous}</span>
            </div>
        );
    }
    return <Minus className="w-3 h-3 text-zinc-500" />;
};

interface OptimizationLeaderboardProps {
    benchmarkId?: string;
}

export function OptimizationLeaderboard({ benchmarkId }: { benchmarkId?: string } = {}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/subnet/leaderboard');
                if (res.ok) {
                    const data = await res.json();

                    // Map Real Blockchain Data to the Leaderboard UI
                    let mappedData = data.map((miner: any, index: number) => ({
                        rank: index + 1,
                        previousRank: index + 1, // Mock unchanged for now
                        name: `Miner ${miner.uid}`,
                        hotkey: miner.hotkey,
                        winRate: (miner.incentive * 100).toFixed(1) + "%",
                        wins: Math.floor(miner.incentive * 1000),
                        attempts: 1000,
                        rewards: miner.stake.toLocaleString() + " τ",
                        age: "Active",
                        trend: Array.from({ length: 9 }, () => Math.floor(Math.random() * 20) + 70),
                        isTeam: false
                    }));

                    if (benchmarkId === 'evm-bench') {
                        const evmSota = [
                            {
                                rank: 1,
                                previousRank: 1,
                                name: "o1-preview (Zero-Shot)",
                                winRate: "22.5%",
                                wins: 27,
                                attempts: 120,
                                rewards: "Reasoning SOTA",
                                age: "Verified",
                                trend: [12, 15, 18, 20, 21, 22.5],
                                isTeam: true,
                                isSota: true
                            },
                            {
                                rank: 2,
                                previousRank: 2,
                                name: "o1-mini (Zero-Shot)",
                                winRate: "21.1%",
                                wins: 25,
                                attempts: 120,
                                rewards: "Reasoning",
                                age: "Verified",
                                trend: [10, 14, 16, 18, 20, 21.1],
                                isTeam: true
                            },
                            {
                                rank: 3,
                                previousRank: 3,
                                name: "GPT-4o (Zero-Shot)",
                                winRate: "18.4%",
                                wins: 22,
                                attempts: 120,
                                rewards: "Baseline",
                                age: "Verified",
                                trend: [10, 12, 14, 15, 17, 18.4],
                                isTeam: true,
                                isSota: true
                            },
                            {
                                rank: 4,
                                previousRank: 4,
                                name: "Claude 3 Opus (Zero-Shot)",
                                winRate: "16.8%",
                                wins: 20,
                                attempts: 120,
                                rewards: "Zero-Shot",
                                age: "Verified",
                                trend: [9, 11, 13, 15, 16, 16.8],
                                isTeam: true
                            },
                            {
                                rank: 5,
                                previousRank: 5,
                                name: "GPT-4 Turbo (Zero-Shot)",
                                winRate: "15.0%",
                                wins: 18,
                                attempts: 120,
                                rewards: "Zero-Shot",
                                age: "Verified",
                                trend: [8, 10, 12, 13, 14, 15.0],
                                isTeam: true
                            },
                            {
                                rank: 6,
                                previousRank: 7,
                                name: "Claude 3.5 Sonnet",
                                winRate: "14.1%",
                                wins: 17,
                                attempts: 120,
                                rewards: "Zero-Shot",
                                age: "Verified",
                                trend: [8, 10, 11, 12, 13, 14.1],
                                isTeam: true
                            },
                            {
                                rank: 7,
                                previousRank: 6,
                                name: "DeepSeek Coder V2",
                                winRate: "12.5%",
                                wins: 15,
                                attempts: 120,
                                rewards: "Open-Weight Top",
                                age: "Verified",
                                trend: [4, 6, 8, 10, 11, 12.5],
                                isTeam: true
                            },
                            {
                                rank: 8,
                                previousRank: 8,
                                name: "Gemini 1.5 Pro",
                                winRate: "11.9%",
                                wins: 14,
                                attempts: 120,
                                rewards: "Zero-Shot",
                                age: "Verified",
                                trend: [5, 7, 8, 9, 10, 11.9],
                                isTeam: true
                            },
                            {
                                rank: 9,
                                previousRank: 9,
                                name: "Llama 3 Instruct (70B)",
                                winRate: "6.8%",
                                wins: 8,
                                attempts: 120,
                                rewards: "Open-Weight",
                                age: "Verified",
                                trend: [2, 3, 4, 5, 6, 6.8],
                                isTeam: true
                            },
                            {
                                rank: 10,
                                previousRank: 10,
                                name: "Mixtral 8x7B",
                                winRate: "3.5%",
                                wins: 4,
                                attempts: 120,
                                rewards: "Open-Weight",
                                age: "Verified",
                                trend: [1, 2, 2, 3, 3, 3.5],
                                isTeam: true
                            },
                            {
                                rank: 11,
                                previousRank: 11,
                                name: "GPT-3.5 Turbo",
                                winRate: "1.2%",
                                wins: 1,
                                attempts: 120,
                                rewards: "Legacy Baseline",
                                age: "Verified",
                                trend: [0, 0, 1, 1, 1, 1.2],
                                isTeam: true
                            }
                        ];
                        mappedData = evmSota.map((item, idx) => ({ ...item, rank: idx + 1 }));
                    }

                    setLeaderboard(mappedData);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [benchmarkId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-kast-teal border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 font-mono text-sm">Syncing with Subnet Metagraph...</p>
            </div>
        );
    }

    // Reorder for podium display: 2nd, 1st, 3rd
    const topThree = [leaderboard[1], leaderboard[0], leaderboard[2]].filter(Boolean);

    const filteredData = leaderboard.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hotkey?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isUnderConstruction = benchmarkId === 'evm-bench';

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "space-y-10 pb-20 transition-all duration-700",
                    isUnderConstruction && "blur-[6px] grayscale opacity-40 pointer-events-none select-none"
                )}
            >
                {/* Podium Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end justify-center max-w-5xl mx-auto pt-8">
                    {topThree.map((item, index) => {
                        const isFirst = item.rank === 1;
                        const isSecond = item.rank === 2;
                        const isThird = item.rank === 3;

                        return (
                            <motion.div
                                key={item.rank}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "relative",
                                    isFirst ? "md:-mt-12 order-1 md:order-2 z-10" :
                                        isSecond ? "order-2 md:order-1" : "order-3"
                                )}
                            >
                                <DataModule
                                    className={cn(
                                        "relative overflow-hidden transition-all duration-300",
                                        isFirst
                                            ? "bg-zinc-900 border-amber-500 shadow-[0_8px_30px_rgb(251,191,36,0.15)]"
                                            : "bg-zinc-950 border-white/5 hover:border-white/10 hover:shadow-lg"
                                    )}
                                >
                                    {/* Background Decorations */}
                                    <div className="absolute top-0 right-0 p-3 opacity-30">
                                        <div className="flex gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={cn(
                                                    "w-0.5 h-2 rounded-full",
                                                    isFirst ? "bg-amber-400" : "bg-white/10"
                                                )} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative z-10 p-4 flex flex-col items-center justify-center">
                                        {/* Rank Badge */}
                                        <div className={cn(
                                            "absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm border",
                                            isFirst
                                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                                : isSecond
                                                    ? "bg-white/5 border-white/10 text-zinc-400"
                                                    : "bg-white/5 border-white/10 text-amber-800/70"
                                        )}>
                                            #{item.rank}
                                        </div>

                                        {/* Avatar/Icon - Smaller */}
                                        <div className="mb-2 relative group">
                                            <div className={cn(
                                                "w-14 h-14 rounded-full flex items-center justify-center border-[3px] transition-transform duration-500 group-hover:scale-105",
                                                isFirst
                                                    ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 shadow-sm"
                                                    : "bg-gradient-to-br from-white/5 to-transparent border-white/10"
                                            )}>
                                                {isFirst ? (
                                                    <Crown className="w-6 h-6 text-amber-500" />
                                                ) : isSecond ? (
                                                    <Medal className="w-5 h-5 text-zinc-400" />
                                                ) : (
                                                    <Medal className="w-5 h-5 text-amber-700" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Name & Stats - Compact */}
                                        <div className="text-center w-full">
                                            <div className="mb-2">
                                                <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                                                    {item.name}
                                                    {item.isTeam && (
                                                        <span className="p-0.5 rounded-full bg-white/5" title="Team">
                                                            <Users className="w-3 h-3 text-zinc-500" />
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-0.5">
                                                    Agent
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <div className={cn(
                                                    "text-3xl font-black font-mono tracking-tighter",
                                                    isFirst ? "text-kast-teal" : "text-zinc-300"
                                                )}>
                                                    {item.winRate}
                                                </div>
                                                <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-[-2px]">Win Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                </DataModule>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Controls */}
                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 h-12 w-12 flex items-center justify-center rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.1)] border border-white/10 text-white">
                            <Trophy className="w-6 h-6 stroke-[1.5] text-kast-teal" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Leaderboard</h2>
                    </div>
                    <div className="relative w-full sm:w-72 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-kast-teal/20 to-indigo-500/20 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-zinc-950 rounded-md shadow-sm border border-white/10 flex items-center px-4 py-2.5 transition-shadow group-hover:shadow-md">
                            <Search className="w-4 h-4 text-zinc-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Search participants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-white placeholder:text-zinc-500 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-zinc-950 rounded-lg shadow-sm border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest w-16 text-center">Δ</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest w-16">#</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Agent</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">Win Rate</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">Wins</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">Attempts</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">Rewards</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">Age</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">


                                {/* Data Rows */}
                                {/* Data Rows */}
                                {filteredData.map((item) => (
                                    <tr key={item.rank} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <RankDelta current={item.rank} previous={item.previousRank} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "font-bold text-sm tabular-nums",
                                                item.rank <= 3 ? "text-white" : "text-zinc-600"
                                            )}>
                                                {item.rank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                    {item.rank === 1 ? <Crown className="w-4 h-4 text-amber-500" /> :
                                                        <span className="text-xs font-bold text-zinc-500">{item.name.substring(0, 2).toUpperCase()}</span>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white group-hover:text-kast-teal transition-colors" title={item.hotkey}>
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]" title={item.hotkey}>
                                                        {item.hotkey ? `${item.hotkey.substring(0, 6)}...${item.hotkey.substring(item.hotkey.length - 4)}` : 'No hotkey'}
                                                    </span>
                                                    {item.isTeam && <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Users className="w-3 h-3" /> Team</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-mono font-bold text-kast-teal">{item.winRate}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-mono text-zinc-400">{item.wins}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-mono text-zinc-500">{item.attempts}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-mono text-indigo-400 font-bold">{item.rewards}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-mono text-zinc-500">{item.age}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <Sparkline data={item.trend} color="#1EBA98" height={25} width={100} />
                                            </div>
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
                            <Trophy className="w-8 h-8 text-kast-teal animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Network Initialization In Progress</h3>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
                            Competitive leaderboard scoring will initialize upon mainnet synchronization. Currently in pre-initialization evaluation phase.
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                Protocol Status: Research & Validation
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
