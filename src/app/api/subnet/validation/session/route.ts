import { NextResponse } from 'next/server';
import { getSubnetCoreValidationSession } from '@/lib/backend/subnet-core';

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

        const session = await getSubnetCoreValidationSession(sessionId);
        if (!session) {
            return NextResponse.json(
                { error: 'Validation session not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Validation session route error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch validation session' },
            { status: 500 }
        );
    }
}

