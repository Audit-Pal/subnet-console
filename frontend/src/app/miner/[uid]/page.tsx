"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, Code, Activity, TrendingUp, Copy, Shield, Cpu, Network, Users, ExternalLink, Terminal, ChevronRight, Zap, Target, Bug, AlertOctagon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/tech-badge";
import { DataModule } from "@/components/ui/data-module";
import EarnedHistoryChart from "@/components/EarnedHistoryChart";
import ValidatorSpread from "@/components/ValidatorSpread";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// Challenge interface matching the API
interface Challenge {
    _id: string;
    project_id: string;
    name: string;
    platform: 'code4rena' | 'cantina' | 'sherlock';
    codebases: {
        codebase_id: string;
        repo_url: string;
        commit: string;
    }[];
}

// Vulnerability feed item for display
interface VulnerabilityItem {
    id: string;
    type: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    target: string;
    time: string;
    status: string;
    bounty: string;
    platform: string;
    repoUrl?: string;
}

// Vulnerability types to randomly assign
const vulnerabilityTypes = [
    "Reentrancy", "Access Control", "Integer Overflow", "Flash Loan Attack",
    "Oracle Manipulation", "Frontrunning", "Signature Replay", "Price Manipulation",
    "Logic Error", "Sandwich Attack", "Delegate Call Injection", "Storage Collision",
    "Cross-Chain Exploit", "Governance Attack", "Token Approval Exploit", "Precision Loss",
    "Uninitialized Proxy", "MEV Extraction", "Rounding Error", "Slippage Attack",
    "Gas Griefing", "Vault Share Inflation", "Callback Reentrancy", "Missing Validation"
];

// Helper to clean challenge names
const cleanName = (name: string): string => {
    let cleaned = name.replace(/^\d{4}\.\d{2}\.\d{2}\s*-\s*Final\s*-\s*/i, '');
    cleaned = cleaned.replace(/^Final\s*-\s*/i, '');
    cleaned = cleaned.replace(/\s*Audit Report$/i, '');
    return cleaned.trim();
};

// Mock agent source code
const agentSourceCode = `from __future__ import annotations
import json
import os
import requests
import subprocess
import sys
import textwrap
import time
import traceback
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import uuid4
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import csv
import logging
from enum import Enum
import re
import inspect
import random
from uuid import uuid4
import difflib
import tempfile

DEFAULT_PROXY_URL = os.getenv("SANDBOX_PROXY_URL", "http://sandbox_proxy")
DEFAULT_PROXY = int(os.getenv("AGENT_TIMEOUT", "1340"))

PROBLEM_TYPE_CREATE = "CREATE"
PROBLEM_TYPE_FIX = "FIX"

run_id = None
agent_start_time = None

# Agent optimization logic
def agent_sync(data):
    # processing agent telemetry
    patterns = decode(data)
    return optimize(patterns)`;

