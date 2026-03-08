"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Users, Search, Globe, Server, Trophy, CheckCircle, X, Copy, Check } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

import { DataModule } from "@/components/ui/data-module";
import { NetworkAgent, ThroughputPoint } from "@/types/api";

// Use internal API routes backed by subnet-core backend
const SUBNET_API = "/api/subnet";
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

type TimeWindow = "24h" | "7d" | "30d";

interface ValidatorActivity {
    validator_address: string;
    sessions_submitted: number;
    avg_reward_score: number; // 0-1
    last_submission_ts: number; // unix seconds
}

interface ValidatorSession {
    session_id: string;
    project_id: string | null;
    project_name: string | null;
    state: string;
    timestamp: string;
    sampled_miner_count: number;
    validator_address: string | null;
    avg_reward_score: number;
}

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWindow, setSelectedWindow] = useState<TimeWindow>("7d");
    const [stats, setStats] = useState<{
        active_validators: number;
        active_miners: number;
        daily_audits: number;
        avg_accuracy: number;
        is_real?: boolean;
        source?: string;
        fetched_at?: string;
        window?: string;
    } | null>(null);
    const [validators, setValidators] = useState<ValidatorActivity[]>([]);
    const [miners, setMiners] = useState<Array<{ uid: number }>>([]);
    const [agents, setAgents] = useState<NetworkAgent[]>([]);
    const [throughput, setThroughput] = useState<ThroughputPoint[]>([]);
    const [recentSessions, setRecentSessions] = useState<ValidatorSession[]>([]);
    const [sessionStats, setSessionStats] = useState<{
        total_sessions: number;
        completed_sessions: number;
        failed_sessions: number;
        avg_reward_score: number;
        is_real?: boolean;
        time_range?: string;
    } | null>(null);
    const [selectedValidatorAddress, setSelectedValidatorAddress] = useState<string | null>(null);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch from subnet-core backed endpoints
                const [statsRes, validatorsRes, minersRes, agentsRes, throughputRes, sessionStatsRes, recentSessionsRes] = await Promise.all([
                    fetch(`${SUBNET_API}/network/stats?window=${selectedWindow}`),
                    fetch(`${SUBNET_API}/validators?timeRange=${selectedWindow}&state=completed&limit=500`),
                    fetch(`${SUBNET_API}/miners?timeRange=${selectedWindow}`),
                    fetch(`${SUBNET_API}/network/agents?timeRange=${selectedWindow}&limit=100`),
                    fetch(`${SUBNET_API}/network/throughput?timeRange=${selectedWindow}`),
                    fetch(`${SUBNET_API}/validation/sessions/stats?timeRange=${selectedWindow}`),
                    fetch(`${SUBNET_API}/validation/sessions/recent?limit=500&skip=0`),
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (validatorsRes.ok) {
                    const validatorsData = await validatorsRes.json();
                    const mapped: ValidatorActivity[] = Array.isArray(validatorsData)
                        ? validatorsData.map((row: Record<string, unknown>) => ({
                            validator_address: typeof row.validator_address === "string"
                                ? row.validator_address
                                : (typeof row.hotkey === "string" ? row.hotkey : "unknown"),
                            sessions_submitted: Number(row.sessions_submitted ?? row.stake ?? 0),
                            avg_reward_score: Number(row.avg_reward_score ?? row.trust ?? 0),
                            last_submission_ts: Number(row.last_submission_ts ?? row.last_update ?? 0),
                        }))
                        : [];
                    setValidators(mapped);
                }
                if (minersRes.ok) {
                    const minersData = await minersRes.json();
                    setMiners(Array.isArray(minersData) ? minersData : []);
                }
                if (agentsRes.ok) setAgents(await agentsRes.json());
                if (throughputRes.ok) setThroughput(await throughputRes.json());
                if (sessionStatsRes.ok) setSessionStats(await sessionStatsRes.json());
                if (recentSessionsRes.ok) {
                    const payload = await recentSessionsRes.json();
                    setRecentSessions(Array.isArray(payload?.sessions) ? payload.sessions : []);
                }
            } catch (error) {
                console.error("Failed to fetch network data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // 60s refresh to avoid rate limits
        return () => clearInterval(interval);
    }, [selectedWindow]);

    useEffect(() => {
        if (!selectedValidatorAddress) return;
        const stillExists = validators.some(
            (validator) => validator.validator_address === selectedValidatorAddress
        );
        if (!stillExists) setSelectedValidatorAddress(null);
    }, [selectedValidatorAddress, validators]);

    // Derived Stats
    const auditsLabel = selectedWindow === "24h"
        ? "Completed Network Sessions (24H)"
        : `Completed Network Sessions (${selectedWindow.toUpperCase()})`;
    const networkStats = [
        {
            label: `Validators With Completed Sessions (${selectedWindow.toUpperCase()})`,
            value: validators.length > 0 ? String(validators.length) : "N/A",
            icon: Shield,
            color: "text-kast-teal"
        },
        {
            label: `Miners In Network Feed (${selectedWindow.toUpperCase()})`,
            value: miners.length > 0 ? String(miners.length) : "N/A",
            icon: Users,
            color: "text-purple-400"
        },
        {
            label: auditsLabel,
            value: sessionStats?.is_real
                ? String(sessionStats.completed_sessions ?? 0)
                : "N/A",
            icon: Activity,
            color: "text-blue-400"
        },
        {
            label: "Average Session Score",
            value: sessionStats?.is_real
                ? `${((sessionStats.avg_reward_score ?? 0) * 100).toFixed(1)}%`
                : "N/A",
            icon: CheckCircle,
            color: "text-yellow-400"
        },
    ];

    const now = new Date();
    const currentHourStartMs = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours()
    ).getTime();
    const todayStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const isHourlyWindow = selectedWindow === "24h";
    const bucketMs = isHourlyWindow ? HOUR_MS : DAY_MS;
    const endBucketMs = isHourlyWindow ? currentHourStartMs : todayStartMs;
    const startBucketMs = isHourlyWindow
        ? currentHourStartMs - (23 * HOUR_MS)
        : todayStartMs - ((selectedWindow === "7d" ? 6 : 29) * DAY_MS);
    const getBucketStartMs = (ts: number): number => {
        const dt = new Date(ts);
        return isHourlyWindow
            ? new Date(
                dt.getFullYear(),
                dt.getMonth(),
                dt.getDate(),
                dt.getHours()
            ).getTime()
            : new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
    };

    const recentCompletedByBucket = new Map<number, number>();
    const completedSessionsForWindow = recentSessions.filter((session) => {
        if (session.state !== "completed") return false;
        const ts = new Date(session.timestamp).getTime();
        return Number.isFinite(ts) && ts >= startBucketMs && ts <= (endBucketMs + bucketMs);
    });

    for (const session of completedSessionsForWindow) {
        const ts = new Date(session.timestamp).getTime();
        if (Number.isNaN(ts)) continue;
        const bucket = getBucketStartMs(ts);
        if (bucket < startBucketMs || bucket > endBucketMs) continue;
        recentCompletedByBucket.set(bucket, (recentCompletedByBucket.get(bucket) || 0) + 1);
    }

    const throughputByBucket = new Map<number, number>();
    for (const point of throughput) {
        const ts = new Date(point.timestamp).getTime();
        if (Number.isNaN(ts)) continue;
        const bucket = getBucketStartMs(ts);
        if (bucket < startBucketMs || bucket > endBucketMs) continue;
        throughputByBucket.set(bucket, (throughputByBucket.get(bucket) || 0) + point.completed_sessions);
    }

    const trafficData: { ts: number; time: string; completed: number }[] = [];
    for (let ts = startBucketMs; ts <= endBucketMs; ts += bucketMs) {
        const dt = new Date(ts);
        const label = isHourlyWindow
            ? dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : dt.toLocaleDateString([], { month: "2-digit", day: "2-digit" });

        trafficData.push({
            ts,
            time: label,
            completed: recentCompletedByBucket.get(ts) ?? throughputByBucket.get(ts) ?? 0,
        });
    }

    const hasAnyActivity = trafficData.some((point) => point.completed > 0);
    const maxCompleted = trafficData.reduce((max, point) => Math.max(max, point.completed), 0);
    const yAxisMax = Math.max(1, maxCompleted + 1);
    const hasCompletedSessions = (sessionStats?.completed_sessions ?? 0) > 0;

    const networkAgents = agents
        .filter((agent) => {
            const hasRegisteredRepo =
                typeof agent.agent === "string" &&
                agent.agent.trim().length > 0 &&
                agent.agent !== "N/A";

            if (!hasRegisteredRepo) return false;

            return (
                (agent.agent ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.miner_uid.toString().includes(searchQuery)
            );
        })
        .slice(0, 10);

    const selectedValidator = useMemo(
        () =>
            selectedValidatorAddress
                ? validators.find((validator) => validator.validator_address === selectedValidatorAddress) || null
                : null,
        [selectedValidatorAddress, validators]
    );

    const formatLastSubmission = (unixSeconds: number): string => {
        if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) return "N/A";
        return new Date(unixSeconds * 1000).toLocaleDateString();
    };

    const isWithinSelectedWindow = (timestamp: string): boolean => {
        const ts = new Date(timestamp).getTime();
        if (Number.isNaN(ts)) return false;
        const nowMs = Date.now();
        if (selectedWindow === "24h") return ts >= nowMs - (24 * HOUR_MS);
        if (selectedWindow === "7d") return ts >= nowMs - (7 * DAY_MS);
        return ts >= nowMs - (30 * DAY_MS);
    };

    const formatSessionDateTime = (ts: string): string => {
        const dt = new Date(ts);
        if (Number.isNaN(dt.getTime())) return "N/A";
        return dt.toLocaleString();
    };

    const shortenAddress = (address: string): string => {
        if (!address) return "unknown";
        if (address.length <= 16) return address;
        return `${address.slice(0, 7)}...${address.slice(-6)}`;
    };

    const copyAddress = async (address: string) => {
        try {
            await navigator.clipboard.writeText(address);
            setCopiedAddress(address);
            setTimeout(() => setCopiedAddress((prev) => (prev === address ? null : prev)), 1500);
        } catch (error) {
            console.error("Failed to copy address", error);
        }
    };

    const selectedValidatorSessions = selectedValidator
        ? recentSessions
            .filter((session) =>
                session.validator_address === selectedValidator.validator_address &&
                session.state === "completed" &&
                isWithinSelectedWindow(session.timestamp)
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 20)
        : [];

    const formattedLastUpdated = (() => {
        if (!stats?.fetched_at) return "N/A";
        const dt = new Date(stats.fetched_at);
        return Number.isNaN(dt.getTime()) ? "N/A" : dt.toLocaleString();
    })();

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
                        <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                            Last Updated: {formattedLastUpdated}
                        </p>

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
                        <DataModule
                            title={`Completed Audit Sessions (${selectedWindow.toUpperCase()})`}
                            icon={<Globe className="w-4 h-4" />}
                            className="h-[400px]"
                            action={
                                <div className="hidden md:flex items-center gap-2 text-[10px] font-mono">
                                    {(["24h", "7d", "30d"] as TimeWindow[]).map((w) => (
                                        <button
                                            key={w}
                                            type="button"
                                            onClick={() => setSelectedWindow(w)}
                                            className={`px-2 py-1 rounded border transition-colors ${selectedWindow === w
                                                ? "border-kast-teal/70 text-kast-teal bg-kast-teal/10"
                                                : "border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                                                }`}
                                        >
                                            {w.toUpperCase()}
                                        </button>
                                    ))}
                                    <span className="px-2 py-1 rounded border border-white/10 text-zinc-300 whitespace-nowrap">
                                        Completed: {sessionStats?.is_real ? sessionStats.completed_sessions : "N/A"}
                                    </span>
                                    <span className="px-2 py-1 rounded border border-white/10 text-zinc-300 whitespace-nowrap">
                                        Failed: {sessionStats?.is_real ? sessionStats.failed_sessions : "N/A"}
                                    </span>
                                    <span className="px-2 py-1 rounded border border-white/10 text-zinc-300 whitespace-nowrap">
                                        Avg Score: {sessionStats?.is_real ? `${(sessionStats.avg_reward_score * 100).toFixed(1)}%` : "N/A"}
                                    </span>
                                </div>
                            }
                        >
                            <div className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trafficData}>
                                        <defs>
                                            <linearGradient id="colorCompletedSessions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1EBA98" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#1EBA98" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#555"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            minTickGap={32}
                                        />
                                        <YAxis
                                            stroke="#555"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={[0, yAxisMax]}
                                            allowDecimals={false}
                                        />
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
                                            type="stepAfter"
                                            dataKey="completed"
                                            stroke="#1EBA98"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorCompletedSessions)"
                                            name="Completed Sessions"
                                            dot={{ r: 2, fill: '#1EBA98', strokeWidth: 0 }}
                                            activeDot={{ r: 4 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                                {!loading && !hasAnyActivity && (
                                    <div className="absolute inset-x-0 top-3 text-center text-zinc-500 text-xs font-mono pointer-events-none">
                                        {hasCompletedSessions
                                            ? `Completed session timing is syncing for the selected ${selectedWindow} window`
                                            : `No completed sessions in selected ${selectedWindow} window`}
                                    </div>
                                )}
                            </div>
                        </DataModule>
                    </motion.div>

                    {/* Right Column: Recent Validator Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <DataModule title={`Validator Scores (${selectedWindow.toUpperCase()})`} icon={<Server className="w-4 h-4" />} className="h-[400px] overflow-hidden">
                            <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar h-full">
                                {validators.slice(0, 10).map((val, i) => (
                                    <div
                                        key={`${val.validator_address}-${i}`}
                                        onClick={() => setSelectedValidatorAddress(val.validator_address)}
                                        className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-kast-teal/30 hover:bg-white/10 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-500 font-mono text-xs">0{i + 1}</span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-white group-hover:text-kast-teal transition-colors font-mono" title={val.validator_address}>
                                                        {shortenAddress(val.validator_address)}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            void copyAddress(val.validator_address);
                                                        }}
                                                        className="p-1 rounded border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-colors"
                                                        aria-label="Copy validator address"
                                                        title="Copy full address"
                                                    >
                                                        {copiedAddress === val.validator_address ? (
                                                            <Check className="w-3 h-3 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="w-3 h-3" />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] text-zinc-400 font-mono">
                                                        {val.sessions_submitted} completed in {selectedWindow}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Completed Score</p>
                                            <p className="text-xs font-bold text-kast-teal font-mono">{(val.avg_reward_score * 100).toFixed(1)}%</p>
                                            <p className="text-[9px] uppercase text-zinc-500 mt-1">
                                                Last Completed: {formatLastSubmission(val.last_submission_ts)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {validators.length === 0 && !loading && (
                                    <div className="text-zinc-500 text-center text-xs py-4">No validator activity found</div>
                                )}
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
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 whitespace-nowrap">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Registered Miner Agents
                        </h2>
                        <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
                            Avg reward and cumulative reward are miner reward metrics; participations count miner appearances.
                        </p>
                    </div>

                    <DataModule>
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="text-xs uppercase bg-black/80 backdrop-blur-md text-zinc-300 font-bold tracking-wider sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-lg">#</th>
                                        <th className="px-6 py-4">Agent</th>
                                        <th className="px-6 py-4 whitespace-nowrap text-center">Avg Reward</th>
                                        <th className="px-6 py-4 text-center">Miner UID</th>
                                        <th className="px-6 py-4 text-center whitespace-nowrap">Cumulative Reward</th>
                                        <th className="px-6 py-4 text-center whitespace-nowrap">Participations</th>
                                        <th className="px-6 py-4 text-center rounded-tr-lg whitespace-nowrap">Success Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {networkAgents.map((agent) => (
                                        <tr
                                            key={`${agent.miner_uid}-${agent.rank}`}
                                            className="hover:bg-white/5 transition-colors group cursor-pointer"
                                            onClick={() => window.location.href = `/miner/${agent.miner_uid}`}
                                        >
                                            <td className="px-6 py-4 font-mono text-kast-teal font-bold">{agent.rank}</td>
                                            <td className="px-6 py-4 font-bold text-white group-hover:text-kast-teal transition-colors flex items-center gap-2">
                                                {typeof agent.agent === "string" && agent.agent.trim().length > 0 ? agent.agent : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 text-zinc-400 border-white/10">
                                                    <Trophy className="w-3 h-3 text-zinc-600" />
                                                    {agent.benchmark.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono text-zinc-500">{agent.miner_uid}</td>
                                            <td className="px-6 py-4 text-center font-mono text-emerald-400">{agent.incentive.toFixed(4)}</td>
                                            <td className="px-6 py-4 text-center font-mono text-kast-teal font-bold">
                                                {agent.emission.toFixed(0)}
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono text-zinc-400">
                                                {agent.consensus.toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))}
                                    {networkAgents.length === 0 && !loading && (
                                        <tr><td colSpan={7} className="px-6 py-8 text-center text-zinc-500">No miner activity available for this window</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </DataModule>
                </motion.div>

            </div>

            {selectedValidator && (
                <div className="fixed inset-0 z-[60]">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        onClick={() => setSelectedValidatorAddress(null)}
                        aria-label="Close validator details"
                    />
                    <aside className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-black border-l border-white/10 shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">
                                    Validator Detail
                                </p>
                                <h3 className="text-lg font-black text-white break-all">
                                    {selectedValidator.validator_address}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedValidatorAddress(null)}
                                className="p-2 rounded-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03]">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Completed Sessions ({selectedWindow.toUpperCase()})</p>
                                <p className="text-xl font-black text-white font-mono">{selectedValidator.sessions_submitted}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03]">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Average Completed Score</p>
                                <p className="text-xl font-black text-kast-teal font-mono">{(selectedValidator.avg_reward_score * 100).toFixed(1)}%</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03] col-span-2">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Last Completed Submission</p>
                                <p className="text-sm font-bold text-white font-mono">{formatLastSubmission(selectedValidator.last_submission_ts)}</p>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300">Completed Sessions</h4>
                            <span className="text-xs text-zinc-500 font-mono">{selectedValidatorSessions.length} shown</span>
                        </div>

                        <div className="space-y-2">
                            {selectedValidatorSessions.map((session) => (
                                <div key={session.session_id} className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs text-white font-mono truncate" title={session.session_id}>
                                                {session.session_id}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 mt-1">
                                                {session.project_name || session.project_id || "Unknown Project"}
                                            </p>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 border border-white/10 rounded px-2 py-1">
                                            {session.state}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                                        <span>{formatSessionDateTime(session.timestamp)}</span>
                                        <span>{(session.avg_reward_score * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                            {selectedValidatorSessions.length === 0 && (
                                <div className="p-6 text-center text-zinc-500 text-sm font-mono border border-white/10 rounded-lg bg-white/[0.02]">
                                    No sessions found for this validator in recent data.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
