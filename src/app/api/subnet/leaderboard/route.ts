import { NextResponse } from 'next/server';
import { TaoStatsService } from '@/lib/backend/taostats';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const leaderboard = await TaoStatsService.getLeaderboard();
        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Route Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
