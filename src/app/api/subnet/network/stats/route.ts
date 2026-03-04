import { NextResponse } from 'next/server';
import { getSubnetCoreStats } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const fetchedAt = new Date().toISOString();
    const source = 'subnet-core:/api/network/stats';

    try {
        const { searchParams } = new URL(request.url);
        const window = (searchParams.get('window') || '24h') as '24h' | '7d' | '30d';
        const stats = await getSubnetCoreStats(window);

        if (!stats) {
            return NextResponse.json(
                {
                    active_validators: 0,
                    active_miners: 0,
                    daily_audits: 0,
                    avg_accuracy: 0,
                    total_findings_discovered: 0,
                    critical_findings_discovered: 0,
                    is_real: false,
                    source,
                    fetched_at: fetchedAt,
                    window,
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            active_validators: stats.activeValidators,
            active_miners: stats.activeMiners,
            daily_audits: stats.dailyAudits,
            avg_accuracy: stats.avgAccuracy,
            total_findings_discovered: stats.totalFindingsDiscovered,
            critical_findings_discovered: stats.criticalFindingsDiscovered,
            is_real: true,
            source,
            fetched_at: fetchedAt,
            window,
        });
    } catch (error) {
        console.error('Network stats route error:', error);
        return NextResponse.json(
            {
                active_validators: 0,
                active_miners: 0,
                daily_audits: 0,
                avg_accuracy: 0,
                total_findings_discovered: 0,
                critical_findings_discovered: 0,
                is_real: false,
                source,
                fetched_at: fetchedAt,
                window: '24h',
            },
            { status: 200 }
        );
    }
}
