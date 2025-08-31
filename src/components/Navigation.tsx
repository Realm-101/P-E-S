import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'reflections', label: 'Reflections' },
    { key: 'about', label: 'About' },
  ];

  return (
    <nav className="flex space-x-6 md:space-x-8 text-lg">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
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