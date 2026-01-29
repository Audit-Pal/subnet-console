import { TaoStatsClient } from '@taostats/sdk';

const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY,
});

const TARGET_NETUID = process.env.NETUID ? parseInt(process.env.NETUID) : 18;

// In-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 120 * 1000; // 2 minutes

export class TaoStatsService {
    private static async getCached(key: string, fetchFn: () => Promise<any>) {
        if (cache[key] && Date.now() - cache[key].timestamp < CACHE_TTL) {
            return cache[key].data;
        }

        const data = await fetchFn();
        cache[key] = { data, timestamp: Date.now() };
        return data;
    }

    private static async getMetagraph() {
        return this.getCached('metagraph', async () => {
            console.log(`>>> [Backend] SN${TARGET_NETUID} Fetching Fresh Metagraph`);
            const response = await client.metagraph.getLatest({ netuid: TARGET_NETUID });
            return response.data?.data || [];
        });
    }

    static async getOverview() {
        return this.getCached('overview', async () => {
            console.log(`>>> [Backend] SN${TARGET_NETUID} Fetching Overview...`);
            const response = await client.subnets.getSubnets({ netuid: TARGET_NETUID });
            const subnets = response.data?.data || [];
            const info = (Array.isArray(subnets) ? subnets[0] : subnets) as any;

            if (!info) throw new Error(`Subnet ${TARGET_NETUID} not found`);

            // Prioritize Alpha Stake for Dynamic Alpha subnets (like SN10)
            let totalStake = parseFloat(info.total_alpha_stake || info.total_stake || "0") / 1e9;

            // Fallback: If overview stake is 0, calculate it from the metagraph
            if (totalStake === 0) {
                try {
                    const neurons = await this.getMetagraph();
                    totalStake = neurons.reduce((acc: number, n: any) => {
                        const s = parseFloat(n.total_alpha_stake || n.alpha_stake || n.stake || "0") / 1e9;
                        return acc + s;
                    }, 0);
                } catch (e) {
                    console.error(">>> [Backend] Fallback stake calculation failed:", e);
                }
            }

            return {
                netuid: info.netuid || TARGET_NETUID,
                block: info.block_number || 0,
                active_validators: info.active_validators || 0,
                active_miners: info.active_miners || 0,
                total_stake: totalStake,
                emission_per_block: parseFloat(info.emission || "0") / 1e9,
                tempo: info.tempo || 0,
                name: info.name || `Subnet ${TARGET_NETUID}`,
                symbol: info.symbol || "τ",
                timestamp: Date.now() / 1000,
            };
        });
    }

    static async getValidators() {
        // We don't cache these wrappers individually anymore to ensure they always pull from the fresh shared metagraph
        const neurons = await this.getMetagraph();

        return neurons
            .sort((a: any, b: any) => parseFloat(b.stake || "0") - parseFloat(a.stake || "0"))
            .slice(0, 50)
            .map((v: any) => ({
                uid: v.uid,
                hotkey: v.hotkey?.ss58 || v.hotkey || "Unknown",
                coldkey: v.coldkey?.ss58 || v.coldkey || "Unknown",
                stake: parseFloat(v.total_alpha_stake || v.stake || "0") / 1e9,
                trust: parseFloat(v.validator_trust || v.trust || "0"),
                vtrust: parseFloat(v.validator_trust || "0"),
                incentive: parseFloat(v.incentive || "0"),
                emission: parseFloat(v.emission || "0") / 1e9,
                dividends: parseFloat(v.dividends || "0"),
                last_update: v.last_update || Date.now() / 1000,
                active: v.active !== false,
            }));
    }

    static async getMiners() {
        // Need overview for some metadata if needed, but primarily metagraph
        const neurons = await this.getMetagraph();

        return neurons
            .sort((a: any, b: any) => parseFloat(b.incentive || "0") - parseFloat(a.incentive || "0"))
            .map((m: any, index: number) => ({
                uid: m.uid,
                hotkey: m.hotkey?.ss58 || m.hotkey || "Unknown",
                coldkey: m.coldkey?.ss58 || m.coldkey || "Unknown",
                rank: index + 1,
                stake: parseFloat(m.total_alpha_stake || m.stake || "0") / 1e9,
                trust: parseFloat(m.trust || "0"),
                consensus: parseFloat(m.consensus || "0"),
                incentive: parseFloat(m.incentive || "0"),
                emission: parseFloat(m.emission || "0") / 1e9,
                last_update: m.last_update || Date.now() / 1000,
                active: m.active !== false,
                axon: m.axon || null,
                version: m.prometheus_info?.version || m.version || 0,
            }));
    }

    static async getLeaderboard() {
        const neurons = await this.getMetagraph();

        return neurons
            .sort((a: any, b: any) => parseFloat(b.incentive || "0") - parseFloat(a.incentive || "0"))
            .slice(0, 20)
            .map((m: any, index: number) => ({
                rank: index + 1,
                uid: m.uid,
                hotkey: m.hotkey?.ss58 || m.hotkey || "Unknown",
                incentive: parseFloat(m.incentive || "0"),
                trust: parseFloat(m.trust || "0"),
                emission: parseFloat(m.emission || "0") / 1e9,
                stake: parseFloat(m.total_alpha_stake || m.stake || "0") / 1e9,
                last_update: m.last_update || Date.now() / 1000,
            }));
    }
}
