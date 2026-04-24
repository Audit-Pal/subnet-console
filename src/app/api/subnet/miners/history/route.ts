import { NextResponse } from 'next/server';
import { getSubnetCoreMinerHistory, getSubnetCoreSessionFindings, getSubnetCoreValidationSession } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

type TimeRange = '24h' | '7d' | '30d';

function getWindowStart(now: Date, timeRange: TimeRange): number {
    const current = now.getTime();
    if (timeRange === '24h') return current - (24 * 60 * 60 * 1000);
    if (timeRange === '7d') return current - (7 * 24 * 60 * 60 * 1000);
    return current - (30 * 24 * 60 * 60 * 1000);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const minerUidRaw = parseInt(searchParams.get('minerUid') || '', 10);
        const limitRaw = parseInt(searchParams.get('limit') || '50', 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;
        const timeRange = (searchParams.get('timeRange') || '30d') as TimeRange;

        if (!Number.isFinite(minerUidRaw) || minerUidRaw < 0) {
            return NextResponse.json(
                { error: 'minerUid query parameter must be a non-negative integer' },
                { status: 400 }
            );
        }

        const minerHistory = await getSubnetCoreMinerHistory(minerUidRaw, limit);
        if (!minerHistory) {
            return NextResponse.json(
                { error: 'Miner history not found' },
                { status: 404 }
            );
        }

        const windowStart = getWindowStart(new Date(), timeRange);
        const scopedHistoryRows = minerHistory.history.filter((row) => {
            const rowTs = new Date(row.timestamp).getTime();
            return Number.isFinite(rowTs) && rowTs >= windowStart;
        });

        const uniqueSessionIds = Array.from(
            new Set(scopedHistoryRows.map((row) => row.sessionId).filter(Boolean))
        );

        const [validatorEntries, findingsEntries] = await Promise.all([
            Promise.all(
            uniqueSessionIds.map(async (sessionId) => {
                try {
                    const session = await getSubnetCoreValidationSession(sessionId);
                    const validatorAddress =
                        typeof session?.metadata === 'object' &&
                            session?.metadata !== null &&
                            'validatorAddress' in session.metadata
                            ? (session.metadata as { validatorAddress?: unknown }).validatorAddress
                            : null;

                    return [
                        sessionId,
                        typeof validatorAddress === 'string' && validatorAddress.length > 0
                            ? validatorAddress
                            : null,
                    ] as const;
                } catch {
                    return [sessionId, null] as const;
                }
            })
            ),
            Promise.all(
                uniqueSessionIds.map(async (sessionId) => {
                    try {
                        const findings = await getSubnetCoreSessionFindings(sessionId);
                        const minerFindings = findings?.findingsByMiner.find(
                            (entry) => entry.minerUid === minerUidRaw
                        );

                        if (!minerFindings) {
                            return [sessionId, null] as const;
                        }

                        return [sessionId, {
                            findings_count: minerFindings.findingsCount,
                            critical_findings_count: minerFindings.severityBreakdown.critical,
                        }] as const;
                    } catch {
                        return [sessionId, null] as const;
                    }
                })
            ),
        ]);

        const validatorBySession = new Map<string, string | null>(validatorEntries);
        const findingsBySession = new Map<
            string,
            { findings_count: number; critical_findings_count: number } | null
        >(findingsEntries);

        const sessionGroups = new Map<string, {
            session_id: string;
            timestamp: string;
            status: string;
            github_url: string | null;
            validators: Array<{
                address: string | null;
                reward_score: number;
                accuracy: number | null;
                findings_count: number;
                critical_findings_count: number;
                execution_time_ms: number | null;
            }>;
        }>();

        for (const row of scopedHistoryRows) {
            const sessionId = row.sessionId;
            const validatorAddress = validatorBySession.get(sessionId) ?? null;
            const findingsOverride = findingsBySession.get(sessionId);

            const existing = sessionGroups.get(sessionId);
            const validatorData = {
                address: validatorAddress,
                reward_score: row.rewardScore,
                accuracy: row.accuracy,
                findings_count: findingsOverride?.findings_count ?? row.findingsCount,
                critical_findings_count: findingsOverride?.critical_findings_count ?? row.criticalFindingsCount,
                execution_time_ms: row.executionTime,
            };

            if (existing) {
                existing.validators.push(validatorData);
            } else {
                sessionGroups.set(sessionId, {
                    session_id: sessionId,
                    timestamp: row.timestamp,
                    status: row.status,
                    github_url: row.githubUrl,
                    validators: [validatorData],
                });
            }
        }

        const groupedHistory = Array.from(sessionGroups.values()).map((group) => {
            // Find best validator or use first for summary stats
            const primary = group.validators.reduce((prev, curr) =>
                (curr.reward_score > prev.reward_score) ? curr : prev,
                group.validators[0]
            );

            return {
                ...group,
                reward_score: primary?.reward_score ?? 0,
                findings_count: primary?.findings_count ?? 0,
                critical_findings_count: primary?.critical_findings_count ?? 0,
                accuracy: primary?.accuracy ?? null,
                execution_time_ms: primary?.execution_time_ms ?? null,
                validator_address: primary?.address ?? null,
            };
        });

        const validatorSummaryMap = new Map<string, {
            address: string | null;
            label: string;
            is_resolved: boolean;
            runs: number;
            reward_total: number;
            accuracy_total: number;
            accuracy_count: number;
            findings: number;
            critical: number;
            runtime_total: number;
            runtime_count: number;
            success_count: number;
            failure_count: number;
            other_count: number;
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
        }>();

        let unresolvedValidatorSessions = 0;

        for (const row of groupedHistory) {
            const validatorAddress = row.validator_address;
            const summaryKey = validatorAddress ?? '__unresolved__';

            if (!validatorAddress) {
                unresolvedValidatorSessions += 1;
            }

            const current = validatorSummaryMap.get(summaryKey) || {
                address: validatorAddress,
                label: validatorAddress ?? 'Unresolved Validator',
                is_resolved: Boolean(validatorAddress),
                runs: 0,
                reward_total: 0,
                accuracy_total: 0,
                accuracy_count: 0,
                findings: 0,
                critical: 0,
                runtime_total: 0,
                runtime_count: 0,
                success_count: 0,
                failure_count: 0,
                other_count: 0,
                last_timestamp: row.timestamp,
                sessions: [],
            };

            current.runs += 1;
            current.reward_total += row.reward_score;
            if (typeof row.accuracy === 'number' && Number.isFinite(row.accuracy)) {
                current.accuracy_total += row.accuracy;
                current.accuracy_count += 1;
            }
            current.findings += row.findings_count;
            current.critical += row.critical_findings_count;
            if (typeof row.execution_time_ms === 'number' && Number.isFinite(row.execution_time_ms)) {
                current.runtime_total += row.execution_time_ms;
                current.runtime_count += 1;
            }
            if (row.status === 'success') current.success_count += 1;
            else if (row.status === 'failed') current.failure_count += 1;
            else current.other_count += 1;
            if (new Date(row.timestamp).getTime() > new Date(current.last_timestamp).getTime()) {
                current.last_timestamp = row.timestamp;
            }
            current.sessions.push({
                session_id: row.session_id,
                timestamp: row.timestamp,
                status: row.status,
                reward_score: row.reward_score,
                accuracy: row.accuracy,
                findings_count: row.findings_count,
                critical_findings_count: row.critical_findings_count,
                execution_time_ms: row.execution_time_ms,
            });

            validatorSummaryMap.set(summaryKey, current);
        }

        const validator_summaries = Array.from(validatorSummaryMap.values())
            .map((entry) => ({
                address: entry.address,
                label: entry.label,
                is_resolved: entry.is_resolved,
                runs: entry.runs,
                success_count: entry.success_count,
                failure_count: entry.failure_count,
                other_count: entry.other_count,
                avg_reward: entry.runs > 0 ? entry.reward_total / entry.runs : 0,
                avg_accuracy: entry.accuracy_count > 0 ? entry.accuracy_total / entry.accuracy_count : null,
                findings: entry.findings,
                critical: entry.critical,
                avg_runtime_ms: entry.runtime_count > 0 ? entry.runtime_total / entry.runtime_count : null,
                last_timestamp: entry.last_timestamp,
                sessions: entry.sessions.sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ),
            }))
            .sort((a, b) => {
                if (a.is_resolved !== b.is_resolved) return a.is_resolved ? -1 : 1;
                return b.avg_reward - a.avg_reward;
            });

        const scopedRows = groupedHistory;
        const scopedParticipations = scopedRows.length;
        const scopedSuccessCount = scopedRows.filter((row) => row.status === 'success').length;
        const scopedFailureCount = scopedParticipations - scopedSuccessCount;
        const scopedRewardTotal = scopedRows.reduce((sum, row) => sum + row.reward_score, 0);
        const scopedAccuracyRows = scopedRows.filter(
            (row) => typeof row.accuracy === 'number' && Number.isFinite(row.accuracy)
        );
        const scopedAccuracyTotal = scopedAccuracyRows.reduce(
            (sum, row) => sum + (row.accuracy ?? 0),
            0
        );
        const scopedFindings = scopedRows.reduce((sum, row) => sum + row.findings_count, 0);
        const scopedCriticalFindings = scopedRows.reduce(
            (sum, row) => sum + row.critical_findings_count,
            0
        );

        return NextResponse.json({
            miner_uid: minerHistory.minerUid,
            history: groupedHistory,
            stats: {
                avg_reward: scopedParticipations > 0 ? scopedRewardTotal / scopedParticipations : 0,
                total_participations: scopedParticipations,
                success_count: scopedSuccessCount,
                failure_count: scopedFailureCount,
                avg_accuracy: scopedAccuracyRows.length > 0 ? scopedAccuracyTotal / scopedAccuracyRows.length : null,
                total_findings_discovered: scopedFindings,
                total_critical_findings: scopedCriticalFindings,
            },
            history_scope: {
                time_range: timeRange,
                fetched_rows: minerHistory.history.length,
                included_rows: scopedHistoryRows.length,
            },
            validator_summary_scope: {
                fetched_sessions: groupedHistory.length,
                total_participations: scopedParticipations,
                unresolved_validator_sessions: unresolvedValidatorSessions,
                is_complete: groupedHistory.length === scopedParticipations,
                attribution_complete: unresolvedValidatorSessions === 0,
                time_range: timeRange,
            },
            validator_summaries,
        });
    } catch (error) {
        console.error('Miner history route error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch miner history' },
            { status: 500 }
        );
    }
}
