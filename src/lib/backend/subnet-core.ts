const SUBNET_CORE_API_BASE =
  process.env.SUBNET_CORE_API_BASE || "https://subnet-core-backend.vercel.app";

const CACHE_TTL_MS = 30 * 1000;
const FETCH_TIMEOUT_MS = 8 * 1000;

type TimeWindow = "24h" | "7d" | "30d";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  leaderboard?: T;
}

function unwrapSubnetCoreResponse<T>(payload: ApiResponse<T> | T): T | null {
  if (payload === null || payload === undefined) return null;

  if (typeof payload === "object" && !Array.isArray(payload)) {
    const envelope = payload as ApiResponse<T>;
    if (envelope.data !== undefined) return envelope.data;
    if (envelope.leaderboard !== undefined) return envelope.leaderboard;
  }

  return payload as T;
}

interface SubnetCoreStatsPayload {
  activeValidators?: unknown;
  activeMiners?: unknown;
  dailyAudits?: unknown;
  avgAccuracy?: unknown;
  totalFindingsDiscovered?: unknown;
  criticalFindingsDiscovered?: unknown;
}

interface PaginationPayload {
  total?: unknown;
  limit?: unknown;
  skip?: unknown;
}

interface SessionPayload {
  sessionId?: unknown;
  projectId?: unknown;
  projectName?: unknown;
  state?: unknown;
  timestamp?: unknown;
  sampledMinerCount?: unknown;
  metadata?: {
    validatorAddress?: unknown;
  };
  metrics?: {
    averageRewardScore?: unknown;
  };
}

export interface SubnetCoreStats {
  activeValidators: number;
  activeMiners: number;
  dailyAudits: number; // contract audits completed in the requested window
  avgAccuracy: number; // normalized 0-1
  totalFindingsDiscovered: number;
  criticalFindingsDiscovered: number;
}

export interface SubnetCoreLeaderboardEntry {
  rank: number;
  minerUid: number;
  totalRewards: number;
  avgReward: number;
  participationCount: number;
  successRate: number; // percentage
  avgAccuracy: number | null; // 0-1
  findingsDiscovered: number;
  criticalFindings: number;
}

export interface SubnetCoreNetworkAgent {
  rank: number;
  minerUid: number;
  agent: string | null;
  benchmark: number;
  incentive: number;
  emission: number;
  consensus: number; // percentage
  findingsDiscovered: number;
}

export interface SubnetCoreThroughputPoint {
  timestamp: string;
  completedSessions: number;
  avgRewardScore: number; // 0-1
}

export interface SubnetCoreSessionSummary {
  sessionId: string;
  projectId: string | null;
  projectName: string | null;
  state: string;
  timestamp: string;
  sampledMinerCount: number;
  validatorAddress: string | null;
  averageRewardScore: number;
}

export interface SubnetCoreSessionsResponse {
  sessions: SubnetCoreSessionSummary[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
  };
}

export interface SubnetCoreSessionsStats {
  totalSessions: number;
  completedSessions: number;
  failedSessions: number;
  avgRewardScore: number; // normalized 0-1
  totalMinersQueried: number;
  avgQueryTime: number; // milliseconds
}

export interface SubnetCoreSeverityDistribution {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalFindings: number;
}

export interface SubnetCoreFinding {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string | null;
  codeLocation: string | null;
  remediation: string | null;
  confidenceScore: number | null;
}

export interface SubnetCoreCriticalFindingEntry {
  rank: number;
  sessionId: string;
  projectId: string | null;
  minerUid: number;
  githubUrl: string | null;
  rewardScore: number | null; // normalized 0-1
  criticalFindingCount: number;
  findings: SubnetCoreFinding[];
  timestamp: string;
}

export interface SubnetCoreSessionFindingsByMiner {
  minerUid: number;
  githubUrl: string | null;
  findingsCount: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  findings: SubnetCoreFinding[];
  rewardScore: number | null; // normalized 0-1
  timestamp: string;
}

