"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import {
    Activity,
    AlertOctagon,
    ArrowLeft,
    Code,
    ExternalLink,
    Network,
    Shield,
    Target,
    Users,
    ChevronDown,
    User
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { DataModule } from "@/components/ui/data-module";

interface MinerHistoryRow {
    session_id: string;
    validator_address: string | null;
    validators?: Array<{
        address: string | null;
        reward_score: number;
        accuracy: number | null;
        findings_count: number;
        critical_findings_count: number;
        execution_time_ms: number | null;
        status?: string;
    }>;
    reward_score: number;
    findings_count: number;
    critical_findings_count: number;
    accuracy: number | null;
    execution_time_ms: number | null;
    timestamp: string;
    status: string;
    github_url: string | null;
}

interface MinerHistoryStats {
    avg_reward: number;
    total_participations: number;
    success_count: number;
    failure_count: number;
    avg_accuracy: number | null;
    total_findings_discovered: number;
    total_critical_findings: number;
}

interface MinerHistoryResponse {
    miner_uid: number;
    history: MinerHistoryRow[];
    stats: MinerHistoryStats;
    history_scope: {
        time_range: "24h" | "7d" | "30d";
        fetched_rows: number;
        included_rows: number;
    };
    validator_summary_scope: {
        fetched_sessions: number;
        total_participations: number;
        unresolved_validator_sessions: number;
        is_complete: boolean;
        attribution_complete?: boolean;
        time_range: "24h" | "7d" | "30d";
    };
    validator_summaries: Array<{
        address: string | null;
        label: string;
        is_resolved: boolean;
        runs: number;
        success_count: number;
        failure_count: number;
        other_count: number;
        avg_reward: number;
        avg_accuracy: number | null;
        findings: number;
        critical: number;
        avg_runtime_ms: number | null;
        last_timestamp: string;
        sessions: Array<{
            session_id: string;
            timestamp: string;
            status: string;
            reward_score: number;
            accuracy: number | null;
            findings_count: number;
            critical_findings_count: number;
            execution_time_ms: number | null;
        }>;
    }>;
}

interface NetworkAgentRow {
    rank: number;
    miner_uid: number;
    agent: string | null;
    benchmark: number;
    incentive: number;
    emission: number;
    consensus: number;
    findings_discovered: number;
}

interface SessionStatsResponse {
    total_sessions: number;
    completed_sessions: number;
    failed_sessions: number;
    avg_reward_score: number;
    is_real?: boolean;
    time_range?: string;
}

interface SourceCodeResponse {
    path: string;
    source_url: string;
    content: string;
}

type TimeWindow = "24h" | "7d" | "30d";

const createEmptyMinerHistoryResponse = (
    minerUid: number,
    timeRange: TimeWindow
): MinerHistoryResponse => ({
    miner_uid: minerUid,
    history: [],
    stats: {
        avg_reward: 0,
        total_participations: 0,
        success_count: 0,
        failure_count: 0,
        avg_accuracy: null,
        total_findings_discovered: 0,
        total_critical_findings: 0,
    },
    history_scope: {
        time_range: timeRange,
        fetched_rows: 0,
        included_rows: 0,
    },
    validator_summary_scope: {
        fetched_sessions: 0,
        total_participations: 0,
        unresolved_validator_sessions: 0,
        is_complete: true,
        attribution_complete: true,
        time_range: timeRange,
    },
    validator_summaries: [],
});

const formatPercent = (normalized: number | null | undefined): string => {
    if (normalized === null || normalized === undefined || !Number.isFinite(normalized)) return "N/A";
    return `${(normalized * 100).toFixed(1)}%`;
};

const formatNumber = (value: number | null | undefined, digits = 4): string => {
    if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
    return value.toFixed(digits);
};

const formatApiPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
    return `${value.toFixed(1)}%`;
};

const formatDateTime = (value: string): string => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleString();
};

const shortText = (value: string, keep = 20): string => {
    if (value.length <= keep) return value;
    return `${value.slice(0, keep)}...`;
};

const shortSessionId = (value: string): string => {
    if (value.length <= 14) return value;
    return `${value.slice(0, 7)}...${value.slice(-5)}`;
};

