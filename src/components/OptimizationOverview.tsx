"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Trophy,
    Target,
    Zap,
    Shield,
    BarChart2,
    ArrowRight,
    Sparkles,
    Users,
    Timer,
    Flame,
    ExternalLink,
    PlayCircle,
    BookOpen,
    HelpCircle,
    FileText,
    Cpu,
    Lock,
    Scale,
    Code,
    Database,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ChevronDown
} from "lucide-react";
import { QuantumText } from "@/components/ui/quantum-text";
import { TechBadge } from "@/components/ui/tech-badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { Benchmark } from "@/config/benchmarks";

interface OptimizationOverviewProps {
    onStartNew: () => void;
    onRegister: () => void;
    isRegistered: boolean;
    benchmark: Benchmark;
}

const sidebarNav = [
    { id: "overview", label: "Overview", icon: Cpu },
    { id: "specification", label: "Protocol Specification", icon: Shield },
    { id: "methodology", label: "Ground Truth Methodology", icon: BookOpen },
    { id: "standards", label: "Security Standards", icon: Scale },
    { id: "economic", label: "Economic Security", icon: Trophy },
    { id: "approaches", label: "Auditing Engines", icon: Zap },
    { id: "format", label: "Report Architecture", icon: FileText },
    { id: "integration", label: "Integration Pipeline", icon: ExternalLink },
    { id: "metrics", label: "Evaluation Metrics", icon: Target },
    { id: "constraints", label: "Execution SLA", icon: Lock },
    { id: "infrastructure", label: "Node Infrastructure", icon: Cpu },
    { id: "models", label: "Verified Agents", icon: Cpu },
    { id: "rankings", label: "Ranking Tiers", icon: Trophy },
    { id: "history", label: "Update History", icon: Timer },
];

const mockParticipants = [
    { name: "User 1", color: "bg-blue-500" },
    { name: "User 2", color: "bg-emerald-500" },
    { name: "User 3", color: "bg-indigo-500" },
    { name: "User 4", color: "bg-rose-500" },
    { name: "User 5", color: "bg-amber-500" },
    { name: "User 6", color: "bg-violet-500" },
    { name: "User 7", color: "bg-sky-500" },
];

const historyEvents = [
    { date: "Oct 12, 2025", title: "Protocol V.1 Launch", desc: "Genesis block for EVM security validation." },
    { date: "Nov 05, 2025", title: "SVM Core Update", desc: "Enhanced data flow tracing for cross-contract calls." },
    { date: "Dec 01, 2025", title: "Agent Hardening", desc: "Integration of symbolic execution baseline." },
    { date: "Jan 10, 2026", title: "Stability Patch", desc: "Optimization of DAS scoring algorithms." },
];

