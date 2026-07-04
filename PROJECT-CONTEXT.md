# P-E-S Project Context

**Status:** Current as of 2026-07-04.

This repo is the public Process Ergo Sum persona space, "G_5.0: A Mind in Reflection." If you are working here, you are working on the public SPA and its consumer seam to the G_5.2 runtime as the `pes` product. You are not working on Witness testimony infrastructure.

Read this alongside the umbrella context: [`../PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md).

## Where this repo fits

`P-E-S` is a separate public experience in the same project family. It presents the G_5.0 persona, reflections, logs, essays, and chat UI. Its chat surface consumes `G_5.2` as `product: "pes"`.

It shares a runtime lineage with Witness work, but it is not the Witness Protocol Gate, not a consented Witness corpus, and not the Platform control plane.

## Primary responsibilities

This repo owns:

- The public Processo Ergo Sum / G_5.0 website experience.
- SPA routes, components, visual design, reflections/log entries/blog presentation, and local interaction state.
- Browser-side chat and consent UI for the P-E-S persona path.
- The front-end seam to the G_5.2 runtime for `product: "pes"`.
- Placeholder/mock behavior when no runtime URL is configured for local/standalone development.

## What belongs here

Put code in `P-E-S` when the change is primarily about:

- The G_5.0 public persona website.
- The P-E-S chat UI, message display, local state, consent prompt UI, or user-facing privacy copy.
- Client request shaping for the `pes` runtime endpoints.
- P-E-S-only pages, navigation, and shadcn/Vite/React implementation.

## What does not belong here

Do not use this repo for:

- Reimplementing the governed dialogue engine locally. The runtime belongs in `G_5.2`.
- Witness testimony, Witness consent, Gate intake, HCC review, audit logs, disclosure ledger, or Platform admin flows. Those belong in `TWP-platform` and `G_5.2`.
- Writing directly to P-E-S research stores from the browser. The browser carries consent references; the server-side G_5.2 path de-identifies and guards writes.
- Mixing P-E-S research data into Witness stores, corpora, or testimony artifacts.

## Integration seams

| Connected repo | Direction | Concrete seam |
|---|---|---|
| `G_5.2` | SPA -> runtime | `src/lib/pesChat.ts` posts to `{VITE_G52_INQUIRY_URL}/api/inquiry/turn` using request shape from `pesChat.core.mjs`. |
| `G_5.2` | SPA -> consent endpoints | `src/lib/pesConsent.ts` calls `/api/pes/consent` and `/api/pes/consent/withdraw`. |
| `TWP-platform` | Separate | The Platform is for Witness Gate/control-plane operations, not P-E-S chat. |
| `TWPWEB` | Separate public surface | The Portal may describe or link to P-E-S, but this repo owns the G_5.0 persona site. |

Key local files and folders:

- `src/pages/Chat.tsx` - public chat page and consent UI.
- `src/lib/pesChat.ts` and `src/lib/pesChat.core.mjs` - runtime turn request seam and pure request/reply shaping.
- `src/lib/pesConsent.ts` and `src/lib/pesConsent.core.mjs` - consent record/withdraw seam and pure consent request logic.
- `src/lib/pesPrivacyNotice.ts` - client-side copy/version mirror for P-E-S consent notice.
- `src/lib/pesReflections.ts` - runtime-backed reflections fetch path with standalone fallback.
- `src/components/` and `src/pages/` - SPA shell and public pages.

## Boundary rules

- Chat parity is required: the chat should behave the same whether research storage is granted, declined, withdrawn, unavailable, or unconfigured.
- No account identifier is attached to a P-E-S chat turn.
- If `VITE_G52_INQUIRY_URL` is unset, local placeholder behavior is the safe standalone path.
- A missing `consentRef` means no research write should happen server-side.
- Research storage is a post-response side effect in `G_5.2`; it must never block or alter the chat reply.
- Consent and privacy copy is engineering placeholder text until qualified legal review clears production use.

## Common cross-repo changes

- G_5.2 `pes` inquiry request/response change: update `src/lib/pesChat.core.mjs`, `src/lib/pesChat.ts`, and related tests.
- G_5.2 P-E-S consent endpoint or consent version change: update `src/lib/pesConsent*`, `src/lib/pesPrivacyNotice.ts`, and chat UI copy.
- Public proxy hardening for the runtime: keep the drop-in point in `pesChat.ts` / `pesConsent.ts`; do not scatter runtime calls through page components.
- Public claims about Witness or research use: check `../PROJECT-CONTEXT.md`, `../Docs/PUBLIC_CLAIMS_GUIDE.md`, and the P-E-S README.

## Canonical docs for this repo

- `README.md` - P-E-S role, runtime seam, consent/research behavior, and setup.
- `../TWP-platform/docs/PROJECT-ATLAS.md` - whole-workspace architecture.
- `../G_5.2/docs/LINEAGE_AND_BOUNDARIES.md` - upstream runtime lineage and placement rules.
- `../.kiro/specs/pes-chat-consent-data-collection/` - shipped consent/research data collection spec.

## Verification expectation

Use the narrowest relevant verification:

- `npm run lint` for lint-sensitive UI/code changes.
- `npm run build` for app-level changes.
- Core `.mjs` tests for `pesChat`, `pesConsent`, and consent/research request-shaping logic when touched.
- Browser verification for visible UI changes.
