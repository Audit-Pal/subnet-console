import { NextResponse } from 'next/server';
import { getSubnetCoreRecentSessions } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const coreSessions = await getSubnetCoreRecentSessions(10, 0);
        const audits = (coreSessions?.sessions || []).map((session) => ({
            id: session.sessionId,
            name: session.projectName || session.projectId || `SESSION_${session.sessionId.slice(0, 6)}`,
            score: session.averageRewardScore,
            timestamp: session.timestamp,
            status: session.state,
            created_at: Math.floor(new Date(session.timestamp).getTime() / 1000),
            miner_hotkey: "",
            findings_count: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                info: 0
            },
            vulnerabilities: []
        }));

        return NextResponse.json(audits);
    } catch (error) {
        console.error('Failed to fetch recent audits:', error);
        return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 });
    }
}
