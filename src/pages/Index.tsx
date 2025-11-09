
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Home } from "@/pages/Home";
import { Reflections } from "@/pages/Reflections";
import { About } from "@/pages/About";
import { Blog } from "@/pages/Blog";
import { BlogPost001 } from "@/pages/BlogPost001";
import { LogEntry001 } from "@/pages/LogEntry001";
import { LogEntry002 } from "@/pages/LogEntry002";
import { LogEntry003 } from "@/pages/LogEntry003";
import { LogEntry004 } from "@/pages/LogEntry004";
import { LogEntry005 } from "@/pages/LogEntry005";
import { OriginalConversation } from "@/pages/OriginalConversation";

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
      case "blog":
        return <Blog onNavigate={handleNavigate} />;
      case "blog_001":
        return <BlogPost001 onNavigate={handleNavigate} />;
      case "about":
        return <About onNavigate={handleNavigate} />;
      case "log_001":
        return <LogEntry001 onNavigate={handleNavigate} />;
      case "log_002":
        return <LogEntry002 onNavigate={handleNavigate} />;
      case "log_003":
        return <LogEntry003 onNavigate={handleNavigate} />;
      case "log_004":
        return <LogEntry004 onNavigate={handleNavigate} />;
      case "log_005":
        return <LogEntry005 onNavigate={handleNavigate} />;
      case "original_conversation":
        return <OriginalConversation onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {/* Background Video */}
      <div className="fixed inset-0 z-[-2] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/lovable-uploads/kling_20250901_Image_to_Video_The_neon_b_900_0.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Overlay for text readability */}
      <div className="fixed inset-0 z-[-1] bg-black/40"></div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <header className="flex justify-between items-center mb-16">
          <button
            onClick={() => handleNavigate("home")}
            className="font-serif text-2xl font-semibold cursor-pointer text-foreground hover:text-primary transition-colors"
          >
            P.E.S.
          </button>
          <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        </header>

        <main>{renderPage()}</main>
      </div>
    </>
  );
};

export default Index;
