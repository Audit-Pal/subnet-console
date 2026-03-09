"use client";

import { motion } from "framer-motion";
import { GlobalScale } from "@/components/GlobalScale";
import Link from "next/link";

export default function HomePage() {
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
                <div className="relative z-10 flex flex-col items-center text-center space-y-4 px-6 -mt-6 md:-mt-4">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none mix-blend-overlay"
                    >
                        ON-CHAIN SECURITY
                    </motion.h1>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-kast-teal to-emerald-500 leading-none"
                    >
                        BOUNTY LAYER
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-zinc-400 text-base md:text-lg font-medium tracking-wide max-w-3xl mx-auto pt-4 leading-relaxed"
                    >
                        Built to evolve continuously as a competitive Bittensor $TAO subnet.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="pt-8 flex flex-wrap items-center justify-center gap-3"
                    >
                        <Link href="/network" className="relative group px-8 py-3 bg-kast-teal text-white font-semibold tracking-wider rounded-full overflow-hidden hover:bg-emerald-400 transition-colors">
                            <span className="relative z-10">View Live Network</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                        <Link href="/docs" className="px-8 py-3 border border-white/20 text-white font-semibold tracking-wider rounded-full hover:border-kast-teal/60 hover:text-kast-teal transition-colors">
                            Docs
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Global Intelligence Section */}
            <GlobalScale />
        </main>
    );
}
