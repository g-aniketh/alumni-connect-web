import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  description: string;
  subItems?: NavItem[];
}

interface NavigationMenuProps {
  items: NavItem[];
}

export const NavigationMenu = ({ items }: NavigationMenuProps) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isActive = (path?: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const hasActiveSubItem = (item: NavItem) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => isActive(subItem.path));
  };

  const handleMouseEnter = (itemName: string) => {
    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenMenu(itemName);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to prevent accidental closes
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="flex items-center gap-1">
      {items.map(item => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isItemActive = isActive(item.path) || hasActiveSubItem(item);
        const isOpen = openMenu === item.name;

        if (hasSubItems) {
          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md relative",
                  isItemActive
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
                {isItemActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                )}
              </button>

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 mt-2 w-[600px] bg-popover border rounded-lg shadow-xl p-6 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {item.subItems?.map(subItem => {
                      const isSubItemActive = isActive(subItem.path);
                      return (
                        <Link
                          key={subItem.name}
                          to={subItem.path || "#"}
                          className={cn(
                            "flex flex-col gap-3 p-4 rounded-lg border transition-all duration-200 group cursor-pointer relative overflow-hidden",
                            isSubItemActive
                              ? "bg-primary/5 border-primary/40 shadow-sm"
                              : "bg-card border-border hover:bg-accent hover:border-primary/30 hover:shadow-md"
                          )}
                          onClick={() => setOpenMenu(null)}
                        >
                          {/* Active indicator */}
                          {isSubItemActive && (
                            <span className="absolute top-0 left-0 w-1 h-full bg-primary" />
                          )}

                          <div
                            className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200",
                              isSubItemActive
                                ? "bg-primary/20 text-primary"
                                : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-105"
                            )}
                          >
                            {subItem.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                "font-semibold text-sm mb-1.5 transition-colors duration-200",
                                isSubItemActive
                                  ? "text-primary"
                                  : "group-hover:text-primary"
                              )}
                            >
                              {subItem.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {subItem.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            to={item.path || "#"}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md relative",
              isItemActive
                ? "text-primary bg-primary/5"
                : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
            {isItemActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
