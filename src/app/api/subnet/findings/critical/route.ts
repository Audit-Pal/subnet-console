import { NextResponse } from 'next/server';
import { getSubnetCoreCriticalFindings } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitRaw = parseInt(searchParams.get('limit') || '50', 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 50;

        const criticalFindings = await getSubnetCoreCriticalFindings(limit);
        return NextResponse.json(criticalFindings.map((entry) => ({
            rank: entry.rank,
            session_id: entry.sessionId,
            project_id: entry.projectId,
            miner_uid: entry.minerUid,
            github_url: entry.githubUrl,
            reward_score: entry.rewardScore,
            critical_finding_count: entry.criticalFindingCount,
            findings: entry.findings,
            timestamp: entry.timestamp,
        })));
    } catch (error) {
        console.error('Critical findings route error:', error);
        return NextResponse.json([], { status: 200 });
    }
}

