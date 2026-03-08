import { TaoStatsClient } from '@taostats/sdk';

const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY,
});

const TARGET_NETUID = process.env.NETUID ? parseInt(process.env.NETUID) : 18;

type TaoStatsValue = any;
type TaoStatsRecord = Record<string, any>;

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

interface OverviewData {
    netuid: number;
    block: number;
    active_validators: number;
    active_miners: number;
    total_stake: number;
    emission_per_block: number;
    tempo: number;
    name: string;
    symbol: string;
    timestamp: number;
}

interface ValidatorData {
    uid: TaoStatsValue;
    hotkey: string;
    coldkey: string;
    stake: number;
    trust: number;
    vtrust: number;
    incentive: number;
    emission: number;
    dividends: number;
    last_update: number;
    active: boolean;
}

interface MinerData {
    uid: TaoStatsValue;
    hotkey: string;
    coldkey: string;
    rank: number;
    stake: number;
    trust: number;
    consensus: number;
    incentive: number;
    emission: number;
    last_update: number;
    active: boolean;
    axon: TaoStatsValue;
    version: TaoStatsValue;
}

interface LeaderboardEntry {
    rank: number;
    uid: TaoStatsValue;
    hotkey: string;
    incentive: number;
    trust: number;
    emission: number;
    stake: number;
    last_update: number;
}

const cache: Record<string, CacheEntry<unknown>> = {};
const CACHE_TTL = 120 * 1000; // 2 minutes

const asNumber = (value: TaoStatsValue): number => parseFloat(String(value ?? "0")) || 0;
const asText = (value: TaoStatsValue, fallback = "Unknown"): string => typeof value === "string" ? value : fallback;
const asRecord = (value: TaoStatsValue): TaoStatsRecord | null => (
    value && typeof value === "object" && !Array.isArray(value) ? value as TaoStatsRecord : null
);
const getSS58 = (value: TaoStatsValue): string => asText(asRecord(value)?.ss58, asText(value));

export class TaoStatsService {
    private static async getCached<T>(key: string, fetchFn: () => Promise<T>, validator?: (data: T) => boolean): Promise<T> {
        if (cache[key] && Date.now() - cache[key].timestamp < CACHE_TTL) {
            return cache[key].data as T;
        }

        const data = await fetchFn();

        // Only cache if the data is valid (or if no validator is provided)
        if (!validator || validator(data)) {
            cache[key] = { data, timestamp: Date.now() };
        } else {
            console.warn(`>>> [Backend] Data for ${key} failed validation. Not caching.`);
        }

        return data;
    }

    private static async getMetagraph() {
        return this.getCached('metagraph', async () => {
            console.log(`>>> [Backend] SN${TARGET_NETUID} Fetching Fresh Metagraph`);
            const response = await client.metagraph.getLatest({ netuid: TARGET_NETUID });
            return response.data?.data || [];
        }, (data) => Array.isArray(data) && data.length > 0);
    }

    static async getOverview() {
        return this.getCached('overview', async () => {
            console.log(`>>> [Backend] SN${TARGET_NETUID} Fetching Overview...`);
            const response = await client.subnets.getSubnets({ netuid: TARGET_NETUID });
            const subnets = response.data?.data || [];
            const info = (Array.isArray(subnets) ? subnets[0] : subnets) as TaoStatsRecord | undefined;

            if (!info) throw new Error(`Subnet ${TARGET_NETUID} not found`);

            // Prioritize Alpha Stake for Dynamic Alpha subnets (like SN10)
            let totalStake = asNumber(info.total_alpha_stake ?? info.total_stake) / 1e9;

            // Fallback: If overview stake is 0, calculate it from the metagraph
            if (totalStake === 0) {
                try {
                    const neurons = await this.getMetagraph();
                    totalStake = neurons.reduce((acc: number, n) => {
                        const s = asNumber(n.total_alpha_stake ?? n.alpha_stake ?? n.stake) / 1e9;
                        return acc + s;
                    }, 0);
                } catch (e) {
                    console.error(">>> [Backend] Fallback stake calculation failed:", e);
                }
            }

            return {
                netuid: asNumber(info.netuid) || TARGET_NETUID,
                block: asNumber(info.block_number),
                active_validators: asNumber(info.active_validators),
                active_miners: asNumber(info.active_miners),
                total_stake: totalStake,
                emission_per_block: asNumber(info.emission) / 1e9,
                tempo: asNumber(info.tempo),
                name: asText(info.name, `Subnet ${TARGET_NETUID}`),
                symbol: asText(info.symbol, "τ"),
                timestamp: Date.now() / 1000,
            } satisfies OverviewData;
        }, (data) => data.total_stake > 0);
    }

    static async getValidators() {
        // We don't cache these wrappers individually anymore to ensure they always pull from the fresh shared metagraph
        const neurons = await this.getMetagraph();

        return neurons
            .sort((a, b) => asNumber(b.stake) - asNumber(a.stake))
            .slice(0, 50)
            .map((v) => ({
                uid: v.uid,
                hotkey: getSS58(v.hotkey),
                coldkey: getSS58(v.coldkey),
                stake: asNumber(v.total_alpha_stake ?? v.stake) / 1e9,
                trust: asNumber(v.validator_trust ?? v.trust),
                vtrust: asNumber(v.validator_trust),
                incentive: asNumber(v.incentive),
                emission: asNumber(v.emission) / 1e9,
                dividends: asNumber(v.dividends),
                last_update: asNumber(v.updated) || Date.now() / 1000,
                active: v.active !== false,
            } satisfies ValidatorData));
    }

    static async getMiners() {
        // Need overview for some metadata if needed, but primarily metagraph
        const neurons = await this.getMetagraph();

        return neurons
            .sort((a, b) => asNumber(b.incentive) - asNumber(a.incentive))
            .map((m, index: number) => ({
                uid: m.uid,
                hotkey: getSS58(m.hotkey),
                coldkey: getSS58(m.coldkey),
                rank: index + 1,
                stake: asNumber(m.total_alpha_stake ?? m.stake) / 1e9,
                trust: asNumber(m.trust),
                consensus: asNumber(m.consensus),
                incentive: asNumber(m.incentive),
                emission: asNumber(m.emission) / 1e9,
                last_update: asNumber(m.updated) || Date.now() / 1000,
                active: m.active !== false,
                axon: m.axon || null,
                version: m.axon?.version || 0,
            } satisfies MinerData));
    }

    static async getLeaderboard() {
        const neurons = await this.getMetagraph();

        return neurons
            .sort((a, b) => asNumber(b.incentive) - asNumber(a.incentive))
            .slice(0, 20)
            .map((m, index: number) => ({
                rank: index + 1,
                uid: m.uid,
                hotkey: getSS58(m.hotkey),
                incentive: asNumber(m.incentive),
                trust: asNumber(m.trust),
                emission: asNumber(m.emission) / 1e9,
                stake: asNumber(m.total_alpha_stake ?? m.stake) / 1e9,
                last_update: asNumber(m.updated) || Date.now() / 1000,
            } satisfies LeaderboardEntry));
    }
}
