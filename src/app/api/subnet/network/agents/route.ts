import { NextResponse } from 'next/server';
import { getSubnetCoreNetworkAgents } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = (searchParams.get('timeRange') || '30d') as '24h' | '7d' | '30d';
        const limit = Math.min(Math.max(Number(searchParams.get('limit') || 50), 1), 200);

        const agents = await getSubnetCoreNetworkAgents(timeRange, limit);
        return NextResponse.json(
            agents.map((agent) => ({
                rank: agent.rank,
                miner_uid: agent.minerUid,
                agent: agent.agent,
                benchmark: agent.benchmark,
                incentive: agent.incentive,
                emission: agent.emission,
                consensus: agent.consensus,
                findings_discovered: agent.findingsDiscovered,
            }))
        );
    } catch (error) {
        console.error('Network agents route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
