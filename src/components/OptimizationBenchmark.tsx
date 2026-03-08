"use client";

import { motion } from "framer-motion";
import { BarChart, Target, Settings, RefreshCw } from "lucide-react";

export function OptimizationBenchmark() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto px-4"
        >
            <div className="relative mb-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-kast-teal/20 blur-3xl rounded-full scale-150 animate-pulse" />

                <div className="relative bg-zinc-950 p-6 rounded-2xl shadow-xl border border-white/10 ring-4 ring-white/5">
                    <BarChart className="w-12 h-12 text-kast-teal" />
                </div>

                {/* Floating elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 -top-4 bg-zinc-900 p-2.5 rounded-xl shadow-lg border border-white/10"
                >
                    <Target className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-6 -bottom-2 bg-zinc-900 p-2.5 rounded-xl shadow-lg border border-white/10"
                >
                    <Settings className="w-5 h-5 text-amber-400" />
                </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                Audit Suite <span className="text-red-500">Coming Soon</span>
            </h2>

            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
                We&apos;re building a comprehensive evaluation engine to audit your agents against
                standardized security suites like <span className="font-semibold text-white">SCSVS-CODE</span>, <span className="font-semibold text-white">SWC-Registry</span>, and <span className="font-semibold text-white">Slither-Analyze</span>.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Development in Progress
            </div>
        </motion.div>
    );
}
