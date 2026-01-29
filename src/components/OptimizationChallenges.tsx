"use client";

import { motion } from "framer-motion";
import {
    Trophy,
    Target,
    Zap,
    Shield,
    ChevronRight,
    Clock,
    Star,
    Flame,
    Code,
    ShieldCheck,
    Box,
    Filter,
    Search,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Interface matching the backend model (plus enriched fields)
export interface Challenge {
    _id: string;
    project_id: string;
    name: string;
    platform: 'code4rena' | 'cantina' | 'sherlock';
    codebases: {
        codebase_id: string;
        repo_url: string;
        commit: string;
        tree_url?: string;
        tarball_url?: string;
    }[];
    // Enriched fields for UI
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    status?: 'Active' | 'Completed';
    participants?: number;
    reward?: string;
    verified?: boolean;
    scabench?: boolean;
}

interface OptimizationChallengesProps {
    onInitializeFlow?: (challenge: Challenge) => void;
}

// Helper function to clean up challenge names
const cleanName = (name: string): string => {
    // Remove date prefixes like "2024.09.20 - Final - "
    let cleaned = name.replace(/^\d{4}\.\d{2}\.\d{2}\s*-\s*Final\s*-\s*/i, '');
    // Also remove just "Final - " prefix if present
    cleaned = cleaned.replace(/^Final\s*-\s*/i, '');
    // Remove trailing " Audit Report" if present
    cleaned = cleaned.replace(/\s*Audit Report$/i, '');
    return cleaned.trim();
};

const DifficultyBadge = ({ level }: { level: string }) => {
    const colors = {
        Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20"
    };
    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", colors[level as keyof typeof colors] || colors.Medium)}>
            {level}
        </span>
    );
};

export function OptimizationChallenges({ onInitializeFlow }: OptimizationChallengesProps) {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // Use deployed API based on user request
                const apiUrl = 'https://audit-api-two.vercel.app';
                const res = await fetch(`${apiUrl}/api/challenges`);

                if (!res.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await res.json();

                // Enrich data with deterministic UI fields based on ID
                const enrichedData = data.map((item: any) => {
                    // Simple hash from _id to get stable "random" values
                    const hash = item._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const difficulties = ['Easy', 'Medium', 'Hard'] as const;

                    return {
                        ...item,
                        difficulty: difficulties[hash % 3],
                        status: hash % 10 > 2 ? 'Active' : 'Completed',
                        participants: (hash % 400) + 120,
                        reward: `${(hash % 900) + 100} τ`,
                        verified: true,
                        scabench: true
                    };
                });

                setChallenges(enrichedData);
                setLoading(false);
            } catch (err) {
                console.error("Error loading challenges:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const filteredChallenges = challenges.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.project_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 h-[260px] flex flex-col justify-between relative overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                        {/* Top Metadata Skeleton */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-5 w-20 bg-zinc-800 rounded mb-1" />
                            <div className="h-4 w-16 bg-zinc-800 rounded" />
                        </div>

                        {/* Title & Info Skeleton */}
                        <div className="space-y-4 mb-auto">
                            <div>
                                <div className="h-7 w-3/4 bg-zinc-800 rounded mb-2" />
                                <div className="h-4 w-1/3 bg-zinc-800/50 rounded" />
                            </div>

                            {/* Tags Row Skeleton */}
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-zinc-800 rounded" />
                                <div className="h-5 w-20 bg-zinc-800 rounded" />
                            </div>
                        </div>

                        {/* Bottom Action Area Skeleton */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                            <div className="h-4 w-24 bg-zinc-800 rounded" />
                            <div className="h-7 w-7 bg-zinc-800 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        // Show fallback UI or retry
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border border-white/10 rounded-2xl bg-white/5">
                <Shield className="w-12 h-12 text-zinc-600" />
                <div>
                    <h3 className="text-lg font-bold text-white">Network Unavailable</h3>
                    <p className="text-zinc-500 text-sm">Could not synchronize with the security node.</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-white hover:bg-white/10">
                    Retry Connection
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen">
            {/* Header section matching reference */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/5 pb-5">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-[900] tracking-tighter text-white uppercase">
                        Challenge <span className="text-zinc-600">Directory</span>
                    </h2>
                    <p className="text-zinc-500 font-medium max-w-xl text-sm leading-normal">
                        Access the decentralized registry of security challenges. Filter by protocol, difficulty, or verified status.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative group w-full lg:min-w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by project or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    <Button variant="outline" className="h-10 w-10 p-0 border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Grid display matching reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredChallenges.map((challenge) => (
                    <motion.div
                        key={challenge._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        onClick={() => onInitializeFlow?.(challenge)}
                        className="group flex flex-col justify-between bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/30 rounded-xl p-5 transition-all duration-300 relative overflow-hidden h-[260px] cursor-pointer"
                    >
                        {/* Top Metadata */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border",
                                challenge.platform === 'sherlock' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                    challenge.platform === 'code4rena' ? "bg-zinc-100/10 text-zinc-300 border-zinc-100/20" :
                                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            )}>
                                {challenge.platform}
                            </span>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                                <Layers className="w-3 h-3" />
                                {challenge.codebases?.length || 1} Repos
                            </div>
                        </div>

                        {/* Title & Info */}
                        <div className="space-y-4 relative z-10 mb-auto">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 leading-none">
                                    {cleanName(challenge.name)}
                                </h3>
                                <div className="text-[10px] font-mono font-medium text-zinc-600 mt-1 truncate">
                                    # {challenge.project_id}
                                </div>
                            </div>

                            {/* Tags Row Removed */}
                        </div>

                        {/* Bottom Action Area */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4 relative z-10">
                            <span
                                className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
                            >
                                View Contract <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>

                            <a
                                href={challenge.codebases?.[0]?.repo_url || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                            >
                                <Code className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        {/* Background Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    </motion.div>
                ))}
            </div>

            {
                !loading && filteredChallenges.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 font-medium">No challenges found matching your criteria.</p>
                    </div>
                )
            }
        </div >
    );
}
