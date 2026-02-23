"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizationWorkspace } from "@/components/OptimizationWorkspace";
import { OptimizationOverview } from "@/components/OptimizationOverview";
import { OptimizationLeaderboard } from "@/components/OptimizationLeaderboard";
import { OptimizationSubmissions } from "@/components/OptimizationSubmissions";

import { OptimizationValidator } from "@/components/OptimizationValidator";
import { OptimizationChallenges, Challenge } from "@/components/OptimizationChallenges";
import { LayoutDashboard, PenTool, BarChart2, List, BookOpen, Package, Zap, Trophy, Users, Target, Shield, Cpu, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { OptimizationRegistration, RegistrationSuccessModal } from "@/components/OptimizationRegistration";

import { useParams } from "next/navigation";
import { getBenchmarkById } from "@/config/benchmarks";

export default function OptimizePage() {
    const params = useParams();
    const id = params.id as string;
    const benchmark = getBenchmarkById(id);

    const [activeView, setActiveView] = useState<'overview' | 'workspace' | 'leaderboard' | 'submissions' | 'validator' | 'challenges' | 'challenge-detail'>('overview');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [overview, setOverview] = useState<any>(null);
    const [performance, setPerformance] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [overRes, perfRes] = await Promise.all([
                    fetch('/api/subnet/overview'),
                    fetch('/api/subnet/performance')
                ]);
                if (overRes.ok) setOverview(await overRes.json());
                if (perfRes.ok) setPerformance(await perfRes.json());
            } catch (error) {
                console.error("Failed to fetch benchmark stats:", error);
            }
        };
        fetchStats();
    }, []);

    const handleInitializeFlow = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setActiveView('challenge-detail');
    };

    const handleRegister = (name: string, wallet: string) => {
        console.log("Registered:", name, wallet);
        setIsRegistered(true);
        setShowRegistration(false);
        setShowSuccess(true);
    };

    if (!benchmark) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black">404</h1>
                    <p className="text-zinc-500 font-mono">Benchmark suite not found.</p>
                    <Link href="/benchmark" className="text-kast-teal hover:underline uppercase text-xs font-bold tracking-widest">Back to Benchmarks</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-black text-white pt-12">
            <div className="w-full">
                {/* 1. Flagship Event Header (Ultra-Compact) */}
                <div className="relative bg-black border-b border-white/5 overflow-hidden font-sans">

                    {/* Background: Static Light Grid */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 py-2 max-w-7xl relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                            <div className="space-y-2 max-w-2xl">

                                {/* Badges - Ultra-minimal pills */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="px-2 py-0.5 rounded-full bg-kast-teal/10 border border-kast-teal/20 text-kast-teal text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-kast-teal shadow-[0_0_5px_rgba(30,186,152,0.5)]" />
                                        Active Protocol
                                    </div>
                                    <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                                        {benchmark.category}
                                    </div>
                                </div>

                                {/* Title - Ultra-Compact & Balanced */}
                                <div className="space-y-2.5">
                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-[800] tracking-tight text-white leading-none max-w-lg uppercase">
                                        {benchmark.name}
                                    </h1>

                                </div>
                            </div>

                            {/* Stat Cards - Ultra-Compact & Professional */}
                            <div className="flex flex-row gap-3 w-full lg:w-auto items-center justify-center lg:justify-end pb-0.5">
                                <div className="px-5 py-4 rounded-lg bg-white/5 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.2)] min-w-[140px] backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-1 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                                        <Target className="w-3 h-3 text-kast-teal" /> Accuracy Peak
                                    </div>
                                    <div className="text-xl font-[800] text-kast-teal tracking-tight font-mono">
                                        {performance ? `${(performance.average_accuracy * 100).toFixed(1)}%` : benchmark.stats.accuracy}
                                    </div>
                                </div>
                                <div className="px-5 py-4 rounded-lg bg-white/5 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.2)] min-w-[140px] backdrop-blur-md">
                                    <div className="flex items-center gap-2 mb-1 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                                        <Cpu className="w-3 h-3 text-indigo-500" /> Audit Nodes
                                    </div>
                                    <div className="text-xl font-[800] text-white tracking-tight font-mono">
                                        {overview ? overview.active_validators + overview.active_miners : benchmark.stats.nodes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Sticky Navigation Strip */}
                <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/5">
                    <div className="container mx-auto px-4 sm:px-6 max-w-7xl 2xl:max-w-[1600px]">
                        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar h-13">
                            {[
                                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                                { id: 'challenges', label: 'Challenges', icon: Sparkles },
                                { id: 'workspace', label: 'Playground', icon: PenTool },
                                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                                { id: 'submissions', label: 'Submissions', icon: List },

                                { id: 'validator', label: 'Validators', icon: Shield },
                            ].map((tab) => {
                                const isActive = activeView === tab.id || (tab.id === 'challenges' && activeView === 'challenge-detail');
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveView(tab.id as typeof activeView);
                                            if (tab.id === 'workspace') {
                                                setSelectedChallenge(null);
                                            }
                                        }}
                                        className={cn(
                                            "relative h-full flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap px-1 group",
                                            isActive
                                                ? "text-kast-teal font-bold"
                                                : "text-zinc-500 hover:text-white"
                                        )}
                                    >
                                        <tab.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600")} />
                                        {tab.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-kast-teal"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 3. Main Content Container */}
                <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl 2xl:max-w-[1600px] min-h-screen">

                    {/* Breadcrumbs for Challenges */}
                    {(activeView === 'challenges' || activeView === 'challenge-detail') && (
                        <nav className="flex items-center gap-2 mb-4 text-[11px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500">
                            <button
                                onClick={() => {
                                    setActiveView('challenges');
                                    setSelectedChallenge(null);
                                }}
                                className={cn(
                                    "transition-colors",
                                    activeView === 'challenges' ? "text-kast-teal" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    Challenges
                                </div>
                            </button>

                            {activeView === 'challenge-detail' && selectedChallenge && (
                                <>
                                    <ChevronRight className="w-3 h-3 text-zinc-700" />
                                    <span className="text-white flex items-center gap-2">
                                        <Target className="w-3 h-3 text-kast-teal" />
                                        {selectedChallenge.name.replace(/^\d{4}\.\d{2}\.\d{2}\s*-\s*Final\s*-\s*/i, '').replace(/^Final\s*-\s*/i, '').replace(/\s*Audit Report$/i, '')}
                                    </span>
                                </>
                            )}
                        </nav>
                    )}

                    <AnimatePresence mode="wait">
                        {activeView === 'overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <OptimizationOverview
                                    onStartNew={() => setActiveView('workspace')}
                                    onRegister={() => setShowRegistration(true)}
                                    isRegistered={isRegistered}
                                    benchmark={benchmark}
                                />
                            </motion.div>
                        ) : activeView === 'challenges' ? (
                            <motion.div
                                key="challenges"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationChallenges
                                    onInitializeFlow={handleInitializeFlow}
                                    benchmarkId={id}
                                />
                            </motion.div>
                        ) : activeView === 'leaderboard' ? (
                            <motion.div
                                key="leaderboard"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationLeaderboard benchmarkId={id} />
                            </motion.div>
                        ) : activeView === 'submissions' ? (
                            <motion.div
                                key="submissions"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationSubmissions benchmarkId={id} />
                            </motion.div>

                        ) : activeView === 'validator' ? (
                            <motion.div
                                key="validator"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationValidator benchmarkId={id} />
                            </motion.div>
                        ) : activeView === 'challenge-detail' && selectedChallenge ? (
                            <motion.div
                                key="challenge-detail"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationWorkspace
                                    challenge={selectedChallenge}
                                    benchmarkId={id}
                                    onClose={() => {
                                        setActiveView('challenges');
                                        setSelectedChallenge(null);
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="workspace"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationWorkspace
                                    challenge={null}
                                    benchmarkId={id}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <OptimizationRegistration
                    isOpen={showRegistration}
                    onClose={() => setShowRegistration(false)}
                    onRegister={handleRegister}
                />

                <RegistrationSuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setActiveView('workspace');
                    }}
                />
            </div>
        </div>
    );
}


