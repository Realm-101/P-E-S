// Runnable self-check for the pes chat core. No framework: `node pesChat.core.test.mjs`.
import assert from "node:assert/strict";
import { buildInquiryRequest, parseInquiryReply, mockReply } from "./pesChat.core.mjs";

// buildInquiryRequest: trims, fixes product/mode, omits sessionId when absent.
const r1 = buildInquiryRequest({ userMessage: "  hello  " });
assert.equal(r1.product, "pes");
assert.equal(r1.mode, "dialogic");
assert.equal(r1.userMessage, "hello");
assert.equal("sessionId" in r1, false, "no sessionId key on first turn");

const r2 = buildInquiryRequest({ sessionId: "sess-1", userMessage: "again" });
assert.equal(r2.sessionId, "sess-1");

// consentRef is additive: absent ⇒ no key (request shape unchanged, no account identifier).
assert.equal("consentRef" in r1, false, "no consentRef key when absent");
const r3 = buildInquiryRequest({ userMessage: "with consent", consentRef: "consent-7" });
assert.equal(r3.consentRef, "consent-7");
assert.equal(r3.product, "pes", "product stays pes regardless of consent");
// absent/empty consentRef ⇒ identical body to a turn that never knew about consent.
assert.deepEqual(
  buildInquiryRequest({ userMessage: "x", consentRef: null }),
  buildInquiryRequest({ userMessage: "x" }),
  "null consentRef does not alter the request body"
);

// parseInquiryReply: prefers persistedTurn.assistantMessage, carries session id.
const p1 = parseInquiryReply({
  product: "pes",
  session: { id: "sess-9", turns: [{ assistantMessage: "stale" }] },
  persistedTurn: { assistantMessage: "fresh" },
  provider: "azure:gpt",
});
assert.equal(p1.reply, "fresh");
assert.equal(p1.sessionId, "sess-9");
assert.equal(p1.provider, "azure:gpt");

// parseInquiryReply: falls back to last session turn when persistedTurn missing.
const p2 = parseInquiryReply({
  session: { id: "s2", turns: [{ assistantMessage: "a" }, { assistantMessage: "b" }] },
});
assert.equal(p2.reply, "b");
assert.equal(p2.sessionId, "s2");

// parseInquiryReply: empty/garbage → safe defaults, never throws.
const p3 = parseInquiryReply({});
assert.equal(p3.reply, "");
assert.equal(p3.sessionId, null);

// mockReply: marked as local preview and echoes (truncated) input.
const m = mockReply("test message");
assert.ok(m.includes("local preview"));
assert.ok(m.includes("test message"));

console.log("pesChat.core self-check: all assertions passed");