export interface SubnetCoreSessionFindings {
  sessionId: string;
  projectId: string | null;
  timestamp: string;
  summary: {
    totalFindings: number;
    criticalFindings: number;
    minersWithFindings: number;
  };
  findingsByMiner: SubnetCoreSessionFindingsByMiner[];
}

export interface SubnetCoreMinerHistoryEntry {
  sessionId: string;
  rewardScore: number;
  findingsCount: number;
  criticalFindingsCount: number;
  accuracy: number | null; // normalized 0-1
  executionTime: number | null;
  timestamp: string;
  status: string;
  githubUrl: string | null;
}

export interface SubnetCoreMinerHistoryStats {
  avgReward: number;
  totalParticipations: number;
  successCount: number;
  failureCount: number;
  avgAccuracy: number | null; // normalized 0-1
  totalFindingsDiscovered: number;
  totalCriticalFindings: number;
}

export interface SubnetCoreMinerHistory {
  minerUid: number;
  history: SubnetCoreMinerHistoryEntry[];
  stats: SubnetCoreMinerHistoryStats;
}

export interface SubnetCoreProjectRun {
  sessionId: string;
  timestamp: string;
  state: string;
  sampledMinerCount: number;
  avgRewardScore: number | null; // normalized 0-1
  findingsCount: number;
}

export interface SubnetCoreProjectSummary {
  projectId: string;
  totalValidationRuns: number;
  successfulRuns: number;
  failedRuns: number;
  totalMinersQueried: number;
  avgRewardScore: number; // normalized 0-1
  totalFindingsDiscovered: number;
  lastRun: string | null;
  sessions: SubnetCoreProjectRun[];
}

export interface SubnetCoreHealth {
  success: boolean;
  status: string;
  timestamp: string;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toNonNegativeInt(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

function toNormalizedAccuracy(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  if (n > 1) return Math.min(n / 100, 1);
  return n;
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parsePercentage(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace("%", ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toSeverity(
  value: unknown
): "critical" | "high" | "medium" | "low" | "info" {
  if (
    value === "critical" ||
    value === "high" ||
    value === "medium" ||
    value === "low" ||
    value === "info"
  ) {
    return value;
  }
  return "medium";
}

async function fetchFromSubnetCore<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  cacheKey: string
): Promise<T | null> {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  try {
    const url = new URL(path, SUBNET_CORE_API_BASE);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      throw new Error(`Subnet core API responded with ${res.status}`);
    }

    const payload = (await res.json()) as ApiResponse<T> | T;
    const data = unwrapSubnetCoreResponse<T>(payload);
    if (data === null) return null;

    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`Subnet core fetch failed for ${path}:`, error);
    if (cached) {
      return cached.data as T;
    }
    return null;
  }
}

async function fetchEnvelopeFromSubnetCore<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  cacheKey: string
): Promise<T | null> {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  try {
    const url = new URL(path, SUBNET_CORE_API_BASE);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      throw new Error(`Subnet core API responded with ${res.status}`);
    }

    const payload = (await res.json()) as T;
    cache.set(cacheKey, { data: payload, timestamp: Date.now() });
    return payload;
  } catch (error) {
    console.error(`Subnet core envelope fetch failed for ${path}:`, error);
    if (cached) {
      return cached.data as T;
    }
    return null;
  }
}

export async function getSubnetCoreStats(
  window: TimeWindow = "24h"
): Promise<SubnetCoreStats | null> {
  const data = await fetchFromSubnetCore<SubnetCoreStatsPayload>(
    "/api/network/stats",
    { window },
    `stats:${window}`
  );
  if (!data) return null;

  const activeValidators = toNonNegativeInt(data.activeValidators);
  const activeMiners = toNonNegativeInt(data.activeMiners);
  const dailyAudits = toNonNegativeInt(data.dailyAudits);
  const avgAccuracy = toNormalizedAccuracy(data.avgAccuracy);
  const totalFindingsDiscovered =
    toNonNegativeInt(data.totalFindingsDiscovered) ?? 0;
  const criticalFindingsDiscovered =
    toNonNegativeInt(data.criticalFindingsDiscovered) ?? 0;

  if (
    activeValidators === null ||
    activeMiners === null ||
    dailyAudits === null ||
    avgAccuracy === null
  ) {
    return null;
  }

  return {
    activeValidators,
    activeMiners,
    dailyAudits,
    avgAccuracy,
    totalFindingsDiscovered,
    criticalFindingsDiscovered,
  };
}

