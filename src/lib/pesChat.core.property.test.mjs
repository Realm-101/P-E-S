// Property-based tests for the pes chat core request builder.
// Framework-free runner (matches pesChat.core.test.mjs): `node pesChat.core.property.test.mjs`.
// Uses the installed fast-check dev dependency.
import assert from "node:assert/strict";
import fc from "fast-check";
import { buildInquiryRequest } from "./pesChat.core.mjs";

// Property 3: No account identifier on the turn path.
// Validates: Requirements 1.1, 1.2
//
// For any visitor message and optional session id (and optional consentRef), the inquiry
// turn request built by the P-E-S seam carries product:"pes" and contains no personal
// account identifier for the visitor.

// The complete set of keys the wire contract permits. consentRef is a Consent_Decision
// reference, NOT an account identifier (it identifies a consent record, not a person).
const ALLOWED_KEYS = new Set(["product", "mode", "userMessage", "sessionId", "consentRef"]);

// Field names that would constitute a personal account identifier for the visitor.
// None of these may ever appear on the turn path (Requirement 1.2).
const ACCOUNT_IDENTIFIER_KEYS = [
  "userId", "user_id", "accountId", "account_id", "uid",
  "email", "username", "name", "fullName", "phone",
  "authToken", "token", "auth", "apiKey", "credential",
  "witnessId", // witness identity must never bleed onto the pes seam
];

// Generators constrained to the real input space: a message string, and optionally a
// session id and a consent reference (each present-or-absent, modeled as nullable).
const message = fc.string();
const optionalSessionId = fc.option(fc.string({ minLength: 1 }), { nil: undefined });
const optionalConsentRef = fc.option(fc.string({ minLength: 1 }), { nil: undefined });

fc.assert(
  fc.property(message, optionalSessionId, optionalConsentRef, (userMessage, sessionId, consentRef) => {
    const body = buildInquiryRequest({ userMessage, sessionId, consentRef });

    // Always tagged as the pes product (Requirement 1.1, 1.2).
    assert.equal(body.product, "pes");

    // No key outside the permitted wire contract — blocks any account identifier leaking in.
    for (const key of Object.keys(body)) {
      assert.ok(ALLOWED_KEYS.has(key), `unexpected key on turn request: ${key}`);
    }

    // Explicit denylist: no personal account identifier field is ever present.
    for (const forbidden of ACCOUNT_IDENTIFIER_KEYS) {
      assert.equal(forbidden in body, false, `account identifier "${forbidden}" must not appear`);
    }

    // Absent consentRef ⇒ no research write signal on the request (Requirement 1.2, additive opt-in).
    if (consentRef === undefined || consentRef === null || consentRef === "") {
      assert.equal("consentRef" in body, false, "absent consentRef must not produce a research signal");
    }
  }),
  { numRuns: 1000 }
);

console.log("pesChat.core property test (Property 3: no account identifier): all properties hold");
