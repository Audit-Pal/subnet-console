"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Zap, Clock, Activity } from 'lucide-react';
import { DataModule } from "@/components/ui/data-module";
import { TechBadge } from "@/components/ui/tech-badge";

interface MetricsChartProps {
    originalTokens: number;
    optimizedTokens: number;
    originalLatency: number;
    optimizedLatency: number;
}

export default function MetricsChart({
    originalTokens,
    optimizedTokens,
    originalLatency,
    optimizedLatency,
}: MetricsChartProps) {
    const tokenData = [
        { name: 'ORIGINAL', value: originalTokens, type: 'tokens' },
        { name: 'OPTIMIZED', value: optimizedTokens, type: 'tokens' },
    ];

    const latencyData = [
        { name: 'ORIGINAL', value: originalLatency, type: 'latency' },
        { name: 'OPTIMIZED', value: optimizedLatency, type: 'latency' },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-950 border border-white/10 p-2 rounded-sm shadow-xl backdrop-blur-md">
                    <div className="text-[10px] text-zinc-500 font-mono tracking-widest mb-1">{label}</div>
                    <div className="text-white font-mono font-bold text-sm">
                        {payload[0].value}
                        <span className="text-[10px] text-zinc-600 ml-1">
                            {payload[0].payload.type === 'tokens' ? 'TKN' : 'MS'}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Token Usage Module */}
            <DataModule
                title="TOKEN_CONSUMPTION"
                icon={<Zap className="w-3 h-3 text-amber-500" />}
                action={<TechBadge variant="warning">REDUCED</TechBadge>}
            >
                <div className="h-[200px] w-full relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="border-b border-dashed border-white/10 w-full" />
                        <div className="border-b border-dashed border-white/10 w-full" />
                        <div className="border-b border-dashed border-white/10 w-full" />
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tokenData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                {tokenData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 0 ? '#fbbf24' : '#1EBA98'}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Technical Readout Overlay */}
                    <div className="absolute bottom-2 right-2 font-mono text-[9px] text-zinc-600 text-right">
                        <div>DELTA: -{Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100)}%</div>
                        <div>EFFICIENCY: HIGH</div>
                    </div>
                </div>
            </DataModule>

            {/* Latency Module */}
            <DataModule
                title="LATENCY_ANALYSIS"
                icon={<Clock className="w-3 h-3 text-blue-500" />}
                action={<TechBadge variant="success">FASTER</TechBadge>}
            >
                <div className="h-[200px] w-full relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="border-b border-dashed border-white/10 w-full" />
                        <div className="border-b border-dashed border-white/10 w-full" />
                        <div className="border-b border-dashed border-white/10 w-full" />
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={latencyData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                {latencyData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 0 ? '#60a5fa' : '#c084fc'}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Technical Readout Overlay */}
                    <div className="absolute bottom-2 right-2 font-mono text-[9px] text-zinc-600 text-right">
                        <div>DELTA: -{Math.round(((originalLatency - optimizedLatency) / originalLatency) * 100)}%</div>
                        <div>VELOCITY: OPTIMAL</div>
                    </div>
                </div>
            </DataModule>
        </div>
    );
}
