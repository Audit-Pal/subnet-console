import { NextResponse } from 'next/server';
import { getSubnetCoreLeaderboard } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const coreLeaderboard = await getSubnetCoreLeaderboard('30d', 100);
        const now = Math.floor(Date.now() / 1000);
        return NextResponse.json(
            coreLeaderboard.map((entry) => ({
                rank: entry.rank,
                uid: entry.minerUid,
                hotkey: `MINER_${entry.minerUid}`,
                stake: entry.totalRewards,
                trust: entry.avgAccuracy ?? 0,
                incentive: entry.avgReward,
                emission: entry.participationCount,
                last_update: now,
                success_rate: entry.successRate,
                findings_discovered: entry.findingsDiscovered,
                critical_findings: entry.criticalFindings,
            }))
        );
    } catch (error) {
        console.error("Leaderboard Route Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
