"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { DataModule } from "@/components/ui/data-module";
import { Activity } from "lucide-react";

const data = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    score: 70 + Math.random() * 10 - 5 + (i / 50) * 5
}));

export default function EarnedHistoryChart() {
    return (
        <DataModule className="h-[300px] bg-black/40 backdrop-blur-sm border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4 text-kast-teal" />
                    EARNED_HISTORY
                </h3>
            </div>
            <div className="flex-1 p-4 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis
                            dataKey="time"
                            hide
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#000',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                fontFamily: 'monospace',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#1EBA98' }}
                            cursor={{ stroke: '#1EBA98', strokeWidth: 1, strokeDasharray: '4 4' }}
                            labelStyle={{ display: 'none' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#1EBA98"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#1EBA98', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </DataModule>
    );
}
