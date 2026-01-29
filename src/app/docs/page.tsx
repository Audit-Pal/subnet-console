"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, BookOpen, Zap, ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocsPage() {
    return (
        <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-kast-teal/5 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center justify-center h-full">


                {/* Main icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 mb-4 relative group"
                >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-kast-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative z-10"
                    >
                        <FileText className="w-10 h-10 text-kast-teal drop-shadow-[0_0_15px_rgba(30,186,152,0.3)]" />
                    </motion.div>
                </motion.div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-kast-teal/10 border border-kast-teal/20 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-kast-teal animate-pulse" />
                        <span className="text-[10px] font-bold font-mono text-kast-teal uppercase tracking-widest">
                            In Development
                        </span>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black font-sans uppercase text-white mb-2 tracking-tighter"
                >
                    DOCS<span className="text-kast-teal">_</span> <span className="text-zinc-500">COMING_SOON</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xl mx-auto font-light"
                >
                    We&apos;re building the ultimate knowledge base for <span className="text-white font-medium">AuditPal</span>.
                    Architecture guides, API references, and advanced validation protocols are on the way.
                </motion.p>

                {/* Features preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    {[
                        { icon: BookOpen, label: "Guided Tutorials", desc: "Step-by-step logic", color: "text-blue-400" },
                        { icon: Terminal, label: "API Reference", desc: "Endpoints & schemas", color: "text-kast-teal" },
                        { icon: Zap, label: "Optimization", desc: "Performance tuning", color: "text-amber-400" },
                    ].map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="p-4 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <h3 className="text-sm font-bold font-mono text-zinc-200 mb-2 uppercase tracking-wide">{item.label}</h3>
                            <p className="text-xs text-zinc-500 font-mono">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link href="/tasks">
                        <Button
                            variant="outline"
                            className="h-12 px-8 bg-transparent text-white border-zinc-700 hover:bg-white/5 hover:border-kast-teal hover:text-kast-teal font-mono tracking-widest text-xs uppercase"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Base
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
