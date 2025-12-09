import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRole, type Alumni, type Student, type College } from "../../types";
import { tokenService } from "../../lib/api";
import LanguageBar from "./LanguageBar";

const Navbar = () => {
  const {
    user: contextUser,
    logout,
    isAuthenticated: contextIsAuthenticated,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const storedUser = tokenService.getUser();
      const token = tokenService.getAccessToken();
      const roleFromToken = token ? tokenService.getRoleFromToken() : null;
      if (
        storedUser &&
        token &&
        roleFromToken &&
        storedUser.role !== roleFromToken
      ) {
        tokenService.clearUser();
        return null;
      }
      return (
        contextUser ||
        storedUser ||
        (roleFromToken
          ? ({ id: "", name: "", email: "", role: roleFromToken } as
            | Alumni
            | Student
            | College)
          : null)
      );
    } catch {
      return null;
    }
  }, [contextUser]);

  const isAuthenticated =
    contextIsAuthenticated ||
    (user !== null && tokenService.getAccessToken() !== null);

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case UserRole.Student:
        return [
          { name: "Dashboard", path: "/student/dashboard" },
          { name: "Alumni", path: "/student/alumni" },
          { name: "Jobs", path: "/jobs" },
          { name: "Events", path: "/events" },
          { name: "Explorer", path: "/domain-explorer" },
          { name: "Skill Radar", path: "/skill-radar" },
        ];
      case UserRole.Alumni:
        return [
          { name: "Dashboard", path: "/alumni/dashboard" },
          { name: "Network", path: "/alumni/network" },
          { name: "Events", path: "/events" },
          { name: "LinkedIn Feed", path: "/alumni/linkedin-feed" },
          { name: "Jobs", path: "/jobs" },
          { name: "Mentorships", path: "/alumni/mentorships" },
        ];
      case UserRole.College:
        return [
          { name: "Dashboard", path: "/college/dashboard" },
          { name: "Alumni", path: "/college/alumni" },
          { name: "Students", path: "/college/students" },
          { name: "Jobs", path: "/college/jobs" },
          { name: "Events", path: "/college/events" },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <LanguageBar />
      <header className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-gray-200 shadow-lg px-6 py-3 flex items-center">
          <Link to="/" className="mr-8 flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dj6i0b4q2/image/upload/v1765264961/image-removebg-preview_4_rc5dsk.png"
              alt="Alumni Connect Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-lg hidden sm:inline">AlumniConnect</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-colors hover:text-black ${location.pathname.startsWith(item.path)
                  ? "text-black"
                  : "text-gray-500"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-full px-6">
                <Link to="/login">Get Started</Link>
              </Button>
            )}
          </div>

          <div className="md:hidden ml-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <Link to="/" className="flex items-center space-x-2 mb-8">
                  <img
                    src="https://res.cloudinary.com/dj6i0b4q2/image/upload/v1765264961/image-removebg-preview_4_rc5dsk.png"
                    alt="Alumni Connect Logo"
                    className="h-10 w-auto object-contain"
                  />
                  <span className="font-bold text-lg">AlumniConnect</span>
                </Link>
                <nav className="grid gap-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-semibold transition-colors hover:text-black ${location.pathname.startsWith(item.path)
                        ? "text-black"
                        : "text-gray-500"
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
