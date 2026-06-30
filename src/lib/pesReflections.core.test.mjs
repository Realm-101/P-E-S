// Runnable self-check: `node pesReflections.core.test.mjs`. No framework.
import assert from "node:assert/strict";
import {
  buildArtifactsUrl,
  mapArtifactsToReflections,
} from "./pesReflections.core.mjs";

// buildArtifactsUrl: trims trailing slash(es), appends the status filter.
assert.equal(
  buildArtifactsUrl("http://x:5000/"),
  "http://x:5000/api/artifacts?status=publishing_ready"
);
assert.equal(
  buildArtifactsUrl("http://x:5000"),
  "http://x:5000/api/artifacts?status=publishing_ready"
);

// mapArtifactsToReflections: drops empty title/body, sorts newest-first,
// prefers publishingReadyAt for the date, surfaces provider.
const mapped = mapArtifactsToReflections([
  { id: "a", title: "Older", body: "b1", status: "publishing_ready", metadata: { revisionDate: "2026-01-01" } },
  { id: "b", title: "Newer", body: "b2", status: "publishing_ready", metadata: { publishingReadyAt: "2026-06-01", revisionDate: "2026-02-01", provider: "azure:gpt" } },
  { id: "c", title: "   ", body: "x", status: "publishing_ready", metadata: {} },
  { id: "d", title: "NoBody", body: "   ", status: "publishing_ready", metadata: {} },
]);
assert.equal(mapped.length, 2, "drops empty title/body");
assert.equal(mapped[0].title, "Newer", "newest first; publishingReadyAt wins");
assert.equal(mapped[0].provider, "azure:gpt");
assert.equal(mapped[1].title, "Older");

// Defensive: non-array input never throws.
assert.equal(mapArtifactsToReflections(null).length, 0);
assert.equal(mapArtifactsToReflections(undefined).length, 0);

console.log("pesReflections.core self-check: all assertions passed");
