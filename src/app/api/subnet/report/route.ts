import { NextRequest, NextResponse } from "next/server";
import { getSCABaselineReport } from "@/lib/scabench-data";

/**
 * GET /api/subnet/report?project_id=xxx
 * Returns the pre-computed GPT-5 baseline report for a given project_id.
 * This is the "answer" that validators submit their reports against.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");

    if (!project_id) {
        return NextResponse.json(
            { error: "Missing required query param: project_id" },
            { status: 400 }
        );
    }

    try {
        const report = await getSCABaselineReport(project_id);

        if (!report) {
            return NextResponse.json(
                { error: `No baseline report found for project_id: ${project_id}` },
                { status: 404 }
            );
        }

        return NextResponse.json(report);
    } catch (error) {
        console.error(`[report] Error for project_id=${project_id}:`, error);
        return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
    }
}
