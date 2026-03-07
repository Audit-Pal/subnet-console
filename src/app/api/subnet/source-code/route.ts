import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SourceCandidate = {
  label: string;
  url: string;
};

const USER_AGENT = "auditpal-subnet-console/1.0";

function normalizeGithubRepoUrl(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.hostname !== "github.com") return null;

    const cleanedPath = url.pathname.replace(/\.git$/, "").replace(/\/+$/, "");
    const parts = cleanedPath.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    return `https://github.com/${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

function buildCandidates(input: string): SourceCandidate[] {
  const candidates: SourceCandidate[] = [];

  try {
    const url = new URL(input);
    if (url.hostname === "github.com") {
      const parts = url.pathname.split("/").filter(Boolean);

      if (parts.length >= 5 && parts[2] === "blob") {
        const owner = parts[0];
        const repo = parts[1].replace(/\.git$/, "");
        const branch = parts[3];
        const filePath = parts.slice(4).join("/");

        candidates.push({
          label: filePath,
          url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`,
        });
      }
    }
  } catch {
    return candidates;
  }

  const repoUrl = normalizeGithubRepoUrl(input);
  if (!repoUrl) return candidates;

  const repo = new URL(repoUrl);
  const [owner, name] = repo.pathname.split("/").filter(Boolean);
  const commonFiles = ["agent.py", "main.py", "miner.py", "src/agent.py"];
  const branches = ["master", "main"];

  for (const branch of branches) {
    for (const file of commonFiles) {
      candidates.push({
        label: file,
        url: `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${file}`,
      });
    }
  }

  return candidates;
}

async function fetchFirstMatch(candidates: SourceCandidate[]) {
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate.url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/plain",
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) continue;

      const text = await response.text();
      if (!text.trim()) continue;

      return {
        path: candidate.label,
        sourceUrl: candidate.url,
        content: text,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "url query parameter is required" }, { status: 400 });
    }

    const candidates = buildCandidates(targetUrl);
    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "Unsupported source URL. Expected a GitHub repo or GitHub file URL." },
        { status: 400 }
      );
    }

    const match = await fetchFirstMatch(candidates);
    if (!match) {
      return NextResponse.json(
        { error: "No readable source file found for this miner URL." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      path: match.path,
      source_url: match.sourceUrl,
      content: match.content,
    });
  } catch (error) {
    console.error("Source code route error:", error);
    return NextResponse.json({ error: "Failed to fetch source code" }, { status: 500 });
  }
}
