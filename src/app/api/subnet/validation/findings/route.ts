import { NextResponse } from 'next/server';
import { getSubnetCoreSessionFindings } from '@/lib/backend/subnet-core';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'sessionId query parameter is required' },
                { status: 400 }
            );
        }

        const findings = await getSubnetCoreSessionFindings(sessionId);
        if (!findings) {
            return NextResponse.json(
                { error: 'Session findings not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            session_id: findings.sessionId,
            project_id: findings.projectId,
            timestamp: findings.timestamp,
            summary: {
                total_findings: findings.summary.totalFindings,
                critical_findings: findings.summary.criticalFindings,
                miners_with_findings: findings.summary.minersWithFindings,
            },
            findings_by_miner: findings.findingsByMiner.map((row) => ({
                miner_uid: row.minerUid,
                github_url: row.githubUrl,
                findings_count: row.findingsCount,
                severity_breakdown: row.severityBreakdown,
                findings: row.findings,
                reward_score: row.rewardScore,
                timestamp: row.timestamp,
            })),
        });
    } catch (error) {
        console.error('Session findings route error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session findings' },
            { status: 500 }
        );
    }
}

