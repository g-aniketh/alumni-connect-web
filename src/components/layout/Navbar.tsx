import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  GraduationCap,
  LayoutDashboard,
  Search,
  Briefcase,
  Calendar,
  ClipboardList,
  MessageSquare,
  Network,
  Users,
  Heart,
  UserCheck,
  FileText,
} from "lucide-react";
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
import { NavigationMenu } from "./NavigationMenu";
import { tokenService } from "../../lib/api";

const Navbar = () => {
  const {
    user: contextUser,
    logout,
    isAuthenticated: contextIsAuthenticated,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user from localStorage immediately (for instant navbar display on refresh)
  // Read once on mount - contextUser will take priority once it loads
  const { storedUser, tokenRole } = useMemo(() => {
    try {
      const user = tokenService.getUser();
      const token = tokenService.getAccessToken();
      const roleFromToken = token ? tokenService.getRoleFromToken() : null;

      // Validate stored user role against token role (source of truth)
      if (user && token && roleFromToken) {
        // If roles don't match, the stored user is stale/wrong - clear it but keep tokens
        if (user.role !== roleFromToken) {
          console.warn(
            "Stored user role doesn't match token role, clearing stored user"
          );
          tokenService.clearUser();
          return { storedUser: null, tokenRole: roleFromToken };
        }
      }

      return { storedUser: user, tokenRole: roleFromToken };
    } catch {
      return { storedUser: null, tokenRole: null };
    }
  }, []); // Only read once on mount

  // Use context user if available (most up-to-date), otherwise fall back to validated stored user
  // If no stored user but we have token role, create minimal user object for navbar display
  const user =
    contextUser ||
    storedUser ||
    (tokenRole
      ? ({
          id: "",
          name: "",
          email: "",
          role: tokenRole,
        } as Alumni | Student | College)
      : null);

  const isAuthenticated =
    contextIsAuthenticated ||
    (storedUser !== null && tokenService.getAccessToken() !== null) ||
    (tokenRole !== null && tokenService.getAccessToken() !== null);

  const getNavigationItems = () => {
    if (!user || !isAuthenticated) {
      return [
        {
          name: "Home",
          path: "/",
          icon: <GraduationCap className="h-4 w-4" />,
          description: "Welcome to Alumni Connect",
        },
      ];
    }

    switch (user.role) {
      case UserRole.Student:
        return [
          {
            name: "Dashboard",
            path: "/student/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            description: "View your dashboard overview",
          },
          {
            name: "Explore",
            icon: <Search className="h-4 w-4" />,
            description: "Discover opportunities and connect",
            subItems: [
              {
                name: "Alumni Directory",
                path: "/student/alumni",
                icon: <Users className="h-5 w-5" />,
                description: "Browse and connect with alumni mentors",
              },
              {
                name: "Jobs",
                path: "/jobs",
                icon: <Briefcase className="h-5 w-5" />,
                description: "Find job opportunities and internships",
              },
              {
                name: "Events",
                path: "/events",
                icon: <Calendar className="h-5 w-5" />,
                description: "Discover and register for events",
              },
            ],
          },
          {
            name: "My Activity",
            icon: <ClipboardList className="h-4 w-4" />,
            description: "Manage your applications and activities",
            subItems: [
              {
                name: "Applications",
                path: "/student/applications",
                icon: <FileText className="h-5 w-5" />,
                description: "Track your job applications status",
              },
              {
                name: "Mentorships",
                path: "/student/mentorships",
                icon: <MessageSquare className="h-5 w-5" />,
                description: "View and manage your mentorship requests",
              },
              {
                name: "My Events",
                path: "/student/events",
                icon: <Calendar className="h-5 w-5" />,
                description: "View your event registrations",
              },
            ],
          },
        ];

      case UserRole.Alumni:
        return [
          {
            name: "Dashboard",
            path: "/alumni/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            description: "View your dashboard overview",
          },
          {
            name: "Network",
            icon: <Network className="h-4 w-4" />,
            description: "Connect with alumni and students",
            subItems: [
              {
                name: "Alumni Network",
                path: "/alumni/network",
                icon: <Users className="h-5 w-5" />,
                description: "Connect with fellow alumni from your institution",
              },
              {
                name: "Connected Alumni",
                path: "/alumni/connected-alumni",
                icon: <Users className="h-5 w-5" />,
                description: "View alumni you have connected with",
              },
              {
                name: "Students",
                path: "/alumni/students",
                icon: <GraduationCap className="h-5 w-5" />,
                description: "View students from your college",
              },
              {
                name: "Connected Students",
                path: "/alumni/connected-students",
                icon: <GraduationCap className="h-5 w-5" />,
                description: "View students you are mentoring",
              },
            ],
          },
          {
            name: "Explore",
            icon: <Search className="h-4 w-4" />,
            description: "Browse jobs and events",
            subItems: [
              {
                name: "Jobs",
                path: "/jobs",
                icon: <Briefcase className="h-5 w-5" />,
                description: "Browse and post job opportunities",
              },
              {
                name: "Events",
                path: "/events",
                icon: <Calendar className="h-5 w-5" />,
                description: "Discover and organize events",
              },
            ],
          },
          {
            name: "My Content",
            icon: <ClipboardList className="h-4 w-4" />,
            description: "Manage your posted jobs and events",
            subItems: [
              {
                name: "My Jobs",
                path: "/alumni/jobs",
                icon: <Briefcase className="h-5 w-5" />,
                description: "Manage your posted job listings",
              },
              {
                name: "My Events",
                path: "/alumni/events",
                icon: <Calendar className="h-5 w-5" />,
                description: "Manage your organized events",
              },
              {
                name: "Applications",
                path: "/alumni/jobs/applications",
                icon: <FileText className="h-5 w-5" />,
                description: "Review applications for your jobs",
              },
            ],
          },
          {
            name: "Mentorships",
            path: "/alumni/mentorships",
            icon: <MessageSquare className="h-4 w-4" />,
            description: "Manage mentorship requests and active mentorships",
          },
        ];

      case UserRole.College:
        return [
          {
            name: "Dashboard",
            path: "/college/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            description: "View your dashboard overview",
          },
          {
            name: "People",
            icon: <Users className="h-4 w-4" />,
            description: "Manage alumni and students",
            subItems: [
              {
                name: "Alumni",
                path: "/college/alumni",
                icon: <UserCheck className="h-5 w-5" />,
                description: "View and verify alumni accounts",
              },
              {
                name: "Students",
                path: "/college/students",
                icon: <GraduationCap className="h-5 w-5" />,
                description: "View and verify student accounts",
              },
            ],
          },
          {
            name: "Explore",
            icon: <Search className="h-4 w-4" />,
            description: "Browse jobs, events, and campaigns",
            subItems: [
              {
                name: "Jobs",
                path: "/jobs",
                icon: <Briefcase className="h-5 w-5" />,
                description: "Browse and post job opportunities",
              },
              {
                name: "Events",
                path: "/events",
                icon: <Calendar className="h-5 w-5" />,
                description: "Discover and organize events",
              },
              {
                name: "Campaigns",
                path: "/events",
                icon: <Heart className="h-5 w-5" />,
                description: "Create and manage fundraising campaigns",
              },
            ],
          },
          {
            name: "My Content",
            icon: <ClipboardList className="h-4 w-4" />,
            description: "Manage your posted jobs and events",
            subItems: [
              {
                name: "My Jobs",
                path: "/college/jobs",
                icon: <Briefcase className="h-5 w-5" />,
                description: "Manage your posted job listings",
              },
              {
                name: "My Events",
                path: "/college/events",
                icon: <Calendar className="h-5 w-5" />,
                description: "Manage your organized events",
              },
              {
                name: "Applications",
                path: "/college/jobs/applications",
                icon: <FileText className="h-5 w-5" />,
                description: "Review applications for your jobs",
              },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
          >
            <GraduationCap className="h-6 w-6" />
            <span>Alumni Connect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu items={navigationItems} />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={
                      user.role === UserRole.Student
                        ? "/student/dashboard"
                        : user.role === UserRole.Alumni
                        ? "/alumni/dashboard"
                        : user.role === UserRole.College
                        ? "/college/dashboard"
                        : "/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-bold text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <GraduationCap className="h-6 w-6" />
                  <span>Alumni Connect</span>
                </Link>
                <div className="flex flex-col gap-4">
                  {navigationItems.map(item => {
                    if (item.subItems && item.subItems.length > 0) {
                      return (
                        <div key={item.name} className="space-y-2">
                          <p className="text-sm font-semibold text-muted-foreground">
                            {item.name}
                          </p>
                          {item.subItems.map(subItem => (
                            <Link
                              key={subItem.name}
                              to={subItem.path || "#"}
                              className={`block text-base font-medium transition-colors hover:text-primary pl-4 ${
                                location.pathname === subItem.path
                                  ? "text-primary"
                                  : ""
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.name}
                        to={item.path || "#"}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                          location.pathname === item.path ? "text-primary" : ""
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t pt-4">
                  {isAuthenticated && user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={async () => {
                          await logout();
                          setIsOpen(false);
                          navigate("/login");
                        }}
                      >
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link to="/login">Log in</Link>
                      </Button>
                      <Button asChild onClick={() => setIsOpen(false)}>
                        <Link to="/signup">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
