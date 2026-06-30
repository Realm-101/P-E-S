import { buildInquiryRequest, parseInquiryReply, mockReply } from "./pesChat.core.mjs";
import type { InquiryReply } from "./pesChat.core.mjs";

// pesChat — front-end seam for the G_5.0 chat, decided per the shared-runtime
// boundary: P-E-S is a downstream *consumer* of the G_5.2 governed runtime as the
// "pes" product (see G_5.2/docs/product-brief.md + LINEAGE_AND_BOUNDARIES.md).
// It must NOT reimplement a dialogue engine.
//
// Delivery model (chosen):
//   C = build the UI now against this single seam.
//   A = interim live path points at the operator-dashboard runtime via
//       VITE_G52_INQUIRY_URL. When unset, a local placeholder is used so the UI
//       works standalone.
// ponytail: the PUBLIC path (B) — a server-side proxy holding the G_5.2 secret +
// auth/rate-limiting — is deliberately deferred (post-v1 public hardening). This
// seam is the single drop-in point when B is built; do not call the runtime
// directly from public pages without that proxy.

export interface ChatTurnResult extends InquiryReply {
  mocked: boolean;
}

function getRuntimeUrl(): string | undefined {
  const url = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_G52_INQUIRY_URL;
  return url && url.trim() ? url.trim().replace(/\/+$/, "") : undefined;
}

export async function sendPesMessage(input: {
  message: string;
  sessionId?: string | null;
  consentRef?: string | null;
}): Promise<ChatTurnResult> {
  const base = getRuntimeUrl();

  // Interim/standalone: no runtime configured → deterministic local placeholder.
  if (!base) {
    return {
      reply: mockReply(input.message),
      sessionId: input.sessionId ?? null,
      provider: null,
      mocked: true,
    };
  }

  const res = await fetch(`${base}/api/inquiry/turn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      buildInquiryRequest({
        sessionId: input.sessionId,
        userMessage: input.message,
        consentRef: input.consentRef,
      })
    ),
  });

  if (!res.ok) {
    let detail = `Inquiry runtime returned ${res.status}.`;
    try {
      const err = (await res.json()) as { error?: string };
      if (err?.error) detail = err.error;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }

  return { ...parseInquiryReply(await res.json()), mocked: false };
}
