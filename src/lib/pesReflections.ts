import {
  buildArtifactsUrl,
  mapArtifactsToReflections,
} from "./pesReflections.core.mjs";
import type { PublishedReflection } from "./pesReflections.core.mjs";

// Reflections publish path. P-E-S renders G_5.2 authored artifacts the operator has
// marked `publishing_ready` — the governed successor to the original MSMCP-authored
// log entries. Same shared-runtime consumer model and same env var as the chat seam.
// When VITE_G52_INQUIRY_URL is unset, returns [] and the Reflections page falls back
// to the static origin-arc log entries (nothing regresses).

export type { PublishedReflection };

function getRuntimeUrl(): string | undefined {
  const url = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_G52_INQUIRY_URL;
  return url && url.trim() ? url.trim() : undefined;
}

export async function fetchPublishedReflections(): Promise<PublishedReflection[]> {
  const base = getRuntimeUrl();
  if (!base) return [];

  const res = await fetch(buildArtifactsUrl(base), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Reflections runtime returned ${res.status}.`);
  }
  return mapArtifactsToReflections(await res.json());
}
