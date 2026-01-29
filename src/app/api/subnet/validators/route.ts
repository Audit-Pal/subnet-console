import { NextResponse } from 'next/server';
import { TaoStatsService } from '@/lib/backend/taostats';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const validators = await TaoStatsService.getValidators();
        return NextResponse.json(validators);
    } catch (error) {
        console.error("Validators Route Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
