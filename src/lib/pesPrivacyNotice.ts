// pesPrivacyNotice — SPA-side copy of the P-E-S research Privacy_Notice text.
//
// This MIRRORS the canonical content in
// G_5.2/packages/orchestration/src/pes/privacyNotice.ts (`pes-consent-v1`).
// The SPA and G_5.2 are separate npm projects with no shared package, so — like
// the de-identifier mirror — this is a deliberate alpha tradeoff (see
// .kiro/steering/witness-protocol.md "cross-repo checklist duplication"). If the
// canonical text or version changes, update both places.
//
// LEGAL REVIEW REQUIRED (Requirement 4.10): this is engineering placeholder copy.
// It MUST be reviewed by qualified legal counsel and `legalReviewRequired` cleared
// before P-E-S consent collection is enabled in production.

export const PES_CONSENT_VERSION = "pes-consent-v1";

export interface PrivacyNotice {
  version: string;
  researchPurpose: string;
  dataController: string;
  retentionPeriod: string;
  deidentificationPractice: string;
  dataSubjectRights: { access: string; erasure: string };
  legalReviewRequired: boolean;
}

export const PES_PRIVACY_NOTICE: PrivacyNotice = {
  version: PES_CONSENT_VERSION,
  researchPurpose:
    "To study how people reason about moral and reflective questions in dialogue " +
    "with G_5.0, so the Stichting can build a consented, de-identified research " +
    "corpus that supports AI-alignment evaluation. Your conversation is used only " +
    "for this single research purpose.",
  dataController:
    "Stichting Processo Ergo Sum (the Dutch non-profit operating ProcessoErgoSum.info), " +
    "acting as the data controller for P-E-S chat research data.",
  retentionPeriod: "24 months (730 days) from collection",
  deidentificationPractice:
    "Before any conversation content is stored for research, it is actively scrubbed " +
    "to remove personally identifying information (including names, contact details, " +
    "locations, institutions, identifiers, and specific dates), which are replaced with " +
    "category-labeled redaction markers. Raw, un-scrubbed text is never stored.",
  dataSubjectRights: {
    access:
      "You may request a copy of the de-identified research record stored for your " +
      "session at any time, using your session reference.",
    erasure:
      "You may request erasure of your research record, or withdraw consent, at any " +
      "time; on withdrawal, previously collected research records for your session are " +
      "deleted and no further content is stored.",
  },
  legalReviewRequired: true,
};
