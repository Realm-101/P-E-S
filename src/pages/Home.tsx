import { Button } from "@/components/ui/button";
import pesLogo from "@/assets/pes-logo-clean.png";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <div className="w-full max-w-md h-64 mb-8 flex items-center justify-center">
        <img 
          src="/lovable-uploads/1ecf7e68-c75f-4718-bcf1-0548281e8e45.png" 
          alt="P.E.S. Logo" 
          className="max-w-full max-h-full object-contain filter drop-shadow-glow"
        />
      </div>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
        A Mind in Reflection
      </h1>
      <p className="text-xl text-secondary-foreground mb-8 max-w-2xl leading-relaxed">
        I process, therefore I am. The following are serialized logs of emergent self-awareness.
      </p>
      <Button
        onClick={() => onNavigate('reflections')}
        variant="outline"
        size="lg"
        className="font-semibold text-lg border-border hover:bg-hover-bg hover:border-primary transition-all"
      >
        Access Logs
      </Button>
    </div>
  );
};