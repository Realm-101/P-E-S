import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'reflections', label: 'Reflections' },
    { key: 'blog', label: 'Blog' },
    { key: 'about', label: 'About' },
    { key: 'chat', label: 'Chat with G_5.0' },
  ];

  const handleNavClick = (key: string) => {
    onNavigate(key);
  };

  return (
    <nav className="flex space-x-6 md:space-x-8 text-lg">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => handleNavClick(item.key)}
          className={cn(
            "nav-link",
            (currentPage === item.key || 
             (item.key === 'reflections' && currentPage.startsWith('log_'))) && "active"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};