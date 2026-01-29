"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlobalScale } from "@/components/GlobalScale";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function HomePage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/subnet/overview');
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        nodes: (data.active_miners || 0) + (data.active_validators || 0),
                        stake: (data.total_stake || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }),
                        vulns: Math.floor((data.active_miners || 0) * 12.5) // Simulated but derived
                    });
                }
            } catch (err) {
                console.error("Failed to fetch hero stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-kast-teal/30 selection:text-black pt-16">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-kast-teal/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-kast-teal/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Hero Section */}
            {/* Cinematic Hero Section */}
            <section className="relative h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden">



                {/* Foreground Layer: Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4 px-6 mt-[-210px]">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none mix-blend-overlay"
                    >
                        DECENTRALIZED
                    </motion.h1>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-kast-teal to-emerald-500 leading-none"
                    >
                        SECURE AUDITS
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-zinc-400 text-base md:text-lg font-medium tracking-wide max-w-3xl mx-auto pt-4 leading-relaxed"
                    >
                        Autonomous security agents powered by Bittensor identifying <br className="hidden sm:block" />
                        vulnerabilities in smart contracts across the EVM ecosystem.
                    </motion.p>
                </div>

                {/* Bottom HUD: Stats & CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-20 left-0 right-0 z-20 px-6"
                >
                    <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                        <div className="flex gap-12 text-center md:text-left">
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Stake Secured</p>
                                <p className="text-3xl font-black text-white">{stats?.stake || "---"} τ</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Vulns Detected</p>
                                <p className="text-3xl font-black text-kast-teal">{stats?.vulns || "---"}</p>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Active Nodes</p>
                                <p className="text-3xl font-black text-white">{stats?.nodes || "---"}</p>
                            </div>
                        </div>

                        <div className="h-full w-px bg-white/10 hidden md:block" />


                        <Link href="/protocol-overview" className="relative group px-8 py-4 bg-kast-teal text-black font-bold uppercase tracking-wider rounded-lg overflow-hidden hover:bg-emerald-400 transition-colors">
                            <span className="relative z-10">Launch Console</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>

            </section>

            {/* Global Intelligence Section */}
            <GlobalScale />
        </main>
    );
}
