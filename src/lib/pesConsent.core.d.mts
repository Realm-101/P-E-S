export type ConsentChoice = "granted" | "declined";

export interface ConsentUiState {
  decision: ConsentChoice | null;
  recordedRef: string | null;
  consentVersion: string;
  withdrawn: boolean;
}

export interface ConsentRequest {
  product: "pes";
  choice: ConsentChoice;
  consentVersion: string;
  sessionId?: string;
}

export function buildConsentRequest(input: {
  choice: ConsentChoice;
  sessionId?: string | null;
  consentVersion: string;
}): ConsentRequest;

export function researchStorageAllowed(state: ConsentUiState): boolean;
