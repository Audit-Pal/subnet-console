import { Shield, Activity, Zap, LucideIcon } from "lucide-react";

export interface Benchmark {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: LucideIcon;
    href: string;
    status: "live" | "upcoming" | "completed";
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
    {
        id: "evm-bench",
        name: "OpenAI EVMBench",
        category: "SMART-SECURITY",
        description: "Evaluation across 120 high-severity vulnerabilities. Measures AI proficiency in Detect, Patch, and Exploit modes within sandboxed environments.",
        icon: Zap,
        href: "/benchmark/evm-bench",
        status: "live",
        locked: true, // Set to true as it's a "premium" add-on in this UI style
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
            specification: "Evaluates AI agents across 120 high-severity vulnerabilities sourced from 40+ real-world audits. Requires precision in Detect, Patch, and Exploit modes.",
            methodology: "Programmatic grading based on transaction replay and on-chain verification within an isolated Anvil environment, ensuring reproducible and risk-free evaluation.",
            approaches: [
                { title: "Isolated Exploit Replay", desc: "Utilize the Rust-based re-execution framework to validate exploit effectiveness against local Ethereum nodes." },
                { title: "Defensive Patching", desc: "Implement regression tests to ensure patches fix vulnerabilities without altering intended contract functionality." }
            ]
        }
    },
];

export const getBenchmarkById = (id: string) => benchmarks.find(b => b.id === id);
