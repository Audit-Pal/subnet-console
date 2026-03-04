"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertOctagon,
    ArrowLeft,
    CheckCircle2,
    Code,
    ExternalLink,
    Network,
    Shield,
    Target,
    XCircle
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { DataModule } from "@/components/ui/data-module";

interface MinerHistoryRow {
    session_id: string;
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

export default function MinerDetailPage() {
    const params = useParams();
    const uidParam = Array.isArray(params.uid) ? params.uid[0] : params.uid;
    const minerUid = Number(uidParam);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<MinerHistoryResponse | null>(null);
    const [agentData, setAgentData] = useState<NetworkAgentRow | null>(null);

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
                const [historyRes, agentsRes] = await Promise.all([
                    fetch(`/api/subnet/miners/history?minerUid=${minerUid}&limit=100`, { signal: controller.signal }),
                    fetch("/api/subnet/network/agents?timeRange=30d&limit=200", { signal: controller.signal }),
                ]);

                if (!historyRes.ok) throw new Error("Miner history not found.");

                const historyJson = (await historyRes.json()) as MinerHistoryResponse;
                const agentsJson = agentsRes.ok ? ((await agentsRes.json()) as NetworkAgentRow[]) : [];

                setHistoryData(historyJson);
                setAgentData(
                    Array.isArray(agentsJson)
                        ? agentsJson.find((row) => row.miner_uid === historyJson.miner_uid) || null
                        : null
                );
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
    }, [minerUid]);

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
                            <div className="flex flex-wrap items-center gap-6 mt-2 text-xs font-mono text-zinc-400">
                                <span className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${historyData.stats.total_participations > 0 ? "bg-emerald-500" : "bg-zinc-500"}`} />
                                    {historyData.stats.total_participations > 0 ? "ACTIVE" : "NO RECENT ACTIVITY"}
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
                        <div className="w-[150px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[86px] flex flex-col justify-between">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.12em] font-bold whitespace-nowrap">Rank - 30D</p>
                            <p className="text-lg font-black text-kast-teal font-mono tabular-nums">{agentData ? `#${agentData.rank}` : "N/A"}</p>
                        </div>
                        <div className="w-[150px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[86px] flex flex-col justify-between">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.12em] font-bold whitespace-nowrap">Benchmark - 30D</p>
                            <p className="text-lg font-black text-white font-mono tabular-nums">{formatApiPercent(agentData?.benchmark)}</p>
                        </div>
                        <div className="w-[150px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[86px] flex flex-col justify-between">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.12em] font-bold whitespace-nowrap">Incentive - 30D</p>
                            <p className="text-lg font-black text-emerald-400 font-mono tabular-nums">{formatNumber(agentData?.incentive, 4)}</p>
                        </div>
                        <div className="w-[150px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[86px] flex flex-col justify-between">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.12em] font-bold whitespace-nowrap">Emission - 30D</p>
                            <p className="text-lg font-black text-kast-teal font-mono tabular-nums">{formatNumber(agentData?.emission, 0)}</p>
                        </div>
                        <div className="w-[150px] p-2.5 bg-white/5 border border-white/10 rounded-lg h-[86px] flex flex-col justify-between">
                            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.12em] font-bold whitespace-nowrap">Consensus - 30D</p>
                            <p className="text-lg font-black text-white font-mono tabular-nums">{formatApiPercent(agentData?.consensus)}</p>
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
                                            <Tooltip
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

                    <div className="lg:col-span-2 h-full min-h-[500px]">
                        <DataModule
                            title="Source Code"
                            icon={<Code className="w-4 h-4" />}
                            className="h-full bg-black/60 border border-white/10 overflow-hidden flex flex-col"
                        >
                            <div className="relative flex-1 bg-[#09090b] border-t border-white/5 -m-4 mt-0 overflow-hidden flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-blue-600 rounded-xl shadow-[0_0_40px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center mb-6 border border-white/10 mx-auto">
                                        <Code className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight">Source Code</h3>
                                    <p className="text-sm text-zinc-400 mb-2 leading-relaxed max-w-sm mx-auto">
                                        Source view will be available soon.
                                    </p>
                                </div>
                            </div>
                        </DataModule>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-kast-teal" /> Recent Validation Feed
                        </h3>
                    </div>

                    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
                        <table className="w-full text-left text-sm font-mono">
                            <thead className="text-[10px] uppercase bg-white/5 text-zinc-500 font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">Session</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Reward</th>
                                    <th className="px-6 py-3 text-right">Accuracy</th>
                                    <th className="px-6 py-3 text-right">Findings</th>
                                    <th className="px-6 py-3 text-right">Critical</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-zinc-400">
                                {historyData.history.length === 0 && (
                                    <tr>
                                        <td className="px-6 py-8 text-center text-zinc-500" colSpan={7}>
                                            No history yet for this miner.
                                        </td>
                                    </tr>
                                )}
                                {historyData.history.map((row) => (
                                    <tr key={`${row.session_id}-${row.timestamp}`} className="transition-colors group hover:bg-white/5">
                                        <td className="px-6 py-3">{formatDateTime(row.timestamp)}</td>
                                        <td className="px-6 py-3 font-bold text-white group-hover:text-kast-teal transition-colors" title={row.session_id}>
                                            {shortSessionId(row.session_id)}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5">
                                                {row.status === "success" ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-400" />
                                                )}
                                                <span className="text-[10px] uppercase">{row.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-emerald-400 font-bold">{formatPercent(row.reward_score)}</td>
                                        <td className="px-6 py-3 text-right">{formatPercent(row.accuracy)}</td>
                                        <td className="px-6 py-3 text-right">{row.findings_count}</td>
                                        <td className="px-6 py-3 text-right">{row.critical_findings_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-zinc-500 border border-white/10 rounded-md px-4 py-3">
                    Data source: recent validation history and miner activity aggregates (not direct on-chain state).
                </div>
            </div>
        </div>
    );
}
