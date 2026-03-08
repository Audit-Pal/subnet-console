import { NextResponse } from 'next/server';
import { getSubnetCoreNetworkAgents } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const now = Math.floor(Date.now() / 1000);
        const { searchParams } = new URL(request.url);
        const timeRange = (searchParams.get('timeRange') || '30d') as '24h' | '7d' | '30d';
        const agents = await getSubnetCoreNetworkAgents(timeRange, 200);
        const miners = agents.map((agent) => ({
            uid: agent.minerUid,
            hotkey: agent.agent || `MINER_${agent.minerUid}`,
            coldkey: "N/A",
            rank: agent.rank,
            stake: agent.incentive,
            trust: Math.max(0, Math.min(1, agent.consensus / 100)),
            consensus: Math.max(0, Math.min(1, agent.consensus / 100)),
            incentive: Math.max(0, Math.min(1, agent.benchmark / 100)),
            emission: agent.incentive,
            last_update: now,
            active: true,
            axon: null,
            version: 0,
        }));
        return NextResponse.json(miners);
    } catch (error) {
        console.error("Miners Route Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
