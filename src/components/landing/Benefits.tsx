"use client";

import { motion } from "framer-motion";
import { Upload, Activity, TrendingUp, Cpu, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function Benefits() {
    const [stats, setStats] = useState({
        completedSessions: 175,
        avgScore: 35.5,
        passRate: 100,
        latency: 14,
        apy: 14.2,
        apyChange: 2.4,
        findings: 0,
        isReal: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [networkRes, sessionRes] = await Promise.all([
                    fetch('/api/subnet/network/stats?window=7d'),
                    fetch('/api/subnet/validation/sessions/stats?timeRange=7d')
                ]);

                if (networkRes.ok && sessionRes.ok) {
                    const networkData = await networkRes.json();
                    const sessionData = await sessionRes.json();

                    if (networkData.is_real || sessionData.is_real) {
                        setStats({
                            completedSessions: sessionData.completed_sessions ?? 175,
                            avgScore: (sessionData.avg_reward_score ?? 0) * 100,
                            passRate: sessionData.total_sessions > 0
                                ? (sessionData.completed_sessions / sessionData.total_sessions) * 100
                                : 100,
                            latency: sessionData.avg_query_time_ms || 14,
                            apy: (sessionData.avg_reward_score || 0.142) * 100,
                            apyChange: 2.4,
                            findings: networkData.total_findings_discovered || 0,
                            isReal: true
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dynamic benefits data:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 px-6 bg-black relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-kast-teal/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-24">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-bold uppercase tracking-[-0.04em] text-white text-center"
                >
                    Beyond <span className="text-zinc-600">Human Speed</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 text-lg md:text-xl text-center max-w-3xl mx-auto leading-relaxed -mt-12 mb-12"
                >
                    Traditional audits are point-in-time and take weeks. Our agents perform continuous real-time analysis, attack simulations, and exploit discovery at machine speed to increase efficiency and frees auditors to focus on business logic, protocol design, and critical risk decisions.
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                    {/* Card 1 */}
                    <BenefitCard
                        title="Static Analysis"
                        subtitle="Real-time vulnerability detection."
                        index={0}
                    >
                        <div className="relative w-full h-full flex flex-col p-8 font-mono">
                            <div className="flex items-center gap-2 mb-6">
                                <div className={`w-2 h-2 rounded-full ${stats.findings > 0 ? 'bg-amber-500' : 'bg-kast-teal'} animate-pulse`} />
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Live Security Scan</span>
                            </div>
                            <div className="space-y-3">
                                <CodeLine delay={0} text="> initializing_auditor_v4" color="text-kast-teal" />
                                <CodeLine delay={0.5} text="> scanning_reentrancy_hooks" color="text-white/60" />
                                <CodeLine delay={1} text="> overflow_checks_complete" color="text-white/60" />
                                <CodeLine
                                    delay={1.5}
                                    text={stats.findings > 0 ? `> ${stats.findings} VULNERABILITIES DETECTED` : "> NO VULNERABILITIES FOUND"}
                                    color={stats.findings > 0 ? "text-amber-500 font-bold" : "text-kast-teal font-bold"}
                                />
                            </div>

                            {/* Scanning Visual */}
                            <div className="mt-8 flex-1 border border-white/5 rounded-xl bg-white/[0.02] relative overflow-hidden flex items-center justify-center">
                                <Cpu className="w-12 h-12 text-kast-teal/20" />
                                <motion.div
                                    animate={{ left: ["-10%", "110%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-kast-teal/20 to-transparent skew-x-12"
                                />
                            </div>
                        </div>
                    </BenefitCard>

                    {/* Card 2 */}
                    <BenefitCard
                        title="Subnet Overview"
                        subtitle="Live network participants and audit activity."
                        index={1}
                    >
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                                    <circle cx="50" cy="50" r="45" className="stroke-white/5" fill="none" strokeWidth="4" />
                                    <motion.circle
                                        cx="50" cy="50" r="45"
                                        className="stroke-kast-teal"
                                        fill="none"
                                        strokeWidth="4"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 283 }}
                                        whileInView={{ strokeDashoffset: 283 - (283 * Math.min((stats.completedSessions || 175) / 250, 1)) }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-x-0 flex flex-col items-center">
                                    <span className="text-4xl font-bold text-white tracking-tighter">{stats.completedSessions || 175}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Audit Sessions</span>
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Validators</div>
                                    <div className="text-white font-bold tracking-tight">2</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Miners</div>
                                    <div className="text-white font-bold tracking-tight">5</div>
                                </div>
                            </div>
                        </div>
                    </BenefitCard>

                    {/* Card 3 */}
                    <BenefitCard
                        title="Network Performance"
                        subtitle="Real-time session metrics from the subnet."
                        index={2}
                    >
                        <div className="relative w-full h-full flex flex-col p-8">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Avg Session Score</p>
                                    <h4 className="text-3xl font-bold text-white tracking-tight">{(stats.avgScore || 35.5).toFixed(1)}%</h4>
                                </div>
                            </div>

                            <div className="flex-1 flex items-end justify-between gap-1.5 h-32">
                                {[35, 45, 30, 60, 40, ((stats.avgScore || 35.5) % 100), 50, 70].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                                        className={`flex-1 rounded-t-[2px] relative group/bar ${i === 5 ? 'bg-kast-teal shadow-[0_0_20px_#1EBA98]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap`}>
                                            {h.toString().slice(0, 4)}%
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </BenefitCard>
                </div>
            </div>
        </section>
    );
}

function BenefitCard({ title, subtitle, index, children }: { title: string, subtitle: string, index: number, children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="group relative h-auto min-h-[420px] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-kast-teal/30 transition-all flex flex-col overflow-hidden"
        >
            {/* Top Content Area */}
            <div className="flex-1">
                {children}
            </div>

            {/* Bottom Info Area */}
            <div className="p-8 pt-0 mt-auto">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-kast-teal" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[240px]">
                    {subtitle}
                </p>
            </div>

            {/* Subtle Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-kast-teal/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}

function CodeLine({ text, color, delay }: { text: string, color: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={`text-[10px] uppercase tracking-widest ${color}`}
        >
            {text}
        </motion.div>
    );
}