export async function getSubnetCoreLeaderboard(
  timeRange: TimeWindow = "30d",
  limit = 100
): Promise<SubnetCoreLeaderboardEntry[]> {
  const rows = await fetchFromSubnetCore<unknown[]>(
    "/api/leaderboard",
    { timeRange, limit },
    `leaderboard:${timeRange}:${limit}`
  );
  if (!rows) return [];

  return rows.map((row, index) => {
    const entry = row as Record<string, unknown>;
    const avgAccuracyRaw = Number(entry.avgAccuracy);
    const avgAccuracy = Number.isFinite(avgAccuracyRaw) ? avgAccuracyRaw : null;

    return {
      rank: toNonNegativeInt(entry.rank) ?? index + 1,
      minerUid: toNonNegativeInt(entry.minerUid) ?? 0,
      totalRewards: toNumber(entry.totalRewards, 0),
      avgReward: toNormalizedAccuracy(entry.avgReward) ?? 0,
      participationCount: toNonNegativeInt(entry.participationCount) ?? 0,
      successRate: parsePercentage(entry.successRate),
      avgAccuracy,
      findingsDiscovered: toNonNegativeInt(entry.findingsDiscovered) ?? 0,
      criticalFindings: toNonNegativeInt(entry.criticalFindings) ?? 0,
    };
  });
}

export async function getSubnetCoreNetworkAgents(
  timeRange: TimeWindow = "30d",
  limit = 50
): Promise<SubnetCoreNetworkAgent[]> {
  const rows = await fetchFromSubnetCore<unknown[]>(
    "/api/network/agents",
    { timeRange, limit },
    `agents:${timeRange}:${limit}`
  );
  if (!rows) return [];

  return rows.map((row, index) => {
    const entry = row as Record<string, unknown>;
    const agent =
      typeof entry.agent === "string" && entry.agent.length > 0
        ? entry.agent
        : null;

    return {
      rank: toNonNegativeInt(entry.rank) ?? index + 1,
      minerUid: toNonNegativeInt(entry.minerUid) ?? 0,
      agent,
      benchmark: toNumber(entry.benchmark, 0),
      incentive: toNumber(entry.incentive, 0),
      emission: toNumber(entry.emission, 0),
      consensus: toNumber(entry.consensus, 0),
      findingsDiscovered: toNonNegativeInt(entry.findingsDiscovered) ?? 0,
    };
  });
}

export async function getSubnetCoreThroughput(
  timeRange: TimeWindow = "7d"
): Promise<SubnetCoreThroughputPoint[]> {
  const rows = await fetchFromSubnetCore<unknown[]>(
    "/api/network/throughput",
    { timeRange },
    `throughput:${timeRange}`
  );
  if (!rows) return [];

  return rows.map((row) => {
    const point = row as Record<string, unknown>;
    return {
      timestamp: toStringValue(point.timestamp, new Date().toISOString()),
      completedSessions: toNonNegativeInt(point.completedSessions) ?? 0,
      avgRewardScore: toNormalizedAccuracy(point.avgRewardScore) ?? 0,
    };
  });
}

