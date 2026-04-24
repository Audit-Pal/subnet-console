"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Globe } from "@/components/landing/Globe";
import { HolographicShield } from "@/components/landing/HolographicShield";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-start pt-24 md:pt-32 px-6 lg:px-12 overflow-hidden bg-black selection:bg-kast-teal/30">
            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-kast-teal/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start w-full">
                {/* Left Content */}
                <div className="flex flex-col gap-6 z-10 w-full mt-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-3"
                    >
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black uppercase tracking-[-0.02em] leading-[1.15]"
                    >
                        <span className="block text-white">OPERATING SYSTEM</span>
                        <span className="block text-zinc-400">FOR SMART</span>
                        <span className="block text-zinc-600">CONTRACT AUDITS</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col gap-4 mt-2"
                    >
                        {[
                            "Continuous Security Intelligence",
                            "AI-Assisted Audit Workspace",
                            "Automated Analysis Engine",
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-kast-teal" strokeWidth={3} />
                                <span className="text-base md:text-lg text-gray-300 font-medium">{item}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-wrap items-center gap-4 mt-6"
                    >
                        <a
                            href="http://app.auditpal.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-kast-teal text-black text-lg font-bold rounded-full hover:scale-105 transition-transform text-center"
                        >
                            Try Auditor Co-Pilot
                        </a>
                        <Link
                            href="http://subnet.auditpal.io/"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-medium rounded-full hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                            Competition Portal
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    <div className="flex items-center gap-5 mt-8">
                        <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-[0.15em] sm:tracking-[0.25em] leading-tight">
                            Powered by bittensor
                        </p>
                    </div>
                </div>

                {/* Right Visual - Holographic Shield + Globe */}
                <div className="relative h-[600px] flex items-center justify-center perspective-[2000px]">
                    {/* 3D Globe - Constant & Consistent */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                        <Globe />
                    </div>

                    <div className="relative z-10 scale-110">
                        <HolographicShield />
                    </div>
                </div>
            </div>
        </section>
    );
}
