import { NextResponse } from 'next/server';
import { getSubnetCoreProjectSummary } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json(
                { error: 'projectId query parameter is required' },
                { status: 400 }
            );
        }

        const summary = await getSubnetCoreProjectSummary(projectId);
        if (!summary) {
            return NextResponse.json(
                { error: 'Project summary not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            project_id: summary.projectId,
            total_validation_runs: summary.totalValidationRuns,
            successful_runs: summary.successfulRuns,
            failed_runs: summary.failedRuns,
            total_miners_queried: summary.totalMinersQueried,
            avg_reward_score: summary.avgRewardScore,
            total_findings_discovered: summary.totalFindingsDiscovered,
            last_run: summary.lastRun,
            sessions: summary.sessions.map((session) => ({
                session_id: session.sessionId,
                timestamp: session.timestamp,
                state: session.state,
                sampled_miner_count: session.sampledMinerCount,
                avg_reward_score: session.avgRewardScore,
                findings_count: session.findingsCount,
            })),
        });
    } catch (error) {
        console.error('Project summary route error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project summary' },
            { status: 500 }
        );
    }
}

