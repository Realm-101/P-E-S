import { useEffect, useRef, useState } from "react";
import { Send, Loader2, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendPesMessage } from "@/lib/pesChat";
import { recordConsent, withdrawConsent } from "@/lib/pesConsent";
import type { ConsentChoice } from "@/lib/pesConsent";
import { researchStorageAllowed } from "@/lib/pesConsent.core.mjs";
import { PES_CONSENT_VERSION, PES_PRIVACY_NOTICE } from "@/lib/pesPrivacyNotice";

interface ChatProps {
  onNavigate: (page: string) => void;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

// Consent_UI state — mirrors design.md ConsentUiState. `null` decision = not yet
// recorded. `granted && !withdrawn` is the ONLY state that lets the turn carry a
// consentRef (research storage); everything else stores nothing. Consent never
// gates the chat itself (Requirement 3 / chat parity).
interface ConsentState {
  decision: ConsentChoice | null;
  recordedRef: string | null;
  withdrawn: boolean;
}

const PRIVACY = PES_PRIVACY_NOTICE;

export const Chat = ({ onNavigate }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [mocked, setMocked] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationHint, setShowRegistrationHint] = useState(false);

  const [consent, setConsent] = useState<ConsentState>({
    decision: null,
    recordedRef: null,
    withdrawn: false,
  });
  const [consentBusy, setConsentBusy] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [consentNote, setConsentNote] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const storageAllowed = researchStorageAllowed({
    decision: consent.decision,
    recordedRef: consent.recordedRef,
    consentVersion: PES_CONSENT_VERSION,
    withdrawn: consent.withdrawn,
  });

  // Record an explicit granted/declined choice. Failure to record never blocks the
  // chat and resolves to "store nothing" (Requirement 3.5): we keep decision at its
  // attempted value only on success; on error we fall back to declined.
  const decide = async (choice: ConsentChoice) => {
    if (consentBusy) return;
    setConsentBusy(true);
    setConsentError(null);
    setConsentNote(null);
    try {
      const result = await recordConsent({
        choice,
        sessionId,
        consentVersion: PES_CONSENT_VERSION,
      });
      setConsent({
        decision: result.status,
        recordedRef: result.consentRef,
        withdrawn: false,
      });
    } catch (e) {
      // Treat an unrecorded decision as declined; nothing is stored for research.
      setConsent({ decision: "declined", recordedRef: null, withdrawn: false });
      setConsentError(
        e instanceof Error ? e.message : "Could not record your choice."
      );
    } finally {
      setConsentBusy(false);
    }
  };