export async function getSubnetCoreRecentSessions(
  limit = 20,
  skip = 0
): Promise<SubnetCoreSessionsResponse | null> {
  const payload = await fetchEnvelopeFromSubnetCore<{
    data?: SessionPayload[];
    pagination?: PaginationPayload;
  }>(
    "/api/validation/sessions/recent",
    { limit, skip },
    `sessions:${limit}:${skip}`
  );

  if (!payload) return null;
  const sessionsRaw = Array.isArray(payload.data) ? payload.data : [];
  const paginationRaw = payload.pagination ?? {};

  const sessions = sessionsRaw.map((session) => ({
    sessionId: toStringValue(session.sessionId, ""),
    projectId: toStringValue(session.projectId, "") || null,
    projectName: toStringValue(session.projectName, "") || null,
    state: toStringValue(session.state, "pending"),
    timestamp: toStringValue(session.timestamp, new Date().toISOString()),
    sampledMinerCount: toNonNegativeInt(session.sampledMinerCount) ?? 0,
    validatorAddress:
      toStringValue(session.metadata?.validatorAddress, "") || null,
    averageRewardScore:
      toNormalizedAccuracy(session.metrics?.averageRewardScore) ?? 0,
  }));

  return {
    sessions,
    pagination: {
      total: toNonNegativeInt(paginationRaw.total) ?? sessions.length,
      limit: toNonNegativeInt(paginationRaw.limit) ?? limit,
      skip: toNonNegativeInt(paginationRaw.skip) ?? skip,
    },
  };
}

export async function getSubnetCoreSessionStats(
  timeRange: TimeWindow = "24h"
): Promise<SubnetCoreSessionsStats | null> {
  const data = await fetchFromSubnetCore<Record<string, unknown>>(
    "/api/validation/sessions/stats",
    { timeRange },
    `session-stats:${timeRange}`
  );
  if (!data) return null;

  return {
    totalSessions: toNonNegativeInt(data.totalSessions) ?? 0,
    completedSessions: toNonNegativeInt(data.completedSessions) ?? 0,
    failedSessions: toNonNegativeInt(data.failedSessions) ?? 0,
    avgRewardScore: toNormalizedAccuracy(data.avgRewardScore) ?? 0,
    totalMinersQueried: toNonNegativeInt(data.totalMinersQueried) ?? 0,
    avgQueryTime: toNumber(data.avgQueryTime, 0),
  };
}

export async function getSubnetCoreSeverityDistribution(
  timeRange: TimeWindow = "30d"
): Promise<SubnetCoreSeverityDistribution | null> {
  const data = await fetchFromSubnetCore<Record<string, unknown>>(
    "/api/findings/severity-distribution",
    { timeRange },
    `severity:${timeRange}`
  );
  if (!data) return null;

  return {
    criticalCount: toNonNegativeInt(data.criticalCount) ?? 0,
    highCount: toNonNegativeInt(data.highCount) ?? 0,
    mediumCount: toNonNegativeInt(data.mediumCount) ?? 0,
    lowCount: toNonNegativeInt(data.lowCount) ?? 0,
    totalFindings: toNonNegativeInt(data.totalFindings) ?? 0,
  };
}

export async function getSubnetCoreCriticalFindings(
  limit = 50
): Promise<SubnetCoreCriticalFindingEntry[]> {
  const rows = await fetchFromSubnetCore<unknown[]>(
    "/api/findings/critical",
    { limit },
    `critical-findings:${limit}`
  );
  if (!rows) return [];

  return rows.map((row, index) => {
    const entry = row as Record<string, unknown>;
    const findingsRaw = Array.isArray(entry.findings) ? entry.findings : [];

    const findings = findingsRaw.map((finding) => {
      const f = finding as Record<string, unknown>;
      return {
        id: toStringValue(f.id, ""),
        title: toStringValue(f.title, "Unknown Finding"),
        severity: toSeverity(f.severity),
        description: toStringValue(f.description, "") || null,
        codeLocation: toStringValue(f.codeLocation, "") || null,
        remediation: toStringValue(f.remediation, "") || null,
        confidenceScore:
          f.confidenceScore === undefined || f.confidenceScore === null
            ? null
            : toNumber(f.confidenceScore, 0),
      };
    });

    return {
      rank: toNonNegativeInt(entry.rank) ?? index + 1,
      sessionId: toStringValue(entry.sessionId, ""),
      projectId: toStringValue(entry.projectId, "") || null,
      minerUid: toNonNegativeInt(entry.minerUid) ?? 0,
      githubUrl: toStringValue(entry.githubUrl, "") || null,
      rewardScore:
        entry.rewardScore === undefined || entry.rewardScore === null
          ? null
          : toNormalizedAccuracy(entry.rewardScore),
      criticalFindingCount: toNonNegativeInt(entry.criticalFindingCount) ?? 0,
      findings,
      timestamp: toStringValue(entry.timestamp, new Date().toISOString()),
    };
  });
}

