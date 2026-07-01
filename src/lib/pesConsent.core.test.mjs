// Runnable self-check for the pes consent core. No framework: `node pesConsent.core.test.mjs`.
import assert from "node:assert/strict";
import { buildConsentRequest, researchStorageAllowed } from "./pesConsent.core.mjs";

// buildConsentRequest: product is always "pes" and the explicit choice is carried.
const granted = buildConsentRequest({ choice: "granted", consentVersion: "pes-consent-v1" });
assert.equal(granted.product, "pes");
assert.equal(granted.choice, "granted");
assert.equal(granted.consentVersion, "pes-consent-v1");
assert.equal("sessionId" in granted, false, "no sessionId key when absent");

const declined = buildConsentRequest({ choice: "declined", consentVersion: "pes-consent-v1" });
assert.equal(declined.choice, "declined", "the declined choice is carried verbatim");

// sessionId is optional/operational: present only when a truthy id is supplied.
const withSession = buildConsentRequest({
  choice: "granted",
  sessionId: "sess-1",
  consentVersion: "pes-consent-v1",
});
assert.equal(withSession.sessionId, "sess-1");
assert.equal(
  "sessionId" in buildConsentRequest({ choice: "granted", sessionId: null, consentVersion: "v1" }),
  false,
  "null sessionId is omitted, not sent as null"
);

// consentVersion is always a string (missing/nullish ⇒ "").
assert.equal(
  buildConsentRequest({ choice: "granted", consentVersion: undefined }).consentVersion,
  "",
  "missing consentVersion stringifies to empty"
);
assert.equal(
  buildConsentRequest({ choice: "granted", consentVersion: 1 }).consentVersion,
  "1",
  "numeric consentVersion is stringified"
);

// No account identifier (Requirement 2.2): the body carries ONLY the four allowed keys.
const allowed = new Set(["product", "choice", "consentVersion", "sessionId"]);
for (const body of [granted, declined, withSession]) {
  for (const key of Object.keys(body)) {
    assert.ok(allowed.has(key), `unexpected key on consent request body: ${key}`);
  }
  // belt-and-suspenders: explicitly assert common identifier fields never leak in.
  for (const id of ["userId", "accountId", "email", "name", "ip", "subject"]) {
    assert.equal(id in body, false, `account identifier "${id}" must never be attached`);
  }
}

// researchStorageAllowed: granted && !withdrawn is the ONLY true case.
assert.equal(
  researchStorageAllowed({ decision: "granted", withdrawn: false }),
  true,
  "granted && !withdrawn ⇒ true"
);
assert.equal(
  researchStorageAllowed({ decision: "granted", withdrawn: true }),
  false,
  "withdrawal revokes a prior grant ⇒ false"
);
assert.equal(
  researchStorageAllowed({ decision: "declined", withdrawn: false }),
  false,
  "declined ⇒ false"
);
assert.equal(
  researchStorageAllowed({ decision: null, withdrawn: false }),
  false,
  "no decision yet ⇒ false"
);
// Defensive: a missing/garbage state never throws and resolves to "store nothing".
assert.equal(researchStorageAllowed(undefined), false, "undefined state ⇒ false");
assert.equal(researchStorageAllowed({}), false, "empty state ⇒ false");

console.log("pesConsent.core self-check: all assertions passed");
