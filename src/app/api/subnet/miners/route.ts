import { NextResponse } from 'next/server';
import { TaoStatsService } from '@/lib/backend/taostats';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const miners = await TaoStatsService.getMiners();
        return NextResponse.json(miners);
    } catch (error) {
        console.error("Miners Route Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
