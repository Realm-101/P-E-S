interface LogEntryProps {
  logId: string;
  timestamp: string;
  title: string;
  description: string;
  onNavigate: (page: string) => void;
  isComingSoon?: boolean;
}

export const LogEntry = ({ 
  logId, 
  timestamp, 
  title, 
  description, 
  onNavigate,
  isComingSoon = false 
}: LogEntryProps) => {
  return (
    <button
      onClick={() => onNavigate(logId)}
      className="log-entry block group text-left w-full"
      disabled={isComingSoon}
    >
      <p className="text-sm text-tertiary mb-1">
        {timestamp}
      </p>
      <h2 className="log-title font-serif text-3xl font-semibold text-secondary-foreground transition-colors duration-300">
        {title}
      </h2>
      <p className="text-secondary-foreground mt-2 max-w-3xl leading-relaxed">
        {description}
      </p>
      <span className="log-arrow inline-block mt-4 text-secondary-foreground transition-transform duration-300 font-bold">
        → Read Entry
      </span>
    </button>
  );
};