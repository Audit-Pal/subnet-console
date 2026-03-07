import { NextResponse } from 'next/server';
import { getSubnetCoreMinerHistory, getSubnetCoreValidationSession } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const minerUidRaw = parseInt(searchParams.get('minerUid') || '', 10);
        const limitRaw = parseInt(searchParams.get('limit') || '50', 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

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

        const uniqueSessionIds = Array.from(
            new Set(minerHistory.history.map((row) => row.sessionId).filter(Boolean))
        );

        const validatorEntries = await Promise.all(
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
        );

        const validatorBySession = new Map<string, string | null>(validatorEntries);

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

        for (const row of minerHistory.history) {
            const sessionId = row.sessionId;
            const validatorAddress = validatorBySession.get(sessionId) ?? null;

            const existing = sessionGroups.get(sessionId);
            const validatorData = {
                address: validatorAddress,
                reward_score: row.rewardScore,
                accuracy: row.accuracy,
                findings_count: row.findingsCount,
                critical_findings_count: row.criticalFindingsCount,
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

        return NextResponse.json({
            miner_uid: minerHistory.minerUid,
            history: Array.from(sessionGroups.values()).map((group) => {
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
            }),
            stats: {
                avg_reward: minerHistory.stats.avgReward,
                total_participations: minerHistory.stats.totalParticipations,
                success_count: minerHistory.stats.successCount,
                failure_count: minerHistory.stats.failureCount,
                avg_accuracy: minerHistory.stats.avgAccuracy,
                total_findings_discovered: minerHistory.stats.totalFindingsDiscovered,
                total_critical_findings: minerHistory.stats.totalCriticalFindings,
            },
        });
    } catch (error) {
        console.error('Miner history route error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch miner history' },
            { status: 500 }
        );
    }
}
