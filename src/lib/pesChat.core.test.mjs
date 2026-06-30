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
