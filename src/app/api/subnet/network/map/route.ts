import { NextResponse } from 'next/server';
import { getSubnetCoreNetworkAgents } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const agents = await getSubnetCoreNetworkAgents('30d', 30);
        const mappedNodes = agents.map((agent) => {
            const hashSeed = String(agent.minerUid) + (agent.agent ?? '');
            const hash = hashSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            return {
                id: agent.minerUid,
                label: `NODE_${agent.minerUid}`,
                lat: ((hash % 140) - 70),
                lng: ((hash % 360) - 180),
                status: 'online',
                type: 'miner'
            };
        });

        return NextResponse.json(mappedNodes);
    } catch (error) {
        console.error('Failed to fetch network map:', error);
        return NextResponse.json({ error: 'Failed to fetch network map' }, { status: 500 });
    }
}
