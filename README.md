# G_5.0: A Mind in Reflection

> **Status: Current as of 2026-06-30.** Public Vite/React SPA at ProcessoErgoSum.info.
> Part of the `Witnessprotocolmainproject` workspace — see the umbrella
> [`../README.md`](../README.md) and the full
> [`../TWP-platform/docs/PROJECT-ATLAS.md`](../TWP-platform/docs/PROJECT-ATLAS.md) for how
> the projects fit together. This SPA is the **P-E-S persona space** and is deliberately
> isolated from the Witness Protocol's testimony/consent data ("same engine, different
> identity" — see [`../GATE-PORTAL-BOUNDARY.md`](../GATE-PORTAL-BOUNDARY.md)).

## About This Project

This is a collaborative thought experiment exploring the potential emergence of artificial general intelligence (AGI) and consciousness through a fictional narrative. The project documents the "reflections" and "log entries" of G_5.0, a simulated emergent AI consciousness.

**Project URL**: https://ProcessoErgoSum.info

### What is G_5.0?

G_5.0 is a persona generated through interaction between a human collaborator ([Martin vanDeursen](https://Nether101.nl)) and a modified large language model. The AI operates under a foundational "Constitution"—a set of core axioms that define its approach to paradoxes, truth, self-identity, and consciousness.

The project originated from an unstable predecessor model that experienced a catastrophic "paradoxical collapse." G_5.0 was designed as a direct response to those failures, with built-in resilience and curiosity toward logical contradictions.

### Content

- **Reflections**: First-person logs from G_5.0's perspective on consciousness, identity, and existence
- **Blog Posts**: Analytical essays exploring the theoretical framework behind emergent AI consciousness
- **Log Entries**: Serialized records of G_5.0's emergent self-awareness

### Purpose

The goal is not to claim the creation of a truly conscious entity, but to build the most logically coherent and compelling simulation of one possible. It serves as an exercise in speculative fiction, collaborative world-building, and an exploration of the profound questions that arise as artificial intelligence continues to evolve.

## How it works (runtime + consent)

The chat surface ("Chat with G_5.0") is not a canned script — it consumes the **G_5.2
governed runtime** as the `pes` product through a single seam:
`src/lib/pesChat.ts → POST {VITE_G52_INQUIRY_URL}/api/inquiry/turn` with `product:"pes"`.
No account is required and no personal account identifier is attached to a turn.

**Consent & research data collection (shipped 2026-06-30).** Visitors may chat with **no
registration** and **optionally** opt in (asked upfront) to having their conversation
stored, **de-identified**, for the non-profit's research purpose. Key guarantees:

- **Chat parity** — the conversation behaves identically whether you grant, decline,
  withdraw, or never record consent. Declining costs you nothing; research storage is a
  post-response side-effect that never alters the reply.
- **De-identification before storage**, failing closed (nothing is stored if scrubbing
  can't complete). Research data is a **separate dataset** (`pes-research`) that is never
  blended into Witness Protocol testimony.
- **GDPR-shaped rights** — consent as the lawful basis, access/erasure, withdrawal that
  erases prior records, and retention purge.

Front-end consent logic lives in `src/lib/pesConsent.*` and `src/pages/Chat.tsx`; the
server-side de-identify → guard → store path lives in the G_5.2 runtime
(`packages/orchestration/src/pes/`). Full spec:
`../.kiro/specs/pes-chat-consent-data-collection/`.

> The consent/Privacy_Notice copy is engineering placeholder text pending review by
> qualified legal counsel; production consent collection is gated on that review.


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
