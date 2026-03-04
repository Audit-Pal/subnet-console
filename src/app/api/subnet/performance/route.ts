import { NextResponse } from 'next/server';
import { getSubnetCoreStats } from '@/lib/backend/subnet-core';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const coreStats = await getSubnetCoreStats();
        return NextResponse.json({
            average_accuracy: coreStats?.avgAccuracy ?? 0,
            audits_last_24h: coreStats?.dailyAudits ?? 0,
            top_miners: [],
        });
    } catch (error) {
        console.error("Performance route error:", error);
        return NextResponse.json({
            average_accuracy: 0,
            audits_last_24h: 0,
            top_miners: [],
        });
    }
}
