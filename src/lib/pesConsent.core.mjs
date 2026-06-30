// pesConsent.core — pure, dependency-free helpers for the G_5.0 (P-E-S) consent seam.
//
// Split out from pesConsent.ts (which owns fetch + import.meta.env) so the
// request-shaping and state logic stays unit-testable with plain `node`
// (see pesConsent.core.test.mjs). Mirrors the *.core.mjs split used by
// pesChat and pesReflections. The consent wire contract targets the G_5.2
// dashboard server `POST /api/pes/consent` handler for product "pes".

/**
 * Build the request body for recording a P-E-S Consent_Decision.
 * Consent gates research storage only, never the chat. No personal account
 * identifier is ever attached (Requirement 1.2 / 2.2) — the body carries only
 * product, the explicit choice, an optional operational session id, and the
 * version of the consent text the visitor saw.
 *
 * @param {{ choice: "granted"|"declined", sessionId?: string|null, consentVersion: string }} input
 */
export function buildConsentRequest({ choice, sessionId, consentVersion }) {
  const body = {
    product: "pes",
    choice,
    consentVersion: String(consentVersion ?? ""),
  };
  if (sessionId) body.sessionId = sessionId;
  return body;
}

/**
 * Returns true iff research storage is permitted for the current consent state.
 * `granted` is the only state that permits storage; a withdrawal revokes it.
 * Everything else (null / "declined" / withdrawn) resolves to "store nothing".
 *
 * @param {{ decision: "granted"|"declined"|null, recordedRef: string|null, consentVersion: string, withdrawn: boolean }} state
 */
export function researchStorageAllowed(state) {
  return state?.decision === "granted" && !state?.withdrawn;
}
