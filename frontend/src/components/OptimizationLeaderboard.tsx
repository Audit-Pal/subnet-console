"use client";

import { useState } from "react";

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

const leaderboardData: LeaderboardEntry[] = [
    {
        rank: 1,
        previousRank: 1,
        name: "thisisit",
        winRate: "84.2%",
        wins: 842,
        attempts: 1000,
        rewards: "1,247.83 τ",
        age: "82 days",
        trend: [75, 78, 82, 80, 85, 83, 88, 86, 90],
        isTeam: false
    },
    {
        rank: 2,
        previousRank: 3,
        name: "OMG",
        winRate: "77.1%",
        wins: 756,
        attempts: 980,
        rewards: "1,089.45 τ",
        age: "65 days",
        trend: [70, 75, 72, 80, 78, 85, 82, 88, 84],
        isTeam: true
    },
    {
        rank: 3,
        previousRank: 2,
        name: "Rudiger",
        winRate: "68.9%",
        wins: 620,
        attempts: 900,
        rewards: "892.12 τ",
        age: "45 days",
        trend: [65, 68, 70, 72, 68, 70, 72, 75, 73],
        isTeam: false
    },
    {
        rank: 4,
        previousRank: 4,
        name: "pop",
        winRate: "68.2%",
        wins: 580,
        attempts: 850,
        rewards: "756.89 τ",
        age: "38 days",
        trend: [60, 65, 68, 70, 68, 72, 70, 74, 72],
        isTeam: false
    },
    {
        rank: 5,
        previousRank: 8,
        name: "hot",
        winRate: "51.2%",
        wins: 410,
        attempts: 800,
        rewards: "423.56 τ",
        age: "21 days",
        trend: [45, 48, 50, 52, 50, 53, 51, 54, 52],
        isTeam: false
    }
];

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

export function OptimizationLeaderboard() {
    const [searchQuery, setSearchQuery] = useState("");

    // Reorder for podium display: 2nd, 1st, 3rd
    const topThree = [leaderboardData[1], leaderboardData[0], leaderboardData[2]];

    const filteredData = leaderboardData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
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
                                                Miner
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
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Miner</th>
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
                                            {String(item.rank).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                {item.rank === 1 ? <Crown className="w-4 h-4 text-amber-500" /> :
                                                    <span className="text-xs font-bold text-zinc-500">{item.name.substring(0, 2).toUpperCase()}</span>}
                                            </div>
                                            <div className="flex flex-col">
                                                <Link href={`/miner/${item.name.toLowerCase()}`} className="text-sm font-bold text-white group-hover:text-kast-teal transition-colors hover:underline">
                                                    {item.name}
                                                </Link>
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
    );
}
