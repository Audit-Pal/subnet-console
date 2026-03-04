import { NextResponse } from 'next/server';
import { getSubnetCoreMinerHistory } from '@/lib/backend/subnet-core';

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

        return NextResponse.json({
            miner_uid: minerHistory.minerUid,
            history: minerHistory.history.map((row) => ({
                session_id: row.sessionId,
                reward_score: row.rewardScore,
                findings_count: row.findingsCount,
                critical_findings_count: row.criticalFindingsCount,
                accuracy: row.accuracy,
                execution_time_ms: row.executionTime,
                timestamp: row.timestamp,
                status: row.status,
                github_url: row.githubUrl,
            })),
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

