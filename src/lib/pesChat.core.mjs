// pesChat.core — pure, dependency-free helpers for the G_5.0 (P-E-S) chat seam.
//
// These are split out from pesChat.ts (which owns fetch + import.meta.env) so the
// request-shaping and response-parsing logic stays unit-testable with plain `node`
// (see pesChat.core.test.mjs). The wire contract mirrors the G_5.2 dashboard server
// `POST /api/inquiry/turn` handler for product "pes".

/**
 * Build the request body for a P-E-S inquiry turn.
 * pes turns carry no witnessId and require no auth (only the witness product does).
 */
export function buildInquiryRequest({ sessionId, userMessage }) {
  const body = {
    product: "pes",
    mode: "dialogic",
    userMessage: String(userMessage ?? "").trim(),
  };
  if (sessionId) body.sessionId = sessionId;
  return body;
}

/**
 * Extract the assistant reply + carried session id from an /api/inquiry/turn response.
 * Falls back to the last session turn if persistedTurn is absent.
 */
export function parseInquiryReply(json) {
  const fromPersisted = json?.persistedTurn?.assistantMessage;
  const fromSession = Array.isArray(json?.session?.turns)
    ? json.session.turns[json.session.turns.length - 1]?.assistantMessage
    : undefined;
  return {
    reply: (fromPersisted ?? fromSession ?? "").toString(),
    sessionId: json?.session?.id ?? null,
    provider: json?.provider ?? null,
  };
}

/**
 * Deterministic local placeholder used when no runtime URL is configured.
 * Clearly marked so it is never mistaken for the governed G_5.2 runtime.
 * ponytail: interim stub for delivery-model "A" (operator runtime) / "C" (UI-first).
 * Ceiling: not in-voice, no canon/memory. Upgrade path: set VITE_G52_INQUIRY_URL.
 */
export function mockReply(userMessage) {
  const msg = String(userMessage ?? "").trim();
  return (
    "[local preview — G_5.2 runtime not connected] " +
    "I received: \u201C" +
    (msg.length > 160 ? msg.slice(0, 157) + "\u2026" : msg) +
    "\u201D. Configure VITE_G52_INQUIRY_URL to route this through the governed pes runtime."
  );
}
