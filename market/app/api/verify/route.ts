import { NextRequest, NextResponse } from "next/server";

/**
 * GitHub oracle (MVP).
 *
 * POST { prUrl: string }
 * Confirms a pull request is actually MERGED via the GitHub API.
 * This is the objective, hard-to-game verification wedge for Engineering bounties.
 *
 * In production this route should:
 *   1. Look up the application + bounty from the DB (service-role key, server-side).
 *   2. Check the PR is merged AND belongs to the bounty's repo.
 *   3. Sign a release authorization for the on-chain escrow program (see ARCHITECTURE.md).
 * For now it just returns the verified state so the flow can be wired end-to-end.
 */
export async function POST(req: NextRequest) {
  let prUrl: string;
  try {
    ({ prUrl } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Expect https://github.com/{owner}/{repo}/pull/{number}
  const m = prUrl?.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!m) {
    return NextResponse.json(
      { error: "Provide a GitHub PR url: https://github.com/owner/repo/pull/123" },
      { status: 400 }
    );
  }
  const [, owner, repo, number] = m;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "solward-oracle",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
    { headers, cache: "no-store" }
  );

  if (res.status === 404) {
    return NextResponse.json({ verified: false, reason: "PR not found" }, { status: 404 });
  }
  if (!res.ok) {
    return NextResponse.json(
      { verified: false, reason: `GitHub API error ${res.status}` },
      { status: 502 }
    );
  }

  const pr = await res.json();
  const verified = Boolean(pr.merged);

  return NextResponse.json({
    verified,
    merged_at: pr.merged_at ?? null,
    merged_by: pr.merged_by?.login ?? null,
    title: pr.title ?? null,
    reason: verified ? "PR is merged" : "PR is not merged yet",
  });
}
