"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Users, Zap, Search, Globe, Server, Database, Lock, Cpu, Radio, Brain, Trophy, Target, CheckCircle, Code, Layers, Scale } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

import { DataModule } from "@/components/ui/data-module";
import { TechBadge } from "@/components/ui/tech-badge";
import { Button } from "@/components/ui/button";

// Mock Data - AuditPal Network State
const networkStats = [
    { label: "Active Validators", value: "7", icon: Shield, color: "text-kast-teal" },
    { label: "Active Miners", value: "20", icon: Users, color: "text-purple-400" },
    { label: "Daily Audits", value: "400", icon: Activity, color: "text-blue-400" },
    { label: "Avg. Accuracy", value: "96.5%", icon: CheckCircle, color: "text-yellow-400" },
];

const trafficData = [
    { time: "00:00", audits: 2150, load: 1200 },
    { time: "04:00", audits: 1840, load: 1650 },
    { time: "08:00", audits: 1690, load: 2200 },
    { time: "12:00", audits: 3250, load: 2500 },
    { time: "16:00", audits: 2520, load: 3100 },
    { time: "20:00", audits: 3840, load: 2900 },
    { time: "23:59", audits: 3120, load: 3800 },
];

const validators = [
    { rank: 1, name: "Opentensor FD", stake: "2.1M", trust: "98.4%", status: "online" },
    { rank: 2, name: "TaoStats", stake: "1.8M", trust: "96.2%", status: "online" },
    { rank: 3, name: "Roundtable21", stake: "950k", trust: "94.1%", status: "online" },
    { rank: 4, name: "Foundry", stake: "820k", trust: "91.8%", status: "online" },
    { rank: 5, name: "Datura", stake: "640k", trust: "88.5%", status: "offline" },
    { rank: 6, name: "Rizzo Labs", stake: "580k", trust: "87.2%", status: "online" },
    { rank: 7, name: "Manifold", stake: "520k", trust: "86.1%", status: "online" },
    { rank: 8, name: "RaoDAO", stake: "480k", trust: "85.4%", status: "online" },
    { rank: 9, name: "Subnet21", stake: "450k", trust: "84.8%", status: "online" },
    { rank: 10, name: "TensorNode", stake: "420k", trust: "83.9%", status: "offline" },
];

// Enhanced Mock Data with Categories (Control Groups)
const agents = [
    { rank: 1, name: "AccessAI", uid: "access-v4", version: "v1.8.5", wins: 842, attempts: 1000, winRate: 84.2, category: "SCSVS-ARCH", earnings: "4,240 τ" },
    { rank: 2, name: "CodeSentry", uid: "sentry-v12", version: "v2.1.0", wins: 756, attempts: 980, winRate: 77.1, category: "SCSVS-CODE", earnings: "3,850 τ" },
    { rank: 3, name: "GovGuard", uid: "gov-v3", version: "v3.0.1", wins: 620, attempts: 900, winRate: 68.9, category: "SCSVS-GOV", earnings: "2,920 τ" },
    { rank: 4, name: "AuthShield", uid: "auth-v1", version: "v1.0.2", wins: 590, attempts: 860, winRate: 68.6, category: "SCSVS-AUTH", earnings: "2,300 τ" },
    { rank: 5, name: "CommLink", uid: "comm-v2", version: "v2.1.5", wins: 550, attempts: 820, winRate: 67.0, category: "SCSVS-COMM", earnings: "1,950 τ" },
    { rank: 6, name: "CryptoSafe", uid: "crypto-v9", version: "v0.9.8", wins: 480, attempts: 800, winRate: 60.0, category: "SCSVS-CRYPTO", earnings: "1,600 τ" },
    { rank: 7, name: "EconWatch", uid: "econ-v8", version: "v1.2.0", wins: 450, attempts: 780, winRate: 57.7, category: "SCSVS-GOV", earnings: "1,100 τ" },
    { rank: 8, name: "VulnHunter", uid: "hunter-v1", version: "v0.9.5", wins: 410, attempts: 800, winRate: 51.2, category: "SCSVS-CODE", earnings: "1,540 τ" },
    { rank: 9, name: "ArchMaster", uid: "arch-v2", version: "v2.0.0", wins: 390, attempts: 750, winRate: 52.0, category: "SCSVS-ARCH", earnings: "1,420 τ" },
    { rank: 10, name: "Tokenomics", uid: "token-v5", version: "v1.5.2", wins: 380, attempts: 740, winRate: 51.3, category: "SCSVS-GOV", earnings: "1,350 τ" },
    { rank: 11, name: "RoleCheck", uid: "role-v2", version: "v2.0.1", wins: 340, attempts: 680, winRate: 50.0, category: "SCSVS-AUTH", earnings: "980 τ" },
    { rank: 12, name: "CrossChain", uid: "cross-v1", version: "v1.1.0", wins: 310, attempts: 650, winRate: 47.7, category: "SCSVS-COMM", earnings: "850 τ" },
    { rank: 13, name: "HashScan", uid: "hash-v4", version: "v4.2.0", wins: 290, attempts: 600, winRate: 48.3, category: "SCSVS-CRYPTO", earnings: "720 τ" },
    { rank: 14, name: "PatternFix", uid: "pat-v3", version: "v3.0.0", wins: 270, attempts: 580, winRate: 46.5, category: "SCSVS-ARCH", earnings: "640 τ" },
    { rank: 15, name: "LinterBot", uid: "lint-v7", version: "v7.5.1", wins: 250, attempts: 550, winRate: 45.4, category: "SCSVS-CODE", earnings: "580 τ" },
];

