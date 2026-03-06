import { NextResponse } from "next/server";
import { getRandomSCAProject } from "@/lib/scabench-data";

/**
 * GET /api/subnet/challenge/random
 * Returns a random SCABench challenge (project metadata + vulnerability titles).
 * Full descriptions are stripped so validators must do real analysis work.
 */
export async function GET() {
    try {
        const project = await getRandomSCAProject();

        return NextResponse.json({
            project_id: project.project_id,
            name: project.name,
            platform: project.platform,
            codebases: project.codebases,
            vulnerability_count: project.vulnerabilities.length,
            // Only expose titles + severity (not full descriptions) as the "challenge question"
            vuln_titles: project.vulnerabilities.map(v => ({
                finding_id: v.finding_id,
                severity: v.severity,
                title: v.title,
            })),
        });
    } catch (error) {
        console.error("[challenge/random] Error:", error);
        return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 });
    }
}
