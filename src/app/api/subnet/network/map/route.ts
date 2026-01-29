import { NextResponse } from 'next/server';
import { TaoStatsService } from '@/lib/backend/taostats';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const miners = await TaoStatsService.getMiners();

        // Generate pseudo-geographic coordinates based on Hotkey hash
        // This makes the nodes spread across the "Global Scale" globe
        const mappedNodes = miners.slice(0, 30).map((m: any) => {
            const hash = m.hotkey.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

            return {
                id: m.uid,
                label: `NODE_${m.uid}`,
                lat: ((hash % 140) - 70), // Spread across latitudes
                lng: ((hash % 360) - 180), // Spread across longitudes
                status: 'online',
                type: m.incentive > 0 ? 'miner' : 'validator'
            };
        });

        return NextResponse.json(mappedNodes);
    } catch (error) {
        console.error('Failed to fetch network map:', error);
        return NextResponse.json({ error: 'Failed to fetch network map' }, { status: 500 });
    }
}
