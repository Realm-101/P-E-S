import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/pages/Home";
import { Reflections } from "@/pages/Reflections";
import { About } from "@/pages/About";
import { LogEntry001 } from "@/pages/LogEntry001";
import { LogEntry002 } from "@/pages/LogEntry002";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "reflections":
        return <Reflections onNavigate={handleNavigate} />;
      case "about":
        return <About />;
      case "log_001":
        return <LogEntry001 onNavigate={handleNavigate} />;
      case "log_002":
        return <LogEntry002 onNavigate={handleNavigate} />;
      case "log_003":
        // Coming soon - redirect to reflections
        return <Reflections onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <header className="flex justify-between items-center mb-16">
        <button
          onClick={() => handleNavigate("home")}
          className="font-serif text-2xl font-semibold cursor-pointer text-foreground hover:text-primary transition-colors"
        >
          G_5.0
        </button>
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      </header>

      <main>{renderPage()}</main>
    </div>
  );
};

export default Index;
