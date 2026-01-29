export interface SubnetOverview {
    netuid: number;
    block: number;
    active_validators: number;
    active_miners: number;
    total_stake: number;
    emission_per_block: number;
    timestamp: number;
    name?: string;
    symbol?: string;
}

export interface Validator {
    uid: number;
    hotkey: string;
    stake: number;
    incentive: number;
    emission: number;
    last_update: number;
    rank?: number; // Helpers for UI
    trust: number;
    status?: string;
    name?: string;
}

export interface Miner {
    uid: number;
    hotkey: string;
    rank: number;
    trust: number;
    incentive: number;
    last_update: number;
    // UI Helpers
    name?: string;
    version?: string;
    wins?: number;
    attempts?: number;
    winRate?: number;
    category?: string;
    earnings?: string;
}

export interface TopMiner {
    uid: number;
    score: number;
}

export interface SubnetPerformance {
    average_accuracy: number;
    audits_last_24h: number;
    top_miners: TopMiner[];
}

export interface Vulnerability {
    id: string;
    title: string;
    severity: string;
    line: number;
    impact: string;
    description: string;
    recommendation: string;
}

export interface Audit {
    id: string;
    name: string;
    status: string;
    score: number;
    created_at: number;
    miner_hotkey: string;
    findings_count: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
    vulnerabilities: Vulnerability[];
    code?: string; // Optional code field
}
