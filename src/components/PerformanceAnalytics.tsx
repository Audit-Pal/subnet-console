"use client";

import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { Zap, Clock, Coins, TrendingDown, Activity, Database, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceAnalyticsProps {
    data: {
        originalTokens: number;
        optimizedTokens: number;
        originalLatency: number;
        optimizedLatency: number;
        sampleCount: number;
    };
    samples: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2 font-mono">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-mono mb-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-zinc-500 uppercase">{entry.name}:</span>
                        <span className="text-white font-bold">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function PerformanceAnalytics({ data, samples }: PerformanceAnalyticsProps) {
    const tokenDiff = data.originalTokens - data.optimizedTokens;
    const latencyDiff = data.originalLatency - data.optimizedLatency;
    const percentTokenSavings = ((tokenDiff / data.originalTokens) * 100).toFixed(1);
    const percentLatencySavings = ((latencyDiff / data.originalLatency) * 100).toFixed(1);

    // Cost calculation (mock)
    const costPerToken = 0.00003; // $30 per 1M tokens
    const costSavingsPerQuery = (data.originalTokens - data.optimizedTokens) * costPerToken;
    const costSavingsPer1000 = costSavingsPerQuery * 1000;

    const chartData = [
        {
            name: "Tokens",
            Original: Math.round(data.originalTokens),
            Optimized: Math.round(data.optimizedTokens),
        },
        {
            name: "Latency (ms)",
            Original: Math.round(data.originalLatency),
            Optimized: Math.round(data.optimizedLatency),
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border border-white/5 bg-white/5 rounded-2xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <Activity className="w-5 h-5 text-kast-teal" />
                    <h2 className="text-base font-bold text-white uppercase tracking-widest font-mono">
                        AUDIT_PERFORMANCE
                    </h2>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Cost Efficiency Section */}
                    <div className="border border-white/5 bg-white/5 rounded-2xl flex flex-col items-center justify-center p-6 h-full min-h-[220px]">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128" preserveAspectRatio="xMidYMid meet">
                                <circle cx="64" cy="64" r="60" stroke="#111" strokeWidth="8" fill="transparent" />
                                <motion.circle
                                    cx="64" cy="64" r="60"
                                    stroke="#1EBA98"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={377}
                                    strokeDashoffset={377}
                                    animate={{ strokeDashoffset: 377 - (377 * 95) / 100 }} // Assuming constant high efficiency for visual
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 -translate-x-[54%] -translate-y-[60%] flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">${costSavingsPer1000.toFixed(2)}</span>
                            </div>
                            <div className="absolute inset-x-0 bottom-9 flex justify-center">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">PER 1K RUNS</span>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">COST_EFFICIENCY</h3>
                    </div>

                    {/* Token Comparison Section */}
                    <div className="border border-white/5 bg-white/5 rounded-2xl flex flex-col h-full overflow-hidden">
                        <div className="pb-2 border-b border-white/5 bg-white/5 p-4">
                            <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
                                <Database className="w-3.5 h-3.5 text-kast-teal" />
                                TOKEN USAGE
                            </CardTitle>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white font-mono tracking-tight">
                                    -{Math.round(tokenDiff)}
                                    <span className="text-[10px] font-bold text-zinc-500 ml-1">tokens</span>
                                </span>
                                <span className="bg-kast-teal/10 text-kast-teal text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono border border-kast-teal/20">
                                    -{percentTokenSavings}%
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono mt-0.5">SAVED PER QUERY</p>
                        </div>
                        <div className="flex-1 flex flex-col p-4">
                            <div className="h-[80px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[chartData[0]]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={18} barGap={8}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#111" />
                                        <XAxis type="number" stroke="#333" fontSize={8} tickLine={false} axisLine={false} fontFamily="monospace" />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="Original" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="Optimized" fill="#10b981" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-2">
                                <div className="flex items-center justify-between text-[8px] font-bold font-mono text-zinc-500 uppercase">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span>Original</span>
                                    </div>
                                    <span>{Math.round(data.originalTokens)}</span>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-bold font-mono text-zinc-500 uppercase">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-kast-teal" />
                                        <span>Optimized</span>
                                    </div>
                                    <span>{Math.round(data.optimizedTokens)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latency Comparison Section */}
                    <div className="border border-white/5 bg-white/5 rounded-2xl flex flex-col h-full overflow-hidden">
                        <div className="pb-2 border-b border-white/5 bg-white/5 p-4">
                            <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
                                <TrendingDown className="w-3.5 h-3.5 text-kast-teal" />
                                LATENCY
                            </CardTitle>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white font-mono tracking-tight">
                                    -{Math.round(latencyDiff)}
                                    <span className="text-[10px] font-bold text-zinc-500 ml-1">ms</span>
                                </span>
                                <span className="bg-sky-500/10 text-sky-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono border border-sky-500/20">
                                    -{percentLatencySavings}%
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono mt-0.5">FASTER RESPONSE</p>
                        </div>
                        <div className="flex-1 flex flex-col p-4">
                            <div className="h-[80px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[chartData[1]]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={18} barGap={8}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#111" />
                                        <XAxis type="number" stroke="#333" fontSize={8} tickLine={false} axisLine={false} fontFamily="monospace" />
                                        <YAxis type="category" dataKey="name" hide />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="Original" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="Optimized" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-2">
                                <div className="flex items-center justify-between text-[8px] font-bold font-mono text-zinc-500 uppercase">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span>Original</span>
                                    </div>
                                    <span>{Math.round(data.originalLatency)}ms</span>
                                </div>
                                <div className="flex items-center justify-between text-[8px] font-bold font-mono text-zinc-500 uppercase">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span>Optimized</span>
                                    </div>
                                    <span>{Math.round(data.optimizedLatency)}ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


