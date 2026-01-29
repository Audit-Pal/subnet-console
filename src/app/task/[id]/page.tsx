"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Shield,
    AlertTriangle,
    CheckCircle2,
    FileCode,
    Activity,
    ChevronRight,
    Download,
    Share2,
    AlertOctagon,
    Info,
    Terminal,
    Target,
    Zap,
    ExternalLink,
    Lock,
    Maximize2,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// Mock Audit Data
const auditData = {
    id: "AUD-2026-9981",
    name: "SimpleVault.sol",
    status: "finalized",
    score: 85,
    createdAt: "Jan 10, 2026",
    model: "AuditPal Sentry",
    findings: {
        critical: 1,
        high: 2,
        medium: 1,
        low: 3,
        info: 1
    },
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        // VULNERABILITY: Low-level call usage
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        // CRITICAL: Reentrancy vulnerability
        balances[msg.sender] -= _amount;
    }
}`,
    vulnerabilities: [
        {
            id: "V-001",
            title: "Reentrancy Vulnerability",
            severity: "critical",
            line: 18,
            impact: "Complete drainage of contract funds.",
            description: "The contract performs an external call before updating the state (balance deduction).",
            recommendation: "Move the balance deduction line before the external call."
        },
        {
            id: "V-002",
            title: "Unchecked Low-Level Call",
            severity: "high",
            line: 14,
            impact: "Unexpected behavior with complex recipients.",
            description: "Using 'call' for value transfer is discouraged without reentrancy guards.",
            recommendation: "Use OpenZeppelin's Address.sendValue."
        },
        {
            id: "V-003",
            title: "Missing Event Emissions",
            severity: "low",
            line: 6,
            impact: "Reduced off-chain observability.",
            description: "Functions do not emit events for state changes.",
            recommendation: "Emit 'Deposit' and 'Withdraw' events."
        }
    ]
};

import { Audit } from "@/types/api";

const API_BASE = "http://localhost:8000/api";

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [audit, setAudit] = useState<Audit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVuln, setSelectedVuln] = useState<string | null>(null);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                // Try fetching from API
                const res = await fetch(`${API_BASE}/audit/${params.id}`);
                if (res.ok) {
                    const data = await res.json();

                    // Add default code if missing (for mock data)
                    if (!data.code) {
                        data.code = `// Smart Contract: ${data.name}\n// Retrieved from on-chain data\n\ncontract Vault {\n    // ... source code ...\n}`;
                    }

                    setAudit(data);
                    if (data.vulnerabilities?.length > 0) {
                        setSelectedVuln(data.vulnerabilities[0].id);
                    }
                } else {
                    console.error("Audit not found");
                }
            } catch (error) {
                console.error("Failed to fetch audit", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchAudit();
        }
    }, [params.id]);

    if (isLoading) return <div className="min-h-screen bg-black" />;
    if (!audit) return null;

    const currentVuln = audit.vulnerabilities.find(v => v.id === selectedVuln);

    return (
        <div className="h-screen bg-black font-sans text-zinc-400 selection:bg-kast-teal/20 selection:text-kast-teal flex flex-col overflow-hidden">

            {/* 1. Header: Sleek, integrated, sticky */}
            <header className="border-b border-white/[0.08] bg-black/80 backdrop-blur-md sticky top-0 z-50 h-16 shrink-0">
                <div className="h-full flex items-center justify-between px-6 lg:px-8 max-w-[1800px] mx-auto w-full">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            onClick={() => router.push('/benchmark')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-kast-teal" />
                                {audit.name}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                <span>{audit.id}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span className="text-emerald-500 flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5" /> Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-4 mr-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            <span>Sentry V4</span>
                            <span className="w-px h-3 bg-white/10" />
                            <span>Subnet 19</span>
                        </div>
                        <Button variant="outline" className="h-8 text-xs border-white/10 bg-transparent hover:bg-white/5 text-zinc-300">
                            <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                        </Button>
                        <Button className="h-8 text-xs bg-white text-black hover:bg-zinc-200 font-bold border border-transparent">
                            <Download className="w-3.5 h-3.5 mr-2" /> Report
                        </Button>
                    </div>
                </div>
            </header>

            {/* 2. Main Layout: Fixed Grid */}
            <main className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] min-h-0">

                    {/* LEFT PANEL: Findings & Score (Fixed width) */}
                    <div className="w-full lg:w-[420px] xl:w-[480px] flex flex-col bg-zinc-950/50 min-h-0 shrink-0">

                        {/* Score Header */}
                        <div className="p-8 border-b border-white/[0.08] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-24 bg-kast-teal/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-kast-teal/10 transition-colors duration-500" />

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Security Score</div>
                                    <div className="text-6xl font-black text-white tracking-tighter">{audit.score}</div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                                        Passed
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mt-8">
                                {[
                                    { label: 'Crit', count: audit.findings_count?.critical, color: 'text-red-500', bg: 'bg-red-500/10' },
                                    { label: 'High', count: audit.findings_count?.high, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                    { label: 'Med', count: audit.findings_count?.medium, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                    { label: 'Low', count: audit.findings_count?.low, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                ].map((item) => (
                                    <div key={item.label} className={cn("flex flex-col items-center justify-center p-2 rounded border border-white/5 bg-white/[0.02]", item.bg.replace('10', '05'))}>
                                        <span className={cn("text-lg font-bold", item.color)}>{item.count || 0}</span>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Findings List (Scrollable) */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="h-10 px-6 flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/50 shrink-0">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vulnerabilities</span>
                                <span className="text-[10px] text-zinc-600 font-mono">{audit.vulnerabilities.length} Found</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                {audit.vulnerabilities.map((vuln) => (
                                    <button
                                        key={vuln.id}
                                        onClick={() => setSelectedVuln(vuln.id)}
                                        className={cn(
                                            "w-full text-left px-6 py-5 border-b border-white/[0.04] transition-all hover:bg-white/[0.02] relative group",
                                            selectedVuln === vuln.id ? "bg-white/[0.04]" : ""
                                        )}
                                    >
                                        {selectedVuln === vuln.id && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-kast-teal" />}
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn(
                                                    "border-0 text-[9px] font-black uppercase px-1.5 py-0 rounded-sm tracking-widest",
                                                    vuln.severity === 'critical' ? "bg-red-500/10 text-red-500" :
                                                        vuln.severity === 'high' ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                                                )}>
                                                    {vuln.severity}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-600 font-mono">#{vuln.id}</span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500 font-mono">Line {vuln.line}</span>
                                        </div>
                                        <h3 className={cn(
                                            "text-sm font-bold leading-tight transition-colors",
                                            selectedVuln === vuln.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                        )}>
                                            {vuln.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[10px] text-zinc-600 font-medium">Click to view details</span>
                                            <ChevronRight className={cn(
                                                "w-3 h-3 text-zinc-600 transition-transform",
                                                selectedVuln === vuln.id ? "translate-x-1 text-kast-teal" : ""
                                            )} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Detail View & Code (Fluid width) */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] min-h-0">

                        {/* Context Header (Dynamic based on selection) */}
                        <div className="h-auto min-h-[140px] p-8 border-b border-white/[0.08] bg-zinc-900/20 shrink-0 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {currentVuln ? (
                                    <motion.div
                                        key={currentVuln.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "p-1.5 rounded-md",
                                                currentVuln.severity === 'critical' ? "bg-red-500/10 text-red-500" :
                                                    currentVuln.severity === 'high' ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                                            )}>
                                                {currentVuln.severity === 'critical' ? <AlertOctagon size={18} /> :
                                                    currentVuln.severity === 'high' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                            </div>
                                            <h2 className="text-lg font-bold text-white tracking-tight">{currentVuln.title}</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-[42px]">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Impact Analysis</span>
                                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">{currentVuln.description}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest flex items-center gap-2">
                                                    <Zap className="w-3 h-3" /> Recommended Fix
                                                </span>
                                                <p className="text-sm text-zinc-300 leading-relaxed font-medium bg-emerald-500/[0.03] border border-emerald-500/10 p-2 rounded-md">
                                                    {currentVuln.recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex items-center justify-center text-zinc-600">
                                        Select a vulnerability to view details
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Code Editor Area */}
                        <div className="flex-1 relative flex flex-col min-h-0 bg-[#0A0A0A]">
                            <div className="h-10 px-4 flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/10 shrink-0">
                                <div className="flex items-center gap-2">
                                    <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="text-xs font-mono text-zinc-400">SimpleVault.sol</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase">Read Only</span>
                                </div>
                            </div>
                            <div className="flex-1 relative w-full h-full min-h-0">
                                <div className="absolute inset-0">
                                    <MonacoEditor
                                        height="100%"
                                        language="sol"
                                        theme="vs-dark"
                                        value={audit.code || auditData.code}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: "on",
                                            fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                                            padding: { top: 24, bottom: 24 },
                                            renderLineHighlight: "all",
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            overviewRulerLanes: 0,
                                            hideCursorInOverviewRuler: true,
                                            scrollbar: {
                                                vertical: 'visible',
                                                horizontal: 'visible',
                                                verticalScrollbarSize: 10,
                                                horizontalScrollbarSize: 10
                                            }
                                        }}
                                    />
                                </div>
                                {/* Floating Line Indicator */}
                                {currentVuln && (
                                    <div className="absolute top-8 right-6 pointer-events-none">
                                        <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 text-zinc-300 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-xl backdrop-blur-md">
                                            <AlertTriangle className={cn("w-3 h-3",
                                                currentVuln.severity === 'critical' ? "text-red-500" :
                                                    currentVuln.severity === 'high' ? "text-orange-500" : "text-blue-500"
                                            )} />
                                            Active Issue on Line {currentVuln.line}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