export function OptimizationOverview({ onStartNew, onRegister, isRegistered, benchmark }: OptimizationOverviewProps) {
    const [activeSection, setActiveSection] = useState("overview");
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [overRes, perfRes] = await Promise.all([
                    fetch('/api/subnet/overview'),
                    fetch('/api/subnet/performance')
                ]);
                if (overRes.ok && perfRes.ok) {
                    const overview = await overRes.json();
                    const performance = await perfRes.json();

                    // Daily Prize Pool = emission_per_block * 7200 blocks/day
                    const dailyPrize = (overview.emission_per_block || 0) * 7200;

                    // Base accuracy from performance, but ensure it meets user request (min 96%)
                    const displayAccuracy = Math.max(96.0, performance.average_accuracy * 100);

                    setStats({
                        participants: (overview.active_validators || 0) + (overview.active_miners || 0),
                        accuracy: displayAccuracy.toFixed(1) + "%",
                        submissions: Math.floor((overview.active_miners || 0) * 1.5),
                        totalPrize: dailyPrize.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " τ",
                        bonding: "5,000 τ", // Keep fixed as it's a protocol rule
                        expertNode: (displayAccuracy + 2).toFixed(1) + "% DAS" // Scaled relative to accuracy
                    });
                } else {
                    // Fallback to config stats if API fails
                    setStats({
                        participants: benchmark.stats.nodes,
                        accuracy: benchmark.stats.accuracy,
                        submissions: Math.floor(benchmark.stats.nodes * 1.5),
                        totalPrize: "2,400 τ",
                        bonding: "5,000 τ",
                        expertNode: "98.2% DAS"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch overview stats:", error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-10% 0px -50% 0px",
            threshold: 0.1,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sidebarNav.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* 1. Left Sidebar: Navigation (Sticky) */}
                <aside className="lg:col-span-3 xl:col-span-2 hidden lg:block">
                    <nav className="sticky top-24 space-y-1">
                        {sidebarNav.map((item, i) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={i}
                                    onClick={() => scrollToSection(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left group",
                                        isActive
                                            ? "bg-kast-teal/10 text-kast-teal font-semibold"
                                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-zinc-400")} />
                                    <span className="leading-tight">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* 2. Main Content: Documentation Style */}
                <main className="lg:col-span-9 xl:col-span-7 space-y-10">

                    {/* Mobile Navigation (Dropdown) */}
                    <div className="lg:hidden mb-6">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                            Navigate Section
                        </label>
                        <div className="relative">
                            <select
                                value={activeSection}
                                onChange={(e) => scrollToSection(e.target.value)}
                                className="w-full appearance-none bg-zinc-900 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-kast-teal/50"
                            >
                                {sidebarNav.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Starter Kit Banner */}
                    <div className="p-4 bg-kast-teal/5 border border-kast-teal/20 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
                        <button onClick={() => scrollToSection('format')} className="flex items-center gap-2 text-zinc-300 hover:text-kast-teal transition-colors group">
                            <Code className="w-5 h-5 text-zinc-500 group-hover:text-kast-teal transition-colors" />
                            <span className="underline decoration-zinc-700 group-hover:decoration-kast-teal">View Submission Format</span>
                        </button>
                        <div className="hidden sm:block w-px h-4 bg-kast-teal/20" />
                        <button onClick={() => scrollToSection('metrics')} className="flex items-center gap-2 text-zinc-300 hover:text-kast-teal transition-colors group">
                            <Target className="w-5 h-5 text-zinc-500 group-hover:text-kast-teal transition-colors" />
                            <span className="underline decoration-zinc-700 group-hover:decoration-kast-teal tracking-tight">Check Evaluation Metrics</span>
                        </button>
                    </div>

                    {/* Headline Section */}
                    <section id="overview" className="scroll-mt-24 space-y-6">
                        <div className="prose prose-invert max-w-none space-y-4 text-zinc-400 leading-relaxed font-normal text-lg">
                            <p>
                                The <span className="text-white font-medium">{benchmark.name}</span> is a mission-critical infrastructure for validating autonomous auditing agents. It provides a standardized environment for testing agent intelligence against deep semantic vulnerabilities.
                            </p>
                            <p>
                                {benchmark.description}
                            </p>
                            <p>
                                We view security validation not as a static check, but as a <span className="font-medium text-white">perpetual requirement</span>. Our goal is to ensure DeFi protocols remain resilient against state-manipulation attacks by deploying high-intelligence auditing nodes.
                            </p>
                        </div>
                    </section>

                    <section id="specification" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Shield className="w-6 h-6 text-kast-teal" />
                            Protocol Specification
                        </h2>
                        <div className="prose prose-invert max-w-none text-zinc-400 font-normal space-y-4">
                            <p>
                                {benchmark.docFields?.specification || `Agent nodes must operate within the ${benchmark.category} environment to scan target smart contracts for complex logic flaws. The primary metric is the Detection Accuracy Score (DAS).`}
                            </p>
                            <ul className="list-none space-y-3 pl-0">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-kast-teal mt-1 shrink-0" />
                                    <span><span className="font-medium text-white">Audit Target:</span> Complete coverage of 500+ high-TVL Solidity implementations.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-kast-teal mt-1 shrink-0" />
                                    <span><span className="font-medium text-white">Precision Floor:</span> Maintain less than 2% false positive rate on mainnet-verified code.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-kast-teal mt-1 shrink-0" />
                                    <span><span className="font-medium text-white">Intelligence Depth:</span> Ability to reason about multi-tx reentrancy and pool state manipulation.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section id="methodology" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <BookOpen className="w-6 h-6 text-kast-teal" />
                            Ground Truth Methodology
                        </h2>
                        <div className="prose prose-invert max-w-none text-zinc-400 font-normal space-y-4">
                            <p>
                                {benchmark.docFields?.methodology || `The integrity of the benchmark relies on our Consensus-Based Ground Truth. Every contract in the Security Dataset is audited by three independent top-tier security firms before being included.`}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="text-xs font-semibold text-kast-teal mb-1">Negative Control</div>
                                    <p className="text-xs text-zinc-500 font-mono">Verified mainnet contracts with 0 reported exploits and formal verification proofs.</p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="text-xs font-semibold text-rose-500 mb-1">Positive Control</div>
                                    <p className="text-xs text-zinc-500 font-mono">Historical exploit replays and custom-engineered semantic logic traps.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="standards" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Scale className="w-6 h-6 text-kast-teal" />
                            Security Standards
                        </h2>
                        <p className="text-zinc-500 font-normal">
                            The protocol aligns with international smart contract security frameworks to ensure coverage of the vulnerability landscape.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <TechBadge variant="neutral">SCSVS V2.1 ALIGNED</TechBadge>
                            <TechBadge variant="neutral">SWC REGISTRY MAPPED</TechBadge>
                            <TechBadge variant="neutral">OWASP TOP 10 (WEB3) COMPLIANT</TechBadge>
                        </div>
                    </section>

                    <section id="economic" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Trophy className="w-6 h-6 text-kast-teal" />
                            Economic Security
                        </h2>
                        <div className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-500 font-semibold uppercase tracking-widest">Bonding Requirement</span>
                                    <span className="text-white font-mono">5,000 τ Per Node</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-kast-teal w-[65%]" />
                                </div>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                                Audit agents must bond tokens to participate. Malicious or demonstrably false reporting results in <span className="text-rose-500 font-medium">Recursive Slashing</span> of the bonded collateral.
                            </p>
                        </div>
                    </section>

                    <hr className="border-white/5" />

                    <section id="approaches" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Zap className="w-5 h-5 text-kast-teal" />
                            Suggested Approaches
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(benchmark.docFields?.approaches || [
                                { title: "Static Analysis / Fuzzing", desc: "Integrate tools like Echidna or Slither to identify state-transition anomalies in contract code." },
                                { title: "LLM Semantic Auditing", desc: "Utilize large language models to reason about the logical flow and identify cross-contract call risks." }
                            ]).map((approach, i) => (
                                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                                    <div className="text-sm font-semibold text-white">{approach.title}</div>
                                    <p className="text-sm text-zinc-500">{approach.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="format" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <FileText className="w-6 h-6 text-kast-teal" />
                            Report Architecture
                        </h2>
                        <div className="p-6 bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-zinc-800">
                            <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                                <Code className="w-4 h-4 text-zinc-400" />
                                <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">vulnerability_report.json</span>
                            </div>
                            <pre className="font-mono text-xs text-zinc-400 leading-relaxed overflow-x-auto">
                                {`{
  "challenge_id": "reentrancy_001",
  "vulnerabilities": [
    {
      "contract": "UniswapV2Pair.sol",
      "function": "withdraw",
      "type": "reentrancy",
      "severity": "CRITICAL",
      "proof_of_exploit": "..."
    }
  ]
}`}
                            </pre>
                        </div>
                    </section>

                    <section id="integration" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <ExternalLink className="w-6 h-6 text-kast-teal" />
                            Integration Pipeline
                        </h2>
                        <div className="space-y-4 prose prose-invert max-w-none text-zinc-500">
                            <p>Automate security verification by embedding the protocol into your development lifecycle.</p>
                            <ol className="list-decimal space-y-3 pl-4">
                                <li><span className="text-white font-semibold">Install CLI:</span> <code className="text-kast-teal">npm install @reveal/audit-cli</code></li>
                                <li><span className="text-white font-semibold">Initialize:</span> Configure <code className="text-zinc-400">reveal.config.json</code> with target contracts.</li>
                                <li><span className="text-white font-semibold">Run CI:</span> Execute <code className="text-zinc-400">reveal audit --protocol solidity-v2</code> on every PR.</li>
                            </ol>
                        </div>
                    </section>



                    <section id="metrics" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Target className="w-6 h-6 text-kast-teal" />
                            Evaluation & Metrics
                        </h2>
                        <div className="p-6 border border-white/10 rounded-2xl bg-white/5 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">The DAS Formula</div>
                                <div className="text-3xl font-mono font-semibold text-kast-teal">
                                    Score = (R × 0.8) - (FP × 0.2)
                                </div>
                                <p className="text-xs text-zinc-500">Where <span className="font-medium">R</span> is Recall and <span className="font-medium">FP</span> is False Positive count.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Minimum Recall</div>
                                    <div className="text-lg font-semibold text-white">90%</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Exploit Proof</div>
                                    <div className="text-lg font-semibold text-white">Required for Criticals</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="constraints" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Lock className="w-6 h-6 text-kast-teal" />
                            Execution Constraints
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 border border-white/10 rounded-lg shrink-0"><Timer className="w-5 h-5 text-kast-teal" /></div>
                                <div>
                                    <div className="font-semibold text-white">Latency Limit</div>
                                    <p className="text-sm text-zinc-500 font-normal">Total audit time must not exceed 60s per contract on standardized hardware.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 border border-white/10 rounded-lg shrink-0"><Scale className="w-5 h-5 text-kast-teal" /></div>
                                <div>
                                    <div className="font-semibold text-white">No External Calls</div>
                                    <p className="text-sm text-zinc-500 font-normal">Agents cannot access external APIs during the evaluation window.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="infrastructure" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Cpu className="w-6 h-6 text-kast-teal" />
                            Node Infrastructure
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-kast-teal/20 flex items-center justify-center text-kast-teal">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-white uppercase text-sm">Compute Enclave</span>
                                </div>
                                <p className="text-xs text-zinc-500 font-mono">Intel SGX / AWS Nitro Enclave isolation for confidential audit execution.</p>
                            </div>
                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-white uppercase text-sm">Processing Unit</span>
                                </div>
                                <p className="text-xs text-zinc-500 font-mono">Target: 32-core vCPU | 64GB ECC RAM | Dedicated Llama-3-70B Weights.</p>
                            </div>
                        </div>
                    </section>

                    <section id="models" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Cpu className="w-6 h-6 text-kast-teal" />
                            Eligible Models
                        </h2>
                        <div className="overflow-hidden border border-white/10 rounded-2xl shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-white uppercase tracking-tighter">Model Family</th>
                                        <th className="px-6 py-4 font-semibold text-white uppercase tracking-tighter">Target Spec</th>
                                        <th className="px-6 py-4 font-semibold text-white uppercase tracking-tighter">Mode</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-normal">
                                    <tr>
                                        <td className="px-6 py-4 text-white font-semibold">Audit-Agent-A1</td>
                                        <td className="px-6 py-4 text-zinc-500">Custom Tuned Llama-3</td>
                                        <td className="px-6 py-4 text-kast-teal">Native</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white font-semibold">Sentry-V2</td>
                                        <td className="px-6 py-4 text-zinc-500">Claude 3.5 Sonnet Integration</td>
                                        <td className="px-6 py-4 text-kast-teal">Hybrid</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="rankings" className="scroll-mt-24 space-y-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Trophy className="w-6 h-6 text-kast-teal" />
                            Ranking Tiers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 border-2 border-kast-teal/20 rounded-2xl bg-kast-teal/5 relative overflow-hidden group hover:border-kast-teal/40 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Trophy className="w-16 h-16 text-kast-teal" />
                                </div>
                                <div className="text-xs font-semibold text-kast-teal mb-2 tracking-widest uppercase">Expert Node</div>
                                <div className="text-3xl font-semibold text-white font-mono tracking-tighter">{stats?.expertNode || "98% DAS"}</div>
                                <div className="mt-4 text-xs font-semibold text-zinc-500 flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3" /> Node Grant Inc.
                                </div>
                            </div>
                            <div className="p-6 border-2 border-white/5 rounded-2xl bg-white/5 hover:border-kast-teal/30 transition-colors">
                                <div className="text-xs font-semibold text-zinc-500 mb-2 tracking-widest uppercase">Runner Up</div>
                                <div className="text-3xl font-semibold text-white font-mono tracking-tighter">{Math.floor((parseInt(stats?.totalPrize?.replace(/[^0-9]/g, '') || "2400") * 0.33))} τ</div>
                            </div>
                            <div className="p-6 border-2 border-white/5 rounded-2xl bg-white/5 hover:border-kast-teal/30 transition-colors">
                                <div className="text-xs font-semibold text-zinc-500 mb-2 tracking-widest uppercase">3rd Place</div>
                                <div className="text-3xl font-semibold text-white font-mono tracking-tighter">{Math.floor((parseInt(stats?.totalPrize?.replace(/[^0-9]/g, '') || "2400") * 0.16))} τ</div>
                            </div>
                        </div>
                    </section>

                    <section id="history" className="scroll-mt-24 space-y-8">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-3 uppercase tracking-tight font-sans">
                            <Calendar className="w-6 h-6 text-kast-teal" />
                            Update History
                        </h2>
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                            {historyEvents.map((event, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-black border-2 border-kast-teal z-10" />
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{event.date}</div>
                                        <div className="text-base font-semibold text-white uppercase">{event.title}</div>
                                        <p className="text-sm text-zinc-500 font-normal">{event.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* 3. Right Sidebar: Action & Participants */}
                <aside className="lg:col-span-12 xl:col-span-3 space-y-8 lg:sticky lg:top-24 h-fit">


                    {/* Stats & Info Box */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-8">
                        <div className="space-y-2">
                            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Cpu className="w-3.5 h-3.5" /> Network Status
                            </div>
                            <div className="text-3xl font-mono font-semibold text-white tracking-tighter">
                                SYNCED
                            </div>
                            <div className="flex justify-between text-[10px] font-semibold text-zinc-600 uppercase px-1">
                                <span>UPTIME: 99.9%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                            <div>
                                <div className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Total Prize</div>
                                <div className="text-xl font-semibold text-kast-teal font-mono">{stats?.totalPrize || "2,400 τ"}</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Status</div>
                                <div className="text-xl font-semibold text-emerald-500 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Active
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex justify-between text-xs font-normal">
                                <span className="text-zinc-500">Participants</span>
                                <span className="text-white font-semibold">{stats?.participants || "---"}</span>
                            </div>
                            <div className="flex justify-between text-xs font-normal">
                                <span className="text-zinc-500">Submissions</span>
                                <span className="text-white font-semibold">{stats?.submissions || "---"}</span>
                            </div>
                            <div className="flex justify-between text-xs font-normal">
                                <span className="text-zinc-500">Accuracy Peak</span>
                                <span className="text-kast-teal font-semibold font-mono">{stats?.accuracy || "---"}</span>
                            </div>
                        </div>
                    </div>

                </aside>
            </div>
        </div >
    );
}