const shortAddress = (value: string | null | undefined, keep = 14): string => {
    if (!value) return "N/A";
    if (value.length <= keep) return value;
    return `${value.slice(0, 8)}...${value.slice(-4)}`;
};

const formatValidatorLabel = (
    validator: { label: string; address: string | null; is_resolved: boolean },
    keep = 22
): string => {
    if (!validator.is_resolved) return validator.label;
    return shortAddress(validator.address, keep);
};

const inferLanguage = (path: string | null | undefined): string => {
    if (!path) return "plaintext";
    if (path.endsWith(".py")) return "python";
    if (path.endsWith(".ts")) return "typescript";
    if (path.endsWith(".tsx")) return "typescript";
    if (path.endsWith(".js")) return "javascript";
    if (path.endsWith(".jsx")) return "javascript";
    if (path.endsWith(".json")) return "json";
    if (path.endsWith(".sol")) return "sol";
    if (path.endsWith(".md")) return "markdown";
    if (path.endsWith(".sh")) return "shell";
    return "plaintext";
};

const toGithubFileUrl = (value: string | null | undefined): string | null => {
    if (!value) return null;

    try {
        const url = new URL(value);

        if (url.hostname === "raw.githubusercontent.com") {
            const parts = url.pathname.split("/").filter(Boolean);
            if (parts.length >= 4) {
                const [owner, repo, branch, ...fileParts] = parts;
                return `https://github.com/${owner}/${repo}/blob/${branch}/${fileParts.join("/")}`;
            }
        }

        if (url.hostname === "github.com") {
            const parts = url.pathname.replace(/\.git$/, "").split("/").filter(Boolean);
            if (parts.length >= 5 && parts[2] === "blob") {
                return value;
            }
            if (parts.length >= 2) {
                return `https://github.com/${parts[0]}/${parts[1]}`;
            }
        }

        return value;
    } catch {
        return value;
    }
};