export async function getSubnetCoreSessionFindings(
  sessionId: string
): Promise<SubnetCoreSessionFindings | null> {
  if (!sessionId) return null;

  const data = await fetchFromSubnetCore<Record<string, unknown>>(
    `/api/validation/${encodeURIComponent(sessionId)}/findings`,
    {},
    `session-findings:${sessionId}`
  );
  if (!data) return null;

  const summaryRaw =
    (data.summary as Record<string, unknown> | undefined) ?? {};
  const findingsByMinerRaw = Array.isArray(data.findingsByMiner)
    ? data.findingsByMiner
    : [];

  const findingsByMiner = findingsByMinerRaw.map((minerEntry) => {
    const row = minerEntry as Record<string, unknown>;
    const severityRaw =
      (row.severityBreakdown as Record<string, unknown> | undefined) ?? {};
    const findingsRaw = Array.isArray(row.findings) ? row.findings : [];

    const findings = findingsRaw.map((finding) => {
      const f = finding as Record<string, unknown>;
      return {
        id: toStringValue(f.id, ""),
        title: toStringValue(f.title, "Unknown Finding"),
        severity: toSeverity(f.severity),
        description: toStringValue(f.description, "") || null,
        codeLocation: toStringValue(f.codeLocation, "") || null,
        remediation: toStringValue(f.remediation, "") || null,
        confidenceScore:
          f.confidenceScore === undefined || f.confidenceScore === null
            ? null
            : toNumber(f.confidenceScore, 0),
      };
    });

    return {
      minerUid: toNonNegativeInt(row.minerUid) ?? 0,
      githubUrl: toStringValue(row.githubUrl, "") || null,
      findingsCount: toNonNegativeInt(row.findingsCount) ?? 0,
      severityBreakdown: {
        critical: toNonNegativeInt(severityRaw.critical) ?? 0,
        high: toNonNegativeInt(severityRaw.high) ?? 0,
        medium: toNonNegativeInt(severityRaw.medium) ?? 0,
        low: toNonNegativeInt(severityRaw.low) ?? 0,
      },
      findings,
      rewardScore:
        row.rewardScore === undefined || row.rewardScore === null
          ? null
          : toNormalizedAccuracy(row.rewardScore),
      timestamp: toStringValue(row.timestamp, new Date().toISOString()),
    };
  });

  return {
    sessionId: toStringValue(data.sessionId, sessionId),
    projectId: toStringValue(data.projectId, "") || null,
    timestamp: toStringValue(data.timestamp, new Date().toISOString()),
    summary: {
      totalFindings: toNonNegativeInt(summaryRaw.totalFindings) ?? 0,
      criticalFindings: toNonNegativeInt(summaryRaw.criticalFindings) ?? 0,
      minersWithFindings: toNonNegativeInt(summaryRaw.minersWithFindings) ?? 0,
    },
    findingsByMiner,
  };
}

export async function getSubnetCoreValidationSession(
  sessionId: string
): Promise<Record<string, unknown> | null> {
  if (!sessionId) return null;
  return fetchFromSubnetCore<Record<string, unknown>>(
    `/api/validation/${encodeURIComponent(sessionId)}`,
    {},
    `validation-session:${sessionId}`
  );
}

