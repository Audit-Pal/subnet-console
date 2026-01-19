"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Target,
    Zap,
    Brain,
    Shield,
    MousePointer2,
    BarChart3,
    Cpu
} from "lucide-react";
import { DataModule } from "@/components/ui/data-module";
import { TechBadge } from "@/components/ui/tech-badge";

interface DetailedAnalyticsProps {
    metrics?: {
        clarity: number;
        specificity: number;
        coherence: number;
        safety: number;
        engagement: number;
        complexity: number;
    };
}

export default function DetailedAnalytics({ metrics }: DetailedAnalyticsProps) {
    // Default metrics if not provided
    const data = metrics || {
        clarity: 92,
        specificity: 88,
        coherence: 95,
        safety: 100,
        engagement: 85,
        complexity: 45
    };

    const analyticsItems = [
        {
            label: "CLARITY_INDEX",
            value: data.clarity,
            icon: Target,
            desc: "Semantic precision and ambiguity reduction",
            color: "text-emerald-500",
            barColor: "bg-emerald-500"
        },
        {
            label: "SPECIFICITY_SCORE",
            value: data.specificity,
            icon: MousePointer2,
            desc: "Contextual detail and constraint definition",
            color: "text-blue-500",
            barColor: "bg-blue-500"
        },
        {
            label: "COHERENCE_RATING",
            value: data.coherence,
            icon: Brain,
            desc: "Logical flow and structural integrity",
            color: "text-purple-500",
            barColor: "bg-purple-500"
        },
        {
            label: "SAFETY_PROTOCOL",
            value: data.safety,
            icon: Shield,
            desc: "Guardrail adherence and risk mitigation",
            color: "text-amber-500",
            barColor: "bg-amber-500"
        },
        {
            label: "ENGAGEMENT_FACTOR",
            value: data.engagement,
            icon: Activity,
            desc: "Response quality and interaction depth",
            color: "text-pink-500",
            barColor: "bg-pink-500"
        },
        {
            label: "COMPLEXITY_LOAD",
            value: data.complexity,
            icon: Cpu,
            desc: "Cognitive processing requirements",
            color: "text-cyan-500",
            barColor: "bg-cyan-500"
        },
    ];

    return (
        <DataModule
            title="METRICS_ANALYSIS"
            icon={<BarChart3 className="w-4 h-4 text-zinc-500" />}
            action={<TechBadge variant="default">ALL SYSTEMS NOMINAL</TechBadge>}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {analyticsItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-4 bg-white/5 border border-white/5 rounded-md hover:bg-white/[0.08] hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-1.5 rounded-sm bg-black border border-white/10 shadow-sm ${item.color}`}>
                                    <item.icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-mono text-lg font-bold text-white">{item.value}%</span>
                            </div>

                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    className={`h-full ${item.barColor}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                />
                            </div>
                        </div>

                        <div>
                            <span className="text-[9px] font-bold text-zinc-500 tracking-wider block mb-1">{item.label}</span>
                            <p className="text-[9px] text-zinc-400 leading-tight line-clamp-2">
                                {item.desc}
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
