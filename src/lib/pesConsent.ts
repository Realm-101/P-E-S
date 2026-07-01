import { buildConsentRequest } from "./pesConsent.core.mjs";
import type { ConsentChoice } from "./pesConsent.core.mjs";

// pesConsent — front-end seam for recording / withdrawing the P-E-S research
// Consent_Decision. Same shared-runtime consumer posture and env var as the
// chat seam (pesChat.ts): the SPA holds no secret and writes no store directly;
// it calls the G_5.2 dashboard server consent endpoints for product "pes".
//
// Mirrors the established *.core.mjs split: pure request-shaping / state logic
// lives in pesConsent.core.mjs (buildConsentRequest / researchStorageAllowed);
// this wrapper owns fetch + import.meta.env and returns the consentRef/status
// to the chat surface.
//
// ponytail: when VITE_G52_INQUIRY_URL is unset (standalone/dev), there is no
// runtime to record against, so both calls resolve to an un-recorded result
// (consentRef:null). That is the fail-safe default — an absent consentRef on
// the turn path means no research write happens. The drop-in point for the
// deferred public proxy (path B) is the same as pesChat.ts.

export type { ConsentChoice };

export interface ConsentRecordResult {
  consentRef: string | null;
  status: ConsentChoice;
  recordedAt: string | null;
  recorded: boolean; // false ⇒ standalone/no-runtime, nothing persisted
}

export interface ConsentWithdrawResult {
  status: "withdrawn";
  withdrawnAt: string | null;
  deleted: number;
  deletionComplete: boolean;
  recorded: boolean; // false ⇒ standalone/no-runtime, nothing persisted
}

function getRuntimeUrl(): string | undefined {
  const url = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_G52_INQUIRY_URL;
  return url && url.trim() ? url.trim().replace(/\/+$/, "") : undefined;
}

async function failureDetail(res: Response, fallback: string): Promise<string> {
  try {
    const err = (await res.json()) as { error?: string };
    if (err?.error) return err.error;
  } catch {
    /* non-JSON error body */
  }
  return fallback;
}

/**
 * Record a Consent_Decision (`granted`/`declined`) against the runtime.
 * Returns the server-issued consentRef + status for the chat surface to carry
 * on the turn path. No personal account identifier is ever sent (the body is
 * shaped by buildConsentRequest).
 */
export async function recordConsent(input: {
  choice: ConsentChoice;
  sessionId?: string | null;
  consentVersion: string;
}): Promise<ConsentRecordResult> {
  const base = getRuntimeUrl();

  // Standalone/no runtime: nothing to persist; resolve to un-recorded.
  if (!base) {
    return {
      consentRef: null,
      status: input.choice,
      recordedAt: null,
      recorded: false,
    };
  }

  const res = await fetch(`${base}/api/pes/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      buildConsentRequest({
        choice: input.choice,
        sessionId: input.sessionId,
        consentVersion: input.consentVersion,
      })
    ),
  });

  if (!res.ok) {
    throw new Error(
      await failureDetail(res, `Consent runtime returned ${res.status}.`)
    );
  }

  const body = (await res.json()) as {
    consentRef?: string;
    status?: ConsentChoice;
    recordedAt?: string;
  };
  return {
    consentRef: body.consentRef ?? null,
    status: body.status ?? input.choice,
    recordedAt: body.recordedAt ?? null,
    recorded: true,
  };
}

/**
 * Withdraw a previously recorded `granted` Consent_Decision. The runtime
 * transitions the record to `withdrawn` and deletes prior research records for
 * the session; this returns the deletion outcome for the chat surface.
 */
export async function withdrawConsent(input: {
  consentRef: string;
}): Promise<ConsentWithdrawResult> {
  const base = getRuntimeUrl();

  if (!base) {
    return {
      status: "withdrawn",
      withdrawnAt: null,
      deleted: 0,
      deletionComplete: true,
      recorded: false,
    };
  }

  const res = await fetch(`${base}/api/pes/consent/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product: "pes", consentRef: input.consentRef }),
  });

  if (!res.ok) {
    throw new Error(
      await failureDetail(res, `Consent runtime returned ${res.status}.`)
    );
  }

  const body = (await res.json()) as {
    withdrawnAt?: string;
    deleted?: number;
    deletionComplete?: boolean;
  };
  return {
    status: "withdrawn",
    withdrawnAt: body.withdrawnAt ?? null,
    deleted: typeof body.deleted === "number" ? body.deleted : 0,
    deletionComplete: body.deletionComplete ?? false,
    recorded: true,
  };
}
