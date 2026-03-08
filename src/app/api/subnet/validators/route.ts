import { NextResponse } from 'next/server';
import { getSubnetCoreRecentSessions } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

type TimeRange = '24h' | '7d' | '30d';
type SessionStateFilter = 'all' | 'completed';

function getWindowStart(now: Date, timeRange: TimeRange): number {
    const current = now.getTime();
    if (timeRange === '24h') return current - (24 * 60 * 60 * 1000);
    if (timeRange === '7d') return current - (7 * 24 * 60 * 60 * 1000);
    return current - (30 * 24 * 60 * 60 * 1000);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = (searchParams.get('timeRange') || '7d') as TimeRange;
        const state = (searchParams.get('state') || 'all') as SessionStateFilter;
        const limitRaw = parseInt(searchParams.get('limit') || '500', 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 500;

        const recent = await getSubnetCoreRecentSessions(limit, 0);
        const allSessions = recent?.sessions || [];
        const windowStart = getWindowStart(new Date(), timeRange);
        const sessions = allSessions.filter((session) => {
            const ts = new Date(session.timestamp).getTime();
            if (Number.isNaN(ts) || ts < windowStart) return false;
            if (state === 'completed') return session.state === 'completed';
            return true;
        });

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
