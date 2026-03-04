import { NextResponse } from 'next/server';
import { getSubnetCoreRecentSessions } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const recent = await getSubnetCoreRecentSessions(200, 0);
        const sessions = recent?.sessions || [];

        const byValidator = new Map<string, { runs: number; totalScore: number; lastTs: number }>();
        for (const session of sessions) {
            if (!session.validatorAddress) continue;
            const prev = byValidator.get(session.validatorAddress) || {
                runs: 0,
                totalScore: 0,
                lastTs: 0,
            };
            const ts = new Date(session.timestamp).getTime();
            byValidator.set(session.validatorAddress, {
                runs: prev.runs + 1,
                totalScore: prev.totalScore + session.averageRewardScore,
                lastTs: Math.max(prev.lastTs, Number.isNaN(ts) ? 0 : ts),
            });
        }

        const rows = Array.from(byValidator.entries()).sort((a, b) => b[1].runs - a[1].runs);
        const validators = rows.map(([address, stats], index) => ({
            // Activity-first real fields
            validator_address: address,
            sessions_submitted: stats.runs,
            avg_reward_score: Math.max(0, Math.min(1, stats.totalScore / Math.max(stats.runs, 1))),
            last_submission_ts: Math.floor((stats.lastTs || Date.now()) / 1000),

            // Legacy compatibility fields used in older UI pieces
            uid: index + 1,
            hotkey: address,
            coldkey: address,
            stake: stats.runs,
            trust: Math.max(0, Math.min(1, stats.totalScore / Math.max(stats.runs, 1))),
            vtrust: 0,
            incentive: 0,
            emission: stats.runs,
            dividends: 0,
            last_update: Math.floor((stats.lastTs || Date.now()) / 1000),
            active: false,
        }));

        return NextResponse.json(validators);
    } catch (error) {
        console.error("Validators Route Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