export async function getSubnetCoreMinerHistory(
  minerUid: number,
  limit = 50
): Promise<SubnetCoreMinerHistory | null> {
  if (!Number.isFinite(minerUid) || minerUid < 0) return null;

  const payload = await fetchEnvelopeFromSubnetCore<{
    minerUid?: unknown;
    history?: unknown[];
    stats?: Record<string, unknown>;
  }>(
    `/api/miners/${Math.floor(minerUid)}/history`,
    { limit },
    `miner-history:${Math.floor(minerUid)}:${limit}`
  );
  if (!payload) return null;

  const historyRaw = Array.isArray(payload.history) ? payload.history : [];
  const statsRaw = payload.stats ?? {};

  const history = historyRaw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      sessionId: toStringValue(row.sessionId, ""),
      rewardScore: toNormalizedAccuracy(row.rewardScore) ?? 0,
      findingsCount: toNonNegativeInt(row.findingsCount) ?? 0,
      criticalFindingsCount: toNonNegativeInt(row.criticalFindingsCount) ?? 0,
      accuracy:
        row.accuracy === undefined || row.accuracy === null
          ? null
          : toNormalizedAccuracy(row.accuracy),
      executionTime:
        row.executionTime === undefined || row.executionTime === null
          ? null
          : toNumber(row.executionTime, 0),
      timestamp: toStringValue(row.timestamp, new Date().toISOString()),
      status: toStringValue(row.status, "unknown"),
      githubUrl: toStringValue(row.githubUrl, "") || null,
    };
  });

  return {
    minerUid: toNonNegativeInt(payload.minerUid) ?? Math.floor(minerUid),
    history,
    stats: {
      avgReward: toNormalizedAccuracy(statsRaw.avgReward) ?? 0,
      totalParticipations: toNonNegativeInt(statsRaw.totalParticipations) ?? 0,
      successCount: toNonNegativeInt(statsRaw.successCount) ?? 0,
      failureCount: toNonNegativeInt(statsRaw.failureCount) ?? 0,
      avgAccuracy:
        statsRaw.avgAccuracy === undefined || statsRaw.avgAccuracy === null
          ? null
          : toNormalizedAccuracy(statsRaw.avgAccuracy),
      totalFindingsDiscovered:
        toNonNegativeInt(statsRaw.totalFindingsDiscovered) ?? 0,
      totalCriticalFindings:
        toNonNegativeInt(statsRaw.totalCriticalFindings) ?? 0,
    },
  };
}

export async function getSubnetCoreProjectSummary(
  projectId: string
): Promise<SubnetCoreProjectSummary | null> {
  if (!projectId) return null;

  const data = await fetchFromSubnetCore<Record<string, unknown>>(
    `/api/project/${encodeURIComponent(projectId)}/summary`,
    {},
    `project-summary:${projectId}`
  );
  if (!data) return null;

  const sessionsRaw = Array.isArray(data.sessions) ? data.sessions : [];
  const sessions = sessionsRaw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      sessionId: toStringValue(row.sessionId, ""),
      timestamp: toStringValue(row.timestamp, new Date().toISOString()),
      state: toStringValue(row.state, "unknown"),
      sampledMinerCount: toNonNegativeInt(row.sampledMinerCount) ?? 0,
      avgRewardScore:
        row.avgRewardScore === undefined || row.avgRewardScore === null
          ? null
          : toNormalizedAccuracy(row.avgRewardScore),
      findingsCount: toNonNegativeInt(row.findingsCount) ?? 0,
    };
  });

  return {
    projectId: toStringValue(data.projectId, projectId),
    totalValidationRuns: toNonNegativeInt(data.totalValidationRuns) ?? 0,
    successfulRuns: toNonNegativeInt(data.successfulRuns) ?? 0,
    failedRuns: toNonNegativeInt(data.failedRuns) ?? 0,
    totalMinersQueried: toNonNegativeInt(data.totalMinersQueried) ?? 0,
    avgRewardScore: toNormalizedAccuracy(data.avgRewardScore) ?? 0,
    totalFindingsDiscovered: toNonNegativeInt(data.totalFindingsDiscovered) ?? 0,
    lastRun: toStringValue(data.lastRun, "") || null,
    sessions,
  };
}

export async function getSubnetCoreHealth(): Promise<SubnetCoreHealth | null> {
  const payload = await fetchEnvelopeFromSubnetCore<{
    success?: unknown;
    status?: unknown;
    timestamp?: unknown;
  }>("/api/health", {}, "health");
  if (!payload) return null;

  return {
    success: payload.success === true,
    status: toStringValue(payload.status, "unknown"),
    timestamp: toStringValue(payload.timestamp, new Date().toISOString()),
  };
}
