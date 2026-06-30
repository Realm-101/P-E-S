import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sendPesMessage } from "@/lib/pesChat";

interface ChatProps {
  onNavigate: (page: string) => void;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export const Chat = ({ onNavigate }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [mocked, setMocked] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setSending(true);
    try {
      const result = await sendPesMessage({ message: text, sessionId });
      setSessionId(result.sessionId);
      setMocked(result.mocked);
      setMessages((m) => [...m, { role: "assistant", text: result.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The runtime could not be reached.");
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
        <p className="text-sm text-destructive mb-3" role="alert">
          {error}
        </p>
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
