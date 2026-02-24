import { Shield, Activity, Zap, LucideIcon } from "lucide-react";

export interface Benchmark {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: LucideIcon;
    href: string;
    status: "live" | "upcoming" | "completed";
    statusLabel?: string;
    locked?: boolean;
    score: string;
    agents: number;
    duration: string;
    difficulty: "EXPERT" | "ELITE" | "ADVANCED";
    color: string;
    bgColor: string;
    borderColor: string;
    stats: {
        accuracy: string;
        nodes: number;
    };
    docFields?: {
        specification: string;
        methodology: string;
        approaches: { title: string; desc: string }[];
    }
}

export const benchmarks: Benchmark[] = [
    {
        id: "solidity-suite",
        name: "Auditpal-Solbench-30",
        category: "EVM-V2",
        description: "Advanced verification engine for Ethereum Virtual Machine contracts. Executes deep semantic analysis, data flow tracing, and formal verification of complex DeFi logic.",
        icon: Shield,
        href: "/benchmark/solidity-suite",
        status: "live",
        score: "98.2",
        agents: 12,
        duration: "15m",
        difficulty: "EXPERT",
        color: "text-kast-teal",
        bgColor: "bg-kast-teal/10",
        borderColor: "border-kast-teal/20",
        stats: {
            accuracy: "98.2%",
            nodes: 124
        },
        docFields: {
            specification: "Agent nodes must operate within the SVM-CORE-V2 environment to scan target smart contracts for complex logic flaws. The primary metric is the Detection Accuracy Score (DAS).",
            methodology: "Every contract in the Security Dataset is audited by three independent top-tier security firms before being included, ensuring a high-confidence ground truth.",
            approaches: [
                { title: "Static Analysis / Fuzzing", desc: "Integrate tools like Echidna or Slither to identify state-transition anomalies in contract code." },
                { title: "LLM Semantic Auditing", desc: "Utilize large language models to reason about the logical flow and identify cross-contract call risks." }
            ]
        }
    },
    {
        id: "evm-bench",
        name: "OpenAI EVMBench",
        category: "SMART-SECURITY",
        description: "Advanced benchmark for AI agents to detect, patch, and exploit 120 high-severity vulnerabilities sourced from 40+ top-tier audits.",
        icon: Zap,
        href: "/benchmark/evm-bench",
        status: "live",
        statusLabel: "UNDER CONSTRUCTION",
        locked: false,
        score: "72.2",
        agents: 16,
        duration: "25m",
        difficulty: "ELITE",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        stats: {
            accuracy: "72.2%",
            nodes: 210
        },
        docFields: {
            specification: "Evaluates frontier models across 120 historical vulnerabilities. Scores are calculated based on Detect Recall, Patch Success, and Exploit Reliability.",
            methodology: "Developed with Paradigm, this Rust-based harness utilizes isolated Anvil environments. Programmatic grading is performed via transaction replay and on-chain verification.",
            approaches: [
                { title: "Detect & Patch", desc: "Measures exhaustive codebase auditing capabilities and the generation of non-breaking, regression-tested security fixes." },
                { title: "Exploit Setting", desc: "Validates the generation of functional fund-drain scripts via deterministic transaction replay in sandboxed environments." }
            ]
        }
    },
    {
        id: "solana-suite",
        name: "Solana Runtime Audit",
        category: "SVM-CORE",
        description: "Specialized auditing suite for Solana's Sealevel runtime. Validates account ownership, Borsh (de)serialization, and instruction-level safety across program interactions.",
        icon: Activity,
        href: "/benchmark/solana-suite",
        status: "live",
        locked: true,
        score: "94.5",
        agents: 8,
        duration: "12m",
        difficulty: "EXPERT",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        stats: {
            accuracy: "94.5%",
            nodes: 86
        }
    },
];

export const getBenchmarkById = (id: string) => benchmarks.find(b => b.id === id);
