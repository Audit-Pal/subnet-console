import { NextResponse } from 'next/server';
import { getSubnetCoreStats } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const coreStats = await getSubnetCoreStats();
        const netuid = process.env.NETUID ? parseInt(process.env.NETUID, 10) : 310;

        return NextResponse.json({
            netuid,
            block: 0,
            active_validators: coreStats?.activeValidators ?? 0,
            active_miners: coreStats?.activeMiners ?? 0,
            total_stake: 0,
            emission_per_block: 0,
            tempo: 0,
            name: `Subnet ${netuid}`,
            symbol: "τ",
            timestamp: Date.now() / 1000,
        });
    } catch (error) {
        console.error("Overview Route Error:", error);

        const netuid = process.env.NETUID ? parseInt(process.env.NETUID, 10) : 310;
        return NextResponse.json({
            netuid,
            block: 0,
            active_validators: 0,
            active_miners: 0,
            total_stake: 0,
            emission_per_block: 0,
            tempo: 0,
            name: `Subnet ${netuid}`,
            symbol: "τ",
            timestamp: Date.now() / 1000,
        });

    }
}
