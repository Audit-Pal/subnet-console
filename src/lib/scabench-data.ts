/**
 * SCABench Data Layer
 * Data sourced from: https://github.com/scabench-org/scabench
 * Dataset: curated-2025-08-18 (31 projects, 555 vulnerabilities)
 */

const DATASET_BASE = "https://raw.githubusercontent.com/scabench-org/scabench/main/datasets/curated-2025-08-18";
const CURATED_URL = `${DATASET_BASE}/curated-2025-08-18.json`;

export interface SCAVulnerability {
    finding_id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
}

export interface SCACodebase {
    codebase_id: string;
    repo_url: string;
    commit: string;
    tree_url?: string;
    tarball_url?: string;
}

export interface SCAProject {
    project_id: string;
    name: string;
    platform: 'code4rena' | 'cantina' | 'sherlock';
    codebases: SCACodebase[];
    vulnerabilities: SCAVulnerability[];
}

export interface SCABaslineFinding {
    title: string;
    description: string;
    severity: string;
    confidence: number;
    location: string;
    file: string;
}

export interface SCABaselineReport {
    project: string;
    files_analyzed: number;
    total_findings: number;
    findings: SCABaslineFinding[];
}

// Simple in-memory cache to avoid re-fetching
let _projectsCache: SCAProject[] | null = null;

export async function getSCAProjects(): Promise<SCAProject[]> {
    if (_projectsCache) return _projectsCache;
    const res = await fetch(CURATED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch SCABench curated dataset");
    _projectsCache = await res.json() as SCAProject[];
    return _projectsCache;
}

export async function getRandomSCAProject(): Promise<SCAProject> {
    const projects = await getSCAProjects();
    const idx = Math.floor(Math.random() * projects.length);
    return projects[idx];
}

export async function getSCAProjectById(project_id: string): Promise<SCAProject | undefined> {
    const projects = await getSCAProjects();
    return projects.find(p => p.project_id === project_id);
}

export async function getSCABaselineReport(project_id: string): Promise<SCABaselineReport | null> {
    const url = `${DATASET_BASE}/baseline-results/baseline_${project_id}.json`;
    try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return await res.json() as SCABaselineReport;
    } catch {
        return null;
    }
}
