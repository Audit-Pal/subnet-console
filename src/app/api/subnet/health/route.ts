import { NextResponse } from 'next/server';
import { getSubnetCoreHealth } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const health = await getSubnetCoreHealth();

        if (!health) {
            return NextResponse.json(
                {
                    success: false,
                    status: 'unavailable',
                    timestamp: new Date().toISOString(),
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            success: health.success,
            status: health.status,
            timestamp: health.timestamp,
        });
    } catch (error) {
        console.error('Health route error:', error);
        return NextResponse.json(
            {
                success: false,
                status: 'error',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    }
}