export default function MinerDetailPage() {
    const params = useParams();
    const uidParam = Array.isArray(params.uid) ? params.uid[0] : params.uid;
    const minerUid = Number(uidParam);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<MinerHistoryResponse | null>(null);
    const [agentData, setAgentData] = useState<NetworkAgentRow | null>(null);
    const [sourceCode, setSourceCode] = useState<SourceCodeResponse | null>(null);
    const [sourceCodeError, setSourceCodeError] = useState<string | null>(null);
    const [selectedValidatorAddress, setSelectedValidatorAddress] = useState<string | null>(null);
    const [selectedWindow, setSelectedWindow] = useState<TimeWindow>("30d");
    const [sessionStats, setSessionStats] = useState<SessionStatsResponse | null>(null);

    useEffect(() => {
        if (!Number.isFinite(minerUid) || minerUid < 0) {
            setLoading(false);
            setError("Invalid miner UID.");
            return;
        }

        const controller = new AbortController();

        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const [historyRes, agentsRes, sessionStatsRes] = await Promise.all([
                    fetch(`/api/subnet/miners/history?minerUid=${minerUid}&limit=200&timeRange=${selectedWindow}`, { signal: controller.signal }),
                    fetch(`/api/subnet/network/agents?timeRange=${selectedWindow}&limit=200`, { signal: controller.signal }),
                    fetch(`/api/subnet/validation/sessions/stats?timeRange=${selectedWindow}`, { signal: controller.signal }),
                ]);

                const agentsJson = agentsRes.ok ? ((await agentsRes.json()) as NetworkAgentRow[]) : [];
                const sessionStatsJson = sessionStatsRes.ok
                    ? ((await sessionStatsRes.json()) as SessionStatsResponse)
                    : null;
                const historyJson = historyRes.ok
                    ? ((await historyRes.json()) as MinerHistoryResponse)
                    : historyRes.status === 404
                        ? createEmptyMinerHistoryResponse(minerUid, selectedWindow)
                        : (() => {
                            throw new Error("Failed to fetch miner history.");
                        })();
                const matchedAgent = Array.isArray(agentsJson)
                    ? agentsJson.find((row) => row.miner_uid === minerUid) || null
                    : null;

                setHistoryData(historyJson);
                setAgentData(matchedAgent);
                setSessionStats(sessionStatsJson);

                const sourceIdentity = matchedAgent?.agent || historyJson.history[0]?.github_url || null;
                if (sourceIdentity) {
                    const sourceRes = await fetch(`/api/subnet/source-code?url=${encodeURIComponent(sourceIdentity)}`, {
                        signal: controller.signal,
                    });

                    if (sourceRes.ok) {
                        const sourceJson = (await sourceRes.json()) as SourceCodeResponse;
                        setSourceCode(sourceJson);
                        setSourceCodeError(null);
                    } else {
                        const sourceJson = await sourceRes.json().catch(() => null) as { error?: string } | null;
                        setSourceCode(null);
                        setSourceCodeError(sourceJson?.error || "Source view is unavailable for this miner.");
                    }
                } else {
                    setSourceCode(null);
                    setSourceCodeError("No source URL is available for this miner.");
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to load miner detail", err);
                setError("Failed to load miner detail data.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        run();
        return () => controller.abort();
    }, [minerUid, selectedWindow]);

    const rewardTrend = useMemo(() => {
        const rows = historyData?.history || [];
        const byDay = new Map<string, {
            ts: number;
            label: string;
            rewardTotal: number;
            rewardCount: number;
            accuracyTotal: number;
            accuracyCount: number;
        }>();

        for (const row of rows) {
            const dt = new Date(row.timestamp);
            if (Number.isNaN(dt.getTime())) continue;

            const dayStart = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
            const dayKey = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
            const prev = byDay.get(dayKey) || {
                ts: dayStart,
                label: dt.toLocaleDateString([], { month: "2-digit", day: "2-digit" }),
                rewardTotal: 0,
                rewardCount: 0,
                accuracyTotal: 0,
                accuracyCount: 0,
            };

            if (Number.isFinite(row.reward_score)) {
                prev.rewardTotal += row.reward_score * 100;
                prev.rewardCount += 1;
            }
            if (Number.isFinite(row.accuracy ?? NaN)) {
                prev.accuracyTotal += (row.accuracy as number) * 100;
                prev.accuracyCount += 1;
            }

            byDay.set(dayKey, prev);
        }

        return Array.from(byDay.values())
            .sort((a, b) => a.ts - b.ts)
            .map((day) => ({
                label: day.label,
                reward: day.rewardCount > 0 ? day.rewardTotal / day.rewardCount : 0,
                accuracy: day.accuracyCount > 0 ? day.accuracyTotal / day.accuracyCount : null,
            }));
    }, [historyData]);

    const verifiedSummary = useMemo(() => {
        const stats = historyData?.stats;
        if (!stats) {
            return {
                avgReward: null as number | null,
                totalReward: null as number | null,
                participations: 0,
                successRate: null as number | null,
            };
        }

        const participations = stats.total_participations;
        const successRate = participations > 0
            ? (stats.success_count / participations) * 100
            : null;

        return {
            avgReward: stats.avg_reward,
            totalReward: stats.avg_reward * participations,
            participations,
            successRate,
        };
    }, [historyData?.stats]);

    const participationContext = useMemo(() => {
        if (!sessionStats?.is_real) return null;
        const totalSessions = sessionStats.total_sessions;
        const participations = verifiedSummary.participations;
        if (!Number.isFinite(totalSessions) || totalSessions <= 0) return null;

        return {
            totalSessions,
            participations,
            coverage: (participations / totalSessions) * 100,
        };
    }, [sessionStats, verifiedSummary.participations]);

    const validatorSummaries = useMemo(
        () => historyData?.validator_summaries || [],
        [historyData?.validator_summaries]
    );
    const validatorScope = historyData?.validator_summary_scope || null;
    const resolvedValidatorSummaries = useMemo(
        () => validatorSummaries.filter((entry) => entry.is_resolved),
        [validatorSummaries]
    );
    const displayValidatorSummaries = resolvedValidatorSummaries;
    const visibleValidatorRuns = useMemo(
        () => resolvedValidatorSummaries.reduce((sum, entry) => sum + entry.runs, 0),
        [resolvedValidatorSummaries]
    );

    const selectedValidatorSummary = useMemo(
        () => validatorSummaries.find((entry) => (entry.address ?? entry.label) === selectedValidatorAddress) || null,
        [selectedValidatorAddress, validatorSummaries]
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24">
                <div className="max-w-7xl mx-auto text-zinc-400 font-mono text-sm">Loading miner data...</div>
            </div>
        );
    }

    if (error || !historyData) {
        return (
            <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24">
                <div className="max-w-7xl mx-auto space-y-4">
                    <Link href="/network" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-kast-teal transition-colors uppercase tracking-widest">
                        <ArrowLeft className="w-3 h-3" /> Back to Network
                    </Link>
                    <div className="text-red-400 font-mono text-sm">{error || "No miner data available."}</div>
                </div>
            </div>
        );
    }

    const lastRecord = historyData.history[0];
    const agentIdentity = agentData?.agent || lastRecord?.github_url || "Unknown";
    const sourceFileUrl = toGithubFileUrl(lastRecord?.github_url || sourceCode?.source_url || agentData?.agent || null);
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24 font-sans selection:bg-kast-teal selection:text-black">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-4">
                        <Link href="/network" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-kast-teal transition-colors uppercase tracking-widest">
                            <ArrowLeft className="w-3 h-3" /> Back to Network
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="uppercase tracking-tighter text-white flex items-baseline gap-2">
                                    <span className="text-sm font-bold text-kast-teal">AGENT:</span>
                                    <span className="text-4xl md:text-5xl font-black">{historyData.miner_uid}</span>
                                </h1>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                {(["24h", "7d", "30d"] as TimeWindow[]).map((window) => (
                                    <button
                                        key={window}
                                        type="button"
                                        onClick={() => setSelectedWindow(window)}
                                        className={`px-2 py-1 rounded border text-[10px] font-mono uppercase transition-colors ${
                                            selectedWindow === window
                                                ? "border-kast-teal/70 text-kast-teal bg-kast-teal/10"
                                                : "border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                                        }`}
                                    >
                                        {window}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-6 mt-2 text-xs font-mono text-zinc-400">
                                <span className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${historyData.stats.total_participations > 0 ? "bg-emerald-500" : "bg-zinc-500"}`} />
                                    {historyData.stats.total_participations > 0 ? `ACTIVE IN ${selectedWindow.toUpperCase()}` : `NO ACTIVITY IN ${selectedWindow.toUpperCase()}`}
                                </span>
                                <span className="flex items-center gap-2"><Network className="w-3 h-3" /> UID: {historyData.miner_uid}</span>
                                <span className="flex items-center gap-2 truncate max-w-[520px]" title={agentIdentity}>
                                    <Shield className="w-3 h-3" />
                                    <span className="opacity-50">IDENTITY:</span>
                                    {shortText(agentIdentity, 56)}
                                </span>
                            </div>
                            {agentData?.agent && (
                                <a
                                    href={agentData.agent}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex mt-2 items-center gap-2 text-xs font-mono text-kast-teal hover:text-white transition-colors"
                                >
                                    Open Agent URL <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>

                        <div className="w-full flex flex-wrap gap-2 md:gap-3 md:justify-end">
                            <div className="w-[156px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[90px] flex flex-col justify-between">
                                <p className="text-[8px] leading-tight text-zinc-500 uppercase tracking-[0.08em] font-bold">
                                    Rank
                                    <span className="block">{selectedWindow.toUpperCase()}</span>
                                </p>
                                <p className="text-lg font-black text-kast-teal font-mono tabular-nums">{agentData ? `#${agentData.rank}` : "N/A"}</p>
                            </div>
                            <div className="w-[156px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[90px] flex flex-col justify-between">
                                <p className="text-[8px] leading-tight text-zinc-500 uppercase tracking-[0.08em] font-bold">
                                    Avg Reward Score
                                    <span className="block">{selectedWindow.toUpperCase()}</span>
                                </p>
                                <p className="text-lg font-black text-white font-mono tabular-nums">{formatPercent(verifiedSummary.avgReward)}</p>
                            </div>
                            <div className="w-[156px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[90px] flex flex-col justify-between">
                                <p className="text-[8px] leading-tight text-zinc-500 uppercase tracking-[0.08em] font-bold">
                                    Total Reward Score
                                    <span className="block">{selectedWindow.toUpperCase()}</span>
                                </p>
                                <p className="text-lg font-black text-emerald-400 font-mono tabular-nums">{formatNumber(verifiedSummary.totalReward, 4)}</p>
                            </div>
                            <div className="w-[156px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[90px] flex flex-col justify-between">
                                <p className="text-[8px] leading-tight text-zinc-500 uppercase tracking-[0.08em] font-bold">
                                    Validator
                                    <span className="block">Sessions</span>
                                    <span className="block">{selectedWindow.toUpperCase()}</span>
                                </p>
                                <p className="text-lg font-black text-kast-teal font-mono tabular-nums">{formatNumber(verifiedSummary.participations, 0)}</p>
                            </div>
                            <div className="w-[156px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[90px] flex flex-col justify-between">
                                <p className="text-[8px] leading-tight text-zinc-500 uppercase tracking-[0.08em] font-bold">
                                    Success Rate
                                    <span className="block">{selectedWindow.toUpperCase()}</span>
                                </p>
                                <p className="text-lg font-black text-white font-mono tabular-nums">{formatApiPercent(verifiedSummary.successRate)}</p>
                            </div>
                        </div>
                    </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-kast-teal/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-zinc-400"><AlertOctagon className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Avg Accuracy</span></div>
                                <p className="text-2xl font-mono font-bold text-white">{formatPercent(historyData.stats.avg_accuracy)}</p>
                                <p className="text-[10px] text-zinc-500 mt-1">From miner history stats</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-kast-teal/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-zinc-400"><Target className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Findings Found</span></div>
                                <p className="text-2xl font-mono font-bold text-white">{historyData.stats.total_findings_discovered}</p>
                                <p className="text-[10px] text-zinc-500 mt-1">Critical: {historyData.stats.total_critical_findings}</p>
                            </div>
                        </div>

                        <DataModule className="h-[300px] bg-black/40 backdrop-blur-sm border-white/10 flex flex-col">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-kast-teal" />
                                    REWARD_TREND
                                </h3>
                            </div>
                            <div className="flex-1 p-4 min-h-0">
                                {rewardTrend.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-xs font-mono text-zinc-500">No trend data yet</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={rewardTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                            <XAxis dataKey="label" tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                            <YAxis domain={[0, 100]} tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                            <RechartsTooltip
                                                contentStyle={{
                                                    backgroundColor: "#000",
                                                    border: "1px solid #333",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
                                                    color: "#fff",
                                                    fontFamily: "monospace",
                                                    fontSize: "12px"
                                                }}
                                                formatter={(value: number) => [`${value.toFixed(1)}%`, "Reward Score"]}
                                            />
                                            <Line type="monotone" dataKey="reward" stroke="#1EBA98" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </DataModule>

                    </div>

                    <div className="lg:col-span-2 h-full min-h-[560px]">
                        <DataModule
                            title="Registered Agent Repository"
                            icon={<Code className="w-4 h-4" />}
                            className="h-[560px] bg-black/60 border border-white/10 overflow-hidden flex flex-col"
                        >
                            <div className="relative flex-1 bg-[#09090b] border-t border-white/5 -m-4 mt-0 overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/5 bg-black/40">
                                    <div className="min-w-0">
                                        <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-500 font-bold">Current Repo View</p>
                                        <p className="text-[11px] font-mono text-zinc-300 truncate">
                                            {sourceCode?.path || "agent.py"}
                                        </p>
                                    </div>
                                    {sourceFileUrl && (
                                        <a
                                            href={sourceFileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-[11px] font-mono text-kast-teal hover:text-white transition-colors shrink-0"
                                        >
                                     GitHub <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                {sourceCode?.content ? (
                                    <div className="flex-1 overflow-auto">
                                        <Editor
                                            height="100%"
                                            defaultLanguage={inferLanguage(sourceCode.path)}
                                            value={sourceCode.content}
                                            theme="vs-dark"
                                            options={{
                                                readOnly: true,
                                                minimap: { enabled: false },
                                                wordWrap: "off",
                                                scrollBeyondLastLine: false,
                                                fontSize: 13,
                                                fontFamily: "JetBrains Mono, Fira Code, Menlo, Monaco, Consolas, monospace",
                                                lineHeight: 22,
                                                renderLineHighlight: "none",
                                                overviewRulerBorder: false,
                                                folding: false,
                                                lineNumbers: "on",
                                                glyphMargin: false,
                                                lineDecorationsWidth: 10,
                                                padding: { top: 12, bottom: 12 },
                                                scrollbar: {
                                                    verticalScrollbarSize: 10,
                                                    horizontalScrollbarSize: 10,
                                                },
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center p-8 text-center">
                                        <div>
                                            <div className="w-16 h-16 bg-blue-600 rounded-xl shadow-[0_0_40px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center mb-6 border border-white/10 mx-auto">
                                                <Code className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight">Registered Agent Repository</h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
                                                {sourceCodeError || "Current repository view is unavailable for this miner."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DataModule>
                    </div>
                </div>

                <div className="space-y-6">
                    {participationContext && (
                        <div className="text-[11px] font-mono text-zinc-500">
                            Miner {historyData.miner_uid} appeared in {participationContext.participations} of {participationContext.totalSessions} network sessions in {selectedWindow.toUpperCase()} ({participationContext.coverage.toFixed(1)}% coverage).
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-kast-teal" /> Validators
                        </h3>

                        {validatorSummaries.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 self-start md:self-auto">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Seen on <span className="text-kast-teal">{resolvedValidatorSummaries.length}</span> Validators
                                </span>
                                {validatorScope && (
                                    <span className="text-[10px] font-mono text-zinc-500">
                                        {validatorScope.attribution_complete
                                            ? `Verified across ${visibleValidatorRuns} miner sessions`
                                            : `Showing ${visibleValidatorRuns} attributed miner sessions`}
                                    </span>
                                )}
                                <div className="flex -space-x-1.5">
                                    {resolvedValidatorSummaries.map((entry) => (
                                        <div
                                            key={entry.address ?? entry.label}
                                            className="w-7 h-7 rounded-full border border-white/10 bg-black/60 flex items-center justify-center"
                                            title={entry.is_resolved ? (entry.address ?? entry.label) : entry.label}
                                        >
                                            <Shield className="w-3.5 h-3.5 text-kast-teal" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {displayValidatorSummaries.length === 0 ? (
                            <div className="p-12 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
                                <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                <p className="text-zinc-500 font-mono text-sm">No validator history available for this miner.</p>
                            </div>
                        ) : !selectedValidatorSummary ? (
                            <div className="space-y-4">
                                {displayValidatorSummaries.map((validator) => (
                                    <button
                                        key={validator.address ?? validator.label}
                                        onClick={() => setSelectedValidatorAddress(validator.address ?? validator.label)}
                                        className="w-full text-left rounded-[20px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/15 transition-all px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-11 h-11 rounded-full border border-white/10 bg-black/40 flex items-center justify-center shrink-0">
                                                    <Shield className="w-4 h-4 text-kast-teal" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[18px] leading-none font-black text-white font-mono truncate">
                                                        {formatValidatorLabel(validator, 22)}
                                                    </div>
                                                    <div className="mt-2 text-[15px] md:text-[16px] font-black text-white leading-tight">
                                                        {validator.success_count} successful, {validator.failure_count} failed{validator.other_count > 0 ? `, ${validator.other_count} other` : ""} ({validator.runs} sessions)
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pl-0 lg:pl-6">
                                                <div className="text-right">
                                                    <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Average Score</div>
                                                    <div className="text-[15px] md:text-[16px] font-black font-mono text-kast-teal">{formatPercent(validator.avg_reward)}</div>
                                                </div>
                                                <div className="h-10 w-px bg-white/10 hidden lg:block" />
                                                <ChevronDown className="w-5 h-5 text-zinc-500" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedValidatorAddress(null)}
                                        className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-mono text-red-400 hover:bg-red-500/15 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Close Validator View
                                    </button>
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                        Showing results for <span className="text-kast-teal">{formatValidatorLabel(selectedValidatorSummary, 18)}</span>
                                    </div>
                                </div>

                                <div className="max-w-6xl mx-auto space-y-6">
                                    <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 items-start">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-kast-teal" />
                                                <h5 className="text-xs font-black uppercase tracking-widest text-zinc-400">Selected Validator</h5>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Validator</div>
                                                    <div className="text-sm font-mono text-white break-all">
                                                        {selectedValidatorSummary.is_resolved
                                                            ? selectedValidatorSummary.address
                                                            : selectedValidatorSummary.label}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                                                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Sessions</div>
                                                        <div className="text-[13px] font-mono text-zinc-200">{selectedValidatorSummary.runs}</div>
                                                    </div>
                                                    <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                                                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Last Seen</div>
                                                        <div className="text-[11px] font-mono text-zinc-200">{formatDateTime(selectedValidatorSummary.last_timestamp)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                                            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Validator Metrics</span>
                                                <span className="text-[11px] font-mono text-kast-teal font-bold">{formatValidatorLabel(selectedValidatorSummary)}</span>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                                                {[
                                                    {
                                                        label: "Average Score",
                                                        value: formatPercent(selectedValidatorSummary.avg_reward),
                                                        tone: "text-emerald-400",
                                                    },
                                                    {
                                                        label: "Findings",
                                                        value: String(selectedValidatorSummary.findings),
                                                        tone: "text-white",
                                                    },
                                                    {
                                                        label: "Critical",
                                                        value: String(selectedValidatorSummary.critical),
                                                        tone: selectedValidatorSummary.critical > 0 ? "text-red-400" : "text-white",
                                                    },
                                                    {
                                                        label: "Successful Runs",
                                                        value: String(selectedValidatorSummary.success_count),
                                                        tone: "text-white",
                                                    },
                                                    {
                                                        label: "Failed Runs",
                                                        value: String(selectedValidatorSummary.failure_count),
                                                        tone: "text-red-400",
                                                    },
                                                    ...(selectedValidatorSummary.other_count > 0 ? [{
                                                        label: "Other Status",
                                                        value: String(selectedValidatorSummary.other_count),
                                                        tone: "text-amber-300",
                                                    }] : []),
                                                    {
                                                        label: "Miner UID",
                                                        value: String(historyData.miner_uid),
                                                        tone: "text-white",
                                                    },
                                                ].map((item) => (
                                                    <div key={item.label} className="bg-black/40 p-5 min-h-[96px]">
                                                        <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-2">{item.label}</div>
                                                        <div className={cn("text-lg font-black font-mono", item.tone)}>{item.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden max-w-5xl mx-auto w-full">
                                        <div className="px-6 py-4 border-b border-white/10 bg-black/30 flex items-center justify-between">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Session Results</div>
                                            <div className="text-[11px] font-mono text-zinc-400">{selectedValidatorSummary.sessions.length} sessions</div>
                                        </div>
                                        <div className="max-h-[680px] overflow-y-auto divide-y divide-white/5 [scrollbar-width:thin] [scrollbar-color:rgba(161,161,170,0.55)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400/60">
                                            {selectedValidatorSummary.sessions.map((session) => (
                                                <div key={`${selectedValidatorSummary.address}-${session.session_id}`} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-black text-white">Evaluation {shortSessionId(session.session_id)}</div>
                                                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                                            <span>{formatDateTime(session.timestamp)}</span>
                                                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                                            <span
                                                                className={
                                                                    session.status === "success"
                                                                        ? "text-emerald-400"
                                                                        : session.status === "failed"
                                                                            ? "text-red-400"
                                                                            : "text-amber-300"
                                                                }
                                                            >
                                                                {session.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Score</div>
                                                            <div className="text-lg font-black font-mono text-kast-teal">{formatPercent(session.reward_score)}</div>
                                                        </div>
                                                        {session.execution_time_ms ? (
                                                            <div className="text-right">
                                                                <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Runtime</div>
                                                                <div className="text-sm font-black font-mono text-white">
                                                                    {`${Math.round(session.execution_time_ms / 1000)}s`}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
