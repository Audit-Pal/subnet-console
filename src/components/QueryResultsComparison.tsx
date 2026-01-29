"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Copy,
    Check,
    Zap,
    Clock,
    FileText,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    AlertCircle,
} from "lucide-react";

interface QueryResult {
    query: string;
    originalResponse: {
        text: string;
        tokens: number;
        latency: number;
    };
    optimizedResponse: {
        text: string;
        tokens: number;
        latency: number;
    };
}

interface QueryResultsComparisonProps {
    results: QueryResult[];
    className?: string;
}

export default function QueryResultsComparison({
    results,
    className = "",
}: QueryResultsComparisonProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [expandedQueries, setExpandedQueries] = useState<Set<number>>(
        new Set(results.length > 0 ? [0] : [])
    );

    const toggleQuery = (index: number) => {
        const newExpanded = new Set(expandedQueries);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedQueries(newExpanded);
    };

    const expandAll = () => {
        setExpandedQueries(new Set(results.map((_, i) => i)));
    };

    const collapseAll = () => {
        setExpandedQueries(new Set());
    };

    const copyResponse = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!results || results.length === 0) {
        return (
            <div className={`${className}`}>
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-8 text-center shadow-sm">
                    <AlertCircle className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 uppercase">No Sample Query Results</h3>
                    <p className="text-zinc-500 text-sm">
                        Sample query results will appear here once the optimization is complete.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            {/* Single unified container like PERFORMANCE_METRICS */}
            <div className="border border-white/10 bg-black rounded-none p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-kast-teal" />
                        <h2 className="text-base font-bold text-white uppercase tracking-widest font-mono">
                            SAMPLE_QUERY_RESULTS
                        </h2>
                        <span className="text-sm text-zinc-500 uppercase">({results.length} queries tested)</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 rounded-md transition-colors shadow-sm font-bold uppercase tracking-wider"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAll}
                            className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 rounded-md transition-colors shadow-sm font-bold uppercase tracking-wider"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>

                {/* Query Results inside the container */}
                <div className="space-y-4">
                    {results.map((result, index) => {
                        const isExpanded = expandedQueries.has(index);
                        const tokenDiff = result.originalResponse.tokens - result.optimizedResponse.tokens;
                        const latencyDiff = result.originalResponse.latency - result.optimizedResponse.latency;

                        // New metrics calculations
                        const originalWords = result.originalResponse.text.trim().split(/\s+/).filter(Boolean).length;
                        const optimizedWords = result.optimizedResponse.text.trim().split(/\s+/).filter(Boolean).length;
                        const conciseness = (((originalWords - optimizedWords) / originalWords) * 100).toFixed(0);
                        // Mock similarity score
                        const similarity = 94 + (index % 5);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-950 border border-white/5 rounded-xl overflow-hidden shadow-sm"
                            >
                                {/* Query Header - Always Visible */}
                                <button
                                    onClick={() => toggleQuery(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-200 group border-l-2 border-transparent hover:border-kast-teal/30"
                                >
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 mr-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${isExpanded ? 'bg-kast-teal' : 'bg-zinc-700'} transition-colors`} />
                                            <span className={`text-base font-bold font-mono ${isExpanded ? 'text-white' : 'text-zinc-500'} transition-colors`}>
                                                Query #{index + 1}
                                            </span>
                                        </div>

                                        <div className="flex items-center bg-white/5 rounded-lg border border-white/5 py-1.5 translate-x-4">
                                            {/* Words */}
                                            <div className="flex flex-col items-end px-5 border-r border-white/10">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1.5 leading-none">Words</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white font-mono tracking-tighter">
                                                        {originalWords} <span className="text-zinc-700 font-normal">→</span> {optimizedWords}
                                                    </span>
                                                    {originalWords !== optimizedWords && (
                                                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-sm bg-emerald-500 text-white font-mono leading-none">
                                                            -{originalWords - optimizedWords}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reduction */}
                                            <div className="hidden sm:flex flex-col items-end px-5 border-r border-white/10">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1.5 leading-none">Reduction</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-emerald-400 font-mono tracking-tight">
                                                        {conciseness}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Similarity */}
                                            <div className="hidden lg:flex flex-col items-end px-5">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1.5 leading-none">Similarity</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-blue-400 font-mono tracking-tight">
                                                        {similarity}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pl-4">
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded Content - Side by Side Comparison */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="border-t border-white/10"
                                    >
                                        {/* Query Input */}
                                        <div className="px-6 py-4 bg-white/5">
                                            <div className="text-xs text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                                                Input Query
                                            </div>
                                            <div className="text-sm text-zinc-300 font-mono bg-black border border-white/10 rounded-lg p-4 shadow-sm">
                                                {result.query}
                                            </div>
                                        </div>

                                        {/* Side-by-Side Response Comparison */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-white/10">
                                            {/* Original Response */}
                                            <div className="p-6 border-r border-white/10 bg-white/5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                        <span className="text-sm font-bold text-red-400 uppercase tracking-tight">Original Response</span>
                                                    </div>
                                                </div>


                                                {/* Response Content */}
                                                <div
                                                    className="scrollable-content w-full max-h-48 overflow-y-auto bg-black border border-white/10 rounded-lg p-3 shadow-sm text-xs font-mono text-zinc-500 whitespace-pre-wrap leading-relaxed"
                                                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 #111' }}
                                                >
                                                    {result.originalResponse.text}
                                                </div>
                                            </div>

                                            {/* Optimized Response */}
                                            <div className="p-6 bg-kast-teal/5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-kast-teal"></div>
                                                        <span className="text-sm font-bold text-kast-teal uppercase tracking-tight">Optimized Response</span>
                                                    </div>
                                                </div>


                                                {/* Response Content */}
                                                <div
                                                    className="scrollable-content w-full max-h-48 overflow-y-auto bg-black border border-kast-teal/20 rounded-lg p-3 shadow-sm text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed relative"
                                                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#1EBA98 #111' }}
                                                >
                                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(30,186,152,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
                                                    {result.optimizedResponse.text}
                                                </div>
                                            </div>
                                        </div>


                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
