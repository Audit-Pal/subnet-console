import { NextResponse } from 'next/server';
import { getSubnetCoreThroughput } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = (searchParams.get('timeRange') || '7d') as '24h' | '7d' | '30d';

        const series = await getSubnetCoreThroughput(timeRange);
        if (series.length > 0) {
            return NextResponse.json(
                series.map((point) => ({
                    timestamp: point.timestamp,
                    completed_sessions: point.completedSessions,
                    avg_reward_score: point.avgRewardScore,
                }))
            );
        }

        return NextResponse.json([]);
    } catch (error) {
        console.error('Network throughput route error:', error);
        return NextResponse.json([], { status: 200 });
    }
}