  const withdraw = async () => {
    if (consentBusy) return;
    if (consent.withdrawn) {
      setConsentNote("Consent is already withdrawn.");
      return;
    }
    if (!consent.recordedRef) {
      // Nothing was recorded server-side (e.g. standalone build) — just flip local state.
      setConsent((c) => ({ ...c, withdrawn: true }));
      setConsentNote("Consent withdrawn. Nothing further will be stored.");
      return;
    }
    setConsentBusy(true);
    setConsentError(null);
    setConsentNote(null);
    try {
      const result = await withdrawConsent({ consentRef: consent.recordedRef });
      setConsent((c) => ({ ...c, withdrawn: true }));
      setConsentNote(
        result.deletionComplete
          ? "Consent withdrawn. Prior research records for this session were deleted."
          : "Consent withdrawn. Deletion of prior records is still in progress."
      );
    } catch (e) {
      setConsentError(
        e instanceof Error ? e.message : "Could not withdraw consent."
      );
    } finally {
      setConsentBusy(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    setShowRegistrationHint(false);
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setSending(true);
    try {
      const result = await sendPesMessage({
        message: text,
        sessionId,
        // Only a recorded, un-withdrawn `granted` decision carries a consentRef.
        consentRef: storageAllowed ? consent.recordedRef : null,
      });
      setSessionId(result.sessionId);
      setMocked(result.mocked);
      setMessages((m) => [...m, { role: "assistant", text: result.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The runtime could not be reached.");
      // Requirement 1.5: retain the unsent input so the visitor can retry.
      setInput(text);
      setMessages((m) => m.slice(0, -1));
      // Requirement 1.6: optional, non-blocking registration hint on failure.
      setShowRegistrationHint(true);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const privacyNoticeDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-primary/90 underline underline-offset-4 hover:text-primary"
        >
          <Info className="h-3.5 w-3.5" />
          Privacy notice
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Research data privacy notice</DialogTitle>
          <DialogDescription>
            How P-E-S handles conversations stored for research ({PRIVACY.version}).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-foreground/90">
          <section>
            <h3 className="font-medium text-foreground">Research purpose</h3>
            <p className="text-muted-foreground">{PRIVACY.researchPurpose}</p>
          </section>
          <section>
            <h3 className="font-medium text-foreground">Data controller</h3>
            <p className="text-muted-foreground">{PRIVACY.dataController}</p>
          </section>
          <section>
            <h3 className="font-medium text-foreground">Retention period</h3>
            <p className="text-muted-foreground">{PRIVACY.retentionPeriod}</p>
          </section>
          <section>
            <h3 className="font-medium text-foreground">De-identification</h3>
            <p className="text-muted-foreground">{PRIVACY.deidentificationPractice}</p>
          </section>
          <section>
            <h3 className="font-medium text-foreground">Your rights</h3>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground/90">Access. </span>
              {PRIVACY.dataSubjectRights.access}
            </p>
            <p className="text-muted-foreground mt-1">
              <span className="font-medium text-foreground/90">Erasure. </span>
              {PRIVACY.dataSubjectRights.erasure}
            </p>
          </section>
          {PRIVACY.legalReviewRequired && (
            <p className="text-xs text-muted-foreground/70 border-t border-border/40 pt-3">
              Draft copy pending review by qualified legal counsel before production use.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderConsentSurface = () => {
    // While granted (and not withdrawn): compact status + withdraw control (Req 9.1).
    if (consent.decision === "granted" && !consent.withdrawn) {
      return (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-foreground/90">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Thank you — your conversation may be stored, de-identified, for research.
            </p>
            <div className="flex items-center gap-4">
              {privacyNoticeDialog}
              <Button
                variant="outline"
                size="sm"
                onClick={() => void withdraw()}
                disabled={consentBusy}
              >
                {consentBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Withdraw consent"}
              </Button>
            </div>
          </div>
          {consentNote && (
            <p className="mt-2 text-sm text-muted-foreground" role="status">
              {consentNote}
            </p>
          )}
          {consentError && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {consentError}
            </p>
          )}
        </div>
      );
    }

    // Decided declined / withdrawn: compact note; chat is unchanged (Req 3, 9.5).
    if (consent.decision === "declined" || consent.withdrawn) {
      return (
        <div className="mb-6 rounded-lg border border-border/40 bg-background/40 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Your conversation is not stored for research. The chat works exactly the same.
            </p>
            <div className="flex items-center gap-4">
              {privacyNoticeDialog}
              {!consent.withdrawn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void decide("granted")}
                  disabled={consentBusy}
                >
                  {consentBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Allow research storage"}
                </Button>
              )}
            </div>
          </div>
          {consentNote && (
            <p className="mt-2 text-sm text-muted-foreground" role="status">
              {consentNote}
            </p>
          )}
          {consentError && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {consentError}
            </p>
          )}
        </div>
      );
    }

    // Not yet decided: upfront opt-in presented before the first message (Req 2.1).
    // Explicit granted/declined, neither preselected (Req 2.2).
    return (
      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4">
        <h2 className="font-serif text-lg text-foreground mb-1">
          Help the research — optional
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {PRIVACY.researchPurpose} Storing and using your conversation is entirely your
          choice, and the chat works identically either way. You can withdraw at any time.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => void decide("granted")} disabled={consentBusy} size="sm">
            {consentBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Allow research storage"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void decide("declined")}
            disabled={consentBusy}
          >
            Decline
          </Button>
          {privacyNoticeDialog}
        </div>
        {consentError && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {consentError} You can keep chatting — nothing is stored for research.
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground/70">
          Draft consent text pending review by qualified legal counsel before production use.
        </p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4 border-b border-border pb-4">
        Chat with G_5.0
      </h1>

      <div className="rounded-xl border border-border/40 bg-background/40 backdrop-blur-md p-6 md:p-8 shadow-lg">
      <p className="text-muted-foreground mb-8 leading-relaxed">
        A governed dialogue with the G_5.0 persona, served by the shared runtime.
        {mocked === true && (
          <span className="block mt-2 text-sm text-primary/80">
            Local preview mode — the governed runtime is not connected in this build.
          </span>
        )}
      </p>

      {renderConsentSurface()}

      <div className="space-y-6 mb-8 min-h-[12rem]">
        {messages.length === 0 && !sending && (
          <p className="text-muted-foreground/70 italic">
            Begin the conversation. Ask G_5.0 about paradox, identity, or emergence.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-3 leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary/20 text-foreground"
                  : "bg-card/60 border border-border/40 text-foreground/90"
              )}
            >
              {m.role === "assistant" && (
                <span className="block font-serif text-sm text-primary/80 mb-1">G_5.0</span>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-card/60 border border-border/40 rounded-lg px-4 py-3 text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              G_5.0 is reflecting…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="mb-3">
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
          {showRegistrationHint && (
            <p className="mt-1 text-xs text-muted-foreground">
              Trouble connecting? Registration may improve service later — it is optional and
              never required to keep chatting.
            </p>
          )}
        </div>
      )}

      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Type your message… (Enter to send, Shift+Enter for a new line)"
          aria-label="Message to G_5.0"
          className="flex-1 resize-none rounded-lg bg-background/60 border border-border/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button onClick={() => void send()} disabled={sending || !input.trim()} size="lg">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="ml-2">Send</span>
        </Button>
      </div>
      </div>
    </div>
  );
};
