// pesReflections.core — pure, dependency-free helpers for publishing G_5.2
// authored reflections to the P-E-S site. Split from pesReflections.ts (which owns
// fetch + import.meta.env) so the mapping logic stays node-testable
// (see pesReflections.core.test.mjs).
//
// Wire contract: the G_5.2 dashboard server exposes
//   GET /api/artifacts?status=publishing_ready  ->  AuthoredArtifact[]
// where each artifact has { id, title, body, status, metadata{ publishingReadyAt?,
// revisionDate?, createdAt?, provider? } }. Only operator-approved
// `publishing_ready` artifacts are published; the governed (disciplined) voice is
// enforced upstream by the G_5.2 reflection prompts, not here.

export function buildArtifactsUrl(base) {
  const clean = String(base ?? "").trim().replace(/\/+$/, "");
  return `${clean}/api/artifacts?status=publishing_ready`;
}

function pickDate(meta) {
  return meta?.publishingReadyAt ?? meta?.revisionDate ?? meta?.createdAt ?? "";
}

/** Map AuthoredArtifact[] -> display reflections; drop invalid, newest first. */
export function mapArtifactsToReflections(artifacts) {
  if (!Array.isArray(artifacts)) return [];
  return artifacts
    .filter(
      (a) =>
        a &&
        typeof a.title === "string" &&
        a.title.trim() &&
        typeof a.body === "string" &&
        a.body.trim() &&
        (a.status === undefined || a.status === "publishing_ready")
    )
    .map((a) => ({
      id: String(a.id ?? ""),
      title: a.title.trim(),
      body: a.body,
      date: pickDate(a.metadata),
      provider: a.metadata?.provider ?? null,
    }))
    .sort((x, y) => (y.date || "").localeCompare(x.date || ""));
}
