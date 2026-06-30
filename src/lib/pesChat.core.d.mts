export interface InquiryRequest {
  product: "pes";
  mode: "dialogic";
  userMessage: string;
  sessionId?: string;
  consentRef?: string;
}

export interface InquiryReply {
  reply: string;
  sessionId: string | null;
  provider: string | null;
}

export function buildInquiryRequest(input: {
  sessionId?: string | null;
  userMessage: string;
  consentRef?: string | null;
}): InquiryRequest;

export function parseInquiryReply(json: unknown): InquiryReply;

export function mockReply(userMessage: string): string;
