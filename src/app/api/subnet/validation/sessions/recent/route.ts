import { NextResponse } from 'next/server';
import { getSubnetCoreRecentSessions } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitRaw = parseInt(searchParams.get('limit') || '50', 10);
        const skipRaw = parseInt(searchParams.get('skip') || '0', 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 50;
        const skip = Number.isFinite(skipRaw) ? Math.max(skipRaw, 0) : 0;

        const recent = await getSubnetCoreRecentSessions(limit, skip);
        if (!recent) {
            return NextResponse.json({
                sessions: [],
                pagination: { total: 0, limit, skip },
                is_real: false,
            });
        }

        return NextResponse.json({
            sessions: recent.sessions.map((session) => ({
                session_id: session.sessionId,
                project_id: session.projectId,
                project_name: session.projectName,
                state: session.state,
                timestamp: session.timestamp,
                sampled_miner_count: session.sampledMinerCount,
                validator_address: session.validatorAddress,
                avg_reward_score: session.averageRewardScore,
            })),
            pagination: recent.pagination,
            is_real: true,
        });
    } catch (error) {
        console.error('Recent validation sessions route error:', error);
        return NextResponse.json({
            sessions: [],
            pagination: { total: 0, limit: 50, skip: 0 },
            is_real: false,
        });
    }
}
