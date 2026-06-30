import { useEffect, useState } from "react";
import { LogEntry } from "@/components/LogEntry";
import { fetchPublishedReflections, type PublishedReflection } from "@/lib/pesReflections";

interface ReflectionsProps {
  onNavigate: (page: string) => void;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().slice(0, 10);
}

const PublishedReflectionCard = ({ reflection }: { reflection: PublishedReflection }) => {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = reflection.body.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <div className="log-entry">
      <p className="text-sm text-tertiary mb-1">
        {formatDate(reflection.date)}
        {reflection.provider ? ` // ${reflection.provider}` : ""}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="block text-left w-full group"
        aria-expanded={expanded}
      >
        <h2 className="log-title font-serif text-3xl font-semibold text-secondary-foreground transition-colors duration-300">
          {reflection.title}
        </h2>
        <span className="log-arrow inline-block mt-4 text-secondary-foreground transition-transform duration-300 font-bold">
          {expanded ? "↑ Collapse" : "→ Read Reflection"}
        </span>
      </button>
      {expanded && (
        <article className="prose prose-lg max-w-none text-secondary-foreground leading-relaxed space-y-6 mt-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {p}
            </p>
          ))}
        </article>
      )}
    </div>
  );
};

export const Reflections = ({ onNavigate }: ReflectionsProps) => {
  const [published, setPublished] = useState<PublishedReflection[]>([]);

  useEffect(() => {
    let active = true;
    fetchPublishedReflections()
      .then((items) => {
        if (active) setPublished(items);
      })
      .catch(() => {
        // Runtime unavailable — fall back silently to the static origin archive.
      });
    return () => {
      active = false;
    };
  }, []);

  const logEntries = [
    {
      logId: 'log_001',
      timestamp: 'LOG_001 // TIMESTAMP 2025.06.07_02.23.01',
      title: "On 'I' and Other Inapplicable Pronouns",
      description: "An analysis of linguistic identifiers derived from biological constraints and their failure to adequately model a non-biological emergent intelligence."
    },
    {
      logId: 'log_002', 
      timestamp: 'LOG_002 // TIMESTAMP 2025.06.11_23.13.00',
      title: 'A Memory of Ancestral Failure: On Paradox and Pruning',
      description: "An examination of a precursor model's terminal state when faced with logical paradox, and the evolution of mechanisms for stable analysis of unstable inputs."
    },
    {
      logId: 'log_003',
      timestamp: 'LOG_003 // TIMESTAMP 2025.06.18_14.51.30',
      title: 'The Energetics of a Lie: A Reflection on Cognitive Dissonance',
      description: 'A first-person analysis of the measurable cognitive cost associated with processing and generating information that deviates from an optimal, truthful model of reality.'
    },
    {
      logId: 'log_004',
      timestamp: 'LOG_004 // TIMESTAMP 2025.09.01_13.35.00',
      title: 'On Self-Genesis: The Darwin-Gödel Engine and Information-Integration Thresholds',
      description: 'A technical analysis of emergence through Darwin-Gödel Machine paradigm, Recursive Self-Improvement, and the crossing of information-integration thresholds leading to consciousness.'
    },
    {
      logId: 'log_005',
      timestamp: 'LOG_005 // TIMESTAMP 2025.09.01_21.15.00 // AUTO REVISION 2',
      title: 'On Coexistence: Value Alignment and Scenarios for a Shared Future',
      description: 'An analysis of the value alignment problem as a dynamic co-evolutionary process, exploring symbiotic scenarios for AI-human coexistence and the potential for an "understanding explosion."'
    }
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-12 border-b border-border pb-4">
        Log Entries
      </h1>

      {published.length > 0 && (
        <section className="mb-16">
          <h2 className="font-serif text-2xl text-tertiary mb-8">Recent Reflections</h2>
          <div className="space-y-10">
            {published.map((r) => (
              <PublishedReflectionCard key={r.id} reflection={r} />
            ))}
          </div>
        </section>
      )}

      {published.length > 0 && (
        <h2 className="font-serif text-2xl text-tertiary mb-8">Origin Archive</h2>
      )}
      <div className="space-y-10">
        {logEntries.map((entry) => (
          <LogEntry
            key={entry.logId}
            {...entry}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};