const categories = [
    { id: "all", label: "All Agents", icon: Users },
    { id: "SCSVS-ARCH", label: "Architecture", icon: Layers, description: "Architecture & Design", reward: "2400 TAO" },
    { id: "SCSVS-CODE", label: "Code Security", icon: Code, description: "Secure Development Lifecycle", reward: "2000 TAO" },
    { id: "SCSVS-GOV", label: "Governance", icon: Scale, description: "Governance & Economics", reward: "2200 TAO" },
    { id: "SCSVS-AUTH", label: "Auth & Access", icon: Lock, description: "Authentication & Access", reward: "2600 TAO" },
    { id: "SCSVS-COMM", label: "Communication", icon: Radio, description: "Contract Communication", reward: "1800 TAO" },
    { id: "SCSVS-CRYPTO", label: "Cryptography", icon: Shield, description: "Cryptography", reward: "1600 TAO" },
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12 pt-24 font-sans selection:bg-kast-teal selection:text-black">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/10 pb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                            <span className="text-kast-teal">Network</span> Status
                        </h1>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 w-full md:w-auto"
                    >
                        <div className="relative group w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-kast-teal transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="SEARCH UID / ADDRESS..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white focus:outline-none focus:border-kast-teal transition-all w-full placeholder:text-zinc-600 uppercase"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {networkStats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <DataModule className="h-full group hover:border-kast-teal/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                        <h3 className="text-4xl font-black tracking-tight text-white mb-2 font-mono">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-full bg-white/5 ${stat.color} bg-opacity-10 opacity-80 group-hover:opacity-100 transition-opacity`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "70%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                                    />
                                </div>
                            </DataModule>
                        </motion.div>
                    ))}
                </div>

                {/* Main Dashboard Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Network Traffic */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <DataModule title="Global Audit Throughput" icon={<Globe className="w-4 h-4" />} className="h-[400px]">
                            <div className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trafficData}>
                                        <defs>
                                            <linearGradient id="colorAudits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1EBA98" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#1EBA98" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#000',
                                                borderColor: '#333',
                                                color: '#fff',
                                                fontSize: '12px',
                                                fontFamily: 'monospace'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="audits"
                                            stroke="#1EBA98"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorAudits)"
                                            name="Throughput"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="load"
                                            stroke="#818CF8"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorLoad)"
                                            name="Network Load"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </DataModule>
                    </motion.div>

                    {/* Right Column: Active Validators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <DataModule title="Top Validators" icon={<Server className="w-4 h-4" />} className="h-[400px] overflow-hidden">
                            <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar h-full">
                                {validators.map((val, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-kast-teal/30 hover:bg-white/10 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-500 font-mono text-xs">0{val.rank}</span>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-kast-teal transition-colors">{val.name}</p>
                                                <p className="text-[10px] text-zinc-400 font-mono">{val.stake}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-kast-teal font-mono">{val.trust}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${val.status === 'online' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500'}`} />
                                                <span className="text-[9px] uppercase text-zinc-500">{val.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DataModule>
                    </motion.div>

                </div>

                {/* Agents / Miners Directory with Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Top Agents
                        </h2>
                    </div>

                    <DataModule>
                        <div>
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="text-xs uppercase bg-black/80 backdrop-blur-md text-zinc-300 font-bold tracking-wider sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-lg">#</th>
                                        <th className="px-6 py-4">Agent</th>
                                        <th className="px-6 py-4">Benchmark</th>
                                        <th className="px-6 py-4">Miner UID</th>
                                        <th className="px-6 py-4">Agent Version</th>
                                        <th className="px-6 py-4 text-right">Wins</th>
                                        <th className="px-6 py-4 text-right">Earned</th>
                                        <th className="px-6 py-4 text-right rounded-tr-lg">Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {agents
                                        .filter(agent => agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.uid.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .slice(0, 10)
                                        .map((agent, i) => (
                                            <tr
                                                key={i}
                                                className="hover:bg-white/5 transition-colors group cursor-pointer"
                                                onClick={() => window.location.href = `/miner/${agent.uid}`}
                                            >
                                                <td className="px-6 py-4 font-mono text-kast-teal font-bold">{agent.rank}</td>
                                                <td className="px-6 py-4 font-bold text-white group-hover:text-kast-teal transition-colors">
                                                    {agent.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 text-zinc-400 border-white/10">
                                                        <Trophy className="w-3 h-3 text-zinc-600" />
                                                        auditpal-solbench-30
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-zinc-500">{agent.uid}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">{agent.version}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-kast-teal font-bold">{agent.wins}</td>
                                                <td className="px-6 py-4 text-right font-mono text-emerald-400">{agent.earnings}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{ width: `${agent.winRate}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-kast-teal font-mono">{agent.winRate}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </DataModule>
                </motion.div>

            </div>
        </div>
    );
}