export default function MinerDetailPage() {
    const params = useParams();
    const uid = params.uid as string;

    // State for vulnerability feed from API
    const [vulnerabilityFeed, setVulnerabilityFeed] = useState<VulnerabilityItem[]>([]);
    const [feedLoading, setFeedLoading] = useState(true);

    // Fetch challenges from API and transform to vulnerability feed
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const apiUrl = 'https://audit-api-two.vercel.app';
                const res = await fetch(`${apiUrl}/api/challenges`);

                if (!res.ok) throw new Error('Failed to fetch');

                const data: Challenge[] = await res.json();

                // Transform challenges to vulnerability feed items
                const severities: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
                const timeAgo = ['2h ago', '5h ago', '12h ago', '1d ago', '2d ago', '3d ago', '4d ago', '5d ago', '6d ago', '7d ago', '8d ago', '9d ago', '10d ago'];

                const feedItems: VulnerabilityItem[] = data.map((challenge, index) => ({
                    id: challenge._id,
                    type: vulnerabilityTypes[index % vulnerabilityTypes.length],
                    severity: severities[index % severities.length],
                    target: cleanName(challenge.name),
                    time: timeAgo[index % timeAgo.length],
                    status: 'verified',
                    bounty: `${(Math.random() * 40 + 1).toFixed(1)} τ`,
                    platform: challenge.platform,
                    repoUrl: challenge.codebases?.[0]?.repo_url
                }));

                setVulnerabilityFeed(feedItems);
                setFeedLoading(false);
            } catch (err) {
                console.error('Error loading challenges:', err);
                setFeedLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    // Mock miner data
    const minerData = {
        name: uid.split('-')[0].toUpperCase() || "LLM",
        version: uid.split('-')[1] || "v6",
        score: 74.4,
        status: "Running",
        hotkey: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        uid: "175",
        rank: 12,
        projectedApr: "18.2%",
        falsePositiveRate: "0.2%",
        recall: "99.8%",
        totalMiners: 256,
        rewards: 1247.83,
        rewardsCurrency: "τ",
        registeredAt: "2024-09-15 14:32",
        age: "82 days",
        uptime: "15d 8h 42m",
        uptimePercent: 99.2,
        winRate: 82.7,
        totalWins: 847,
        totalAttempts: 1024,
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24 font-sans selection:bg-kast-teal selection:text-black">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Navigation and Title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-4">
                        <Link href="/explore" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-kast-teal transition-colors uppercase tracking-widest">
                            <ArrowLeft className="w-3 h-3" /> Back to Network
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                                    {minerData.name}
                                </h1>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-kast-teal">
                                    {minerData.version}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 mt-2 text-xs font-mono text-zinc-400">
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE</span>
                                <span className="flex items-center gap-2"><Network className="w-3 h-3" /> UID: {minerData.uid}</span>
                                <span className="flex items-center gap-2 truncate max-w-[200px] hover:text-white cursor-pointer" title={minerData.hotkey} onClick={() => navigator.clipboard.writeText(minerData.hotkey)}><Copy className="w-3 h-3" /> {minerData.hotkey}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg min-w-[120px]">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Earned</p>
                            <p className="text-2xl font-black text-white font-mono">{minerData.rewards} {minerData.rewardsCurrency}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg min-w-[120px]">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Rank</p>
                            <p className="text-2xl font-black text-kast-teal font-mono">#{minerData.rank}</p>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Charts */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-kast-teal/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-zinc-400"><AlertOctagon className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Accuracy</span></div>
                                <p className="text-2xl font-mono font-bold text-white">99.8%</p>
                                <p className="text-[10px] text-zinc-500 mt-1">Almost no false alarms</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-kast-teal/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-zinc-400"><Target className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Bugs Found</span></div>
                                <p className="text-2xl font-mono font-bold text-white">1,022</p>
                                <p className="text-[10px] text-zinc-500 mt-1">Verified vulnerabilities</p>
                            </div>
                        </div>

                        {/* Interactive Charts */}
                        <EarnedHistoryChart />
                        <ValidatorSpread />
                    </div>

                    {/* Right Column: Source Code */}
                    <div className="lg:col-span-2 h-full min-h-[500px]">
                        <DataModule
                            title="SOURCE_CODE"
                            icon={<Code className="w-4 h-4" />}
                            className="h-full bg-black/60 border border-white/10 overflow-hidden flex flex-col"
                            action={
                                <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-wider">
                                    <Copy className="w-3 h-3" /> Copy
                                </button>
                            }
                        >
                            <div className="relative flex-1 bg-[#09090b] border-t border-white/5 -m-4 mt-0 overflow-hidden">
                                {/* Blurred Background Editor */}
                                <div className="absolute inset-0 z-0 opacity-40 blur-[4px] pointer-events-none select-none">
                                    <MonacoEditor
                                        height="100%"
                                        defaultLanguage="python"
                                        theme="vs-dark"
                                        value={agentSourceCode}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 11,
                                            fontFamily: "JetBrains Mono, monospace",
                                            lineNumbers: "off",
                                            folding: false,
                                            scrollBeyondLastLine: false,
                                            renderLineHighlight: "none"
                                        }}
                                    />
                                </div>

                                {/* Central Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-xl shadow-[0_0_40px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center mb-6 border border-white/10">
                                        <Code className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight">
                                        Audit Engine
                                    </h3>

                                    <p className="text-sm text-zinc-400 mb-8 leading-relaxed max-w-sm mx-auto">
                                        View the AI logic that powers this miner&apos;s vulnerability detection. See how it scans smart contracts and identifies security flaws.
                                    </p>

                                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black border border-white/10 shadow-xl">
                                        <div className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                            In Development
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DataModule>
                    </div>

                </div>

                {/* Live Vulnerability Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Bug className="w-4 h-4 text-kast-teal" /> Live Vulnerability Feed
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-zinc-400 font-mono uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Streaming
                            </span>
                        </div>
                    </div>

                    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
                        {/* Fixed Header */}
                        <table className="w-full text-left text-sm font-mono">
                            <thead className="text-[10px] uppercase bg-white/5 text-zinc-500 font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 w-[100px]">Platform</th>
                                    <th className="px-6 py-3 w-[100px]">Severity</th>
                                    <th className="px-6 py-3 w-[180px]">Vulnerability Type</th>
                                    <th className="px-6 py-3 w-[200px]">Target Project</th>
                                    <th className="px-6 py-3 text-right w-[80px]">Bounty</th>
                                    <th className="px-6 py-3 text-right w-[100px]">Time Detected</th>
                                    <th className="px-6 py-3 text-right w-[80px]">Proof</th>
                                </tr>
                            </thead>
                        </table>
                        {/* Scrollable Body - shows ~5 rows */}
                        <div
                            className="max-h-[260px] overflow-y-auto overflow-x-hidden custom-scrollbar"
                        >
                            {feedLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-kast-teal" />
                                    <span className="ml-3 text-sm text-zinc-500">Loading challenges...</span>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm font-mono">
                                    <tbody className="divide-y divide-white/5 text-zinc-400">
                                        {vulnerabilityFeed.map((vuln) => (
                                            <tr key={vuln.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-3 w-[100px]">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${vuln.platform === 'sherlock' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                                                        vuln.platform === 'cantina' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                            'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                                                        }`}>
                                                        {vuln.platform}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 w-[100px]">
                                                    {vuln.severity === 'CRITICAL' ? (
                                                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] font-bold">CRITICAL</span>
                                                    ) : vuln.severity === 'HIGH' ? (
                                                        <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-500 border border-orange-500/30 text-[10px] font-bold">HIGH</span>
                                                    ) : vuln.severity === 'MEDIUM' ? (
                                                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-[10px] font-bold">MEDIUM</span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-500 border border-blue-500/30 text-[10px] font-bold">LOW</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 w-[180px] text-white font-bold group-hover:text-kast-teal transition-colors">
                                                    {vuln.type}
                                                </td>
                                                <td className="px-6 py-3 w-[200px] text-zinc-300 truncate max-w-[200px]" title={vuln.target}>{vuln.target}</td>
                                                <td className="px-6 py-3 text-right w-[80px] text-emerald-400 font-bold">{vuln.bounty}</td>
                                                <td className="px-6 py-3 text-right w-[100px] text-zinc-500">{vuln.time}</td>
                                                <td className="px-6 py-3 text-right w-[80px]">
                                                    <button className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white border border-white/10 hover:border-white px-2 py-1 rounded transition-colors">
                                                        View PoC
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
