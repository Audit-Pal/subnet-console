import { NextResponse } from 'next/server';
import { getSubnetCoreSeverityDistribution } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = (searchParams.get('timeRange') || '30d') as '24h' | '7d' | '30d';
        const distribution = await getSubnetCoreSeverityDistribution(timeRange);

        if (!distribution) {
            return NextResponse.json({
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                total: 0,
                is_real: false,
                time_range: timeRange,
            });
        }

        return NextResponse.json({
            critical: distribution.criticalCount,
            high: distribution.highCount,
            medium: distribution.mediumCount,
            low: distribution.lowCount,
            total: distribution.totalFindings,
            is_real: true,
            time_range: timeRange,
        });
    } catch (error) {
        console.error('Severity distribution route error:', error);
        return NextResponse.json({
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            total: 0,
            is_real: false,
            time_range: '30d',
        });
    }
}

