"use client";

import { motion } from 'framer-motion';
import { DollarSign, Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import { DataModule } from "@/components/ui/data-module";

interface SavingsChartProps {
    costPerQuery: number;
    tokenSavings: string;
    latencyImprovement: string;
}

export default function SavingsChart({ costPerQuery, tokenSavings, latencyImprovement }: SavingsChartProps) {
    const yearlySavings = (costPerQuery * 1000 * 365).toFixed(0);

    // Parse percentages for progress bars (cap at 100)
    const tokenPct = Math.min(parseFloat(tokenSavings), 100);
    const latencyPct = Math.min(parseFloat(latencyImprovement), 100);
    // Mock ROI calculation based on savings
    const roiPct = Math.min((parseFloat(yearlySavings) / 50) * 100, 100);

    const metrics = [
        {
            label: "COST_EFFICIENCY",
            value: `$${yearlySavings}`,
            suffix: "/yr",
            pct: roiPct,
            color: "bg-emerald-500",
            icon: DollarSign,
            iconColor: "text-emerald-500",
            desc: "Projected annual savings"
        },
        {
            label: "TOKEN_OPTIMIZATION",
            value: `${tokenSavings}`,
            suffix: "%",
            pct: tokenPct,
            color: "bg-blue-500",
            icon: Zap,
            iconColor: "text-blue-500",
            desc: "Reduction in token usage"
        },
        {
            label: "LATENCY_REDUCTION",
            value: `${latencyImprovement}`,
            suffix: "%",
            pct: latencyPct,
            color: "bg-violet-500",
            icon: Clock,
            iconColor: "text-violet-500",
            desc: "Response time improvement"
        },
        {
            label: "SYSTEM_HEALTH",
            value: "98.5",
            suffix: "%",
            pct: 98.5,
            color: "bg-amber-500",
            icon: Activity,
            iconColor: "text-amber-500",
            desc: "Overall system stability"
        }
    ];

    return (
        <DataModule
            title="SYSTEM_DIAGNOSTICS"
            icon={<Activity className="w-4 h-4 text-emerald-500" />}
            className="h-full flex flex-col"
            contentClassName="flex-1 flex flex-col"
            action={
                <div className="flex items-center gap-1 text-[9px] text-kast-teal font-mono">
                    <TrendingUp className="w-3 h-3" />
                    OPTIMAL
                </div>
            }
        >
            <div className="grid grid-cols-2 gap-3 flex-1">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-3 bg-white/5 border border-white/5 rounded-md hover:bg-white/[0.08] hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-1.5 rounded-sm bg-black border border-white/10 shadow-sm ${metric.iconColor}`}>
                                    <metric.icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="font-mono text-lg font-bold text-white">{metric.value}</span>
                                    <span className="text-[10px] text-zinc-500 font-mono">{metric.suffix}</span>
                                </div>
                            </div>

                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    className={`h-full ${metric.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.pct}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                />
                            </div>
                        </div>

                        <div>
                            <span className="text-[9px] font-bold text-zinc-500 tracking-wider block mb-1">{metric.label}</span>
                            <p className="text-[9px] text-zinc-400 leading-tight line-clamp-2">
                                {metric.desc}
                            </p>
                        </div>

                        {/* Corner accent on hover */}
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-kast-teal/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>
        </DataModule>
    );
}
