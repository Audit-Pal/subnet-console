import { NextResponse } from 'next/server';
import { getSubnetCoreSessionStats } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = (searchParams.get('timeRange') || '24h') as '24h' | '7d' | '30d';
        const stats = await getSubnetCoreSessionStats(timeRange);

        if (!stats) {
            return NextResponse.json({
                total_sessions: 0,
                completed_sessions: 0,
                failed_sessions: 0,
                avg_reward_score: 0,
                total_miners_queried: 0,
                avg_query_time_ms: 0,
                is_real: false,
                time_range: timeRange,
            });
        }

        return NextResponse.json({
            total_sessions: stats.totalSessions,
            completed_sessions: stats.completedSessions,
            failed_sessions: stats.failedSessions,
            avg_reward_score: stats.avgRewardScore,
            total_miners_queried: stats.totalMinersQueried,
            avg_query_time_ms: stats.avgQueryTime,
            is_real: true,
            time_range: timeRange,
        });
    } catch (error) {
        console.error('Validation session stats route error:', error);
        return NextResponse.json({
            total_sessions: 0,
            completed_sessions: 0,
            failed_sessions: 0,
            avg_reward_score: 0,
            total_miners_queried: 0,
            avg_query_time_ms: 0,
            is_real: false,
            time_range: '24h',
        });
    }
}

