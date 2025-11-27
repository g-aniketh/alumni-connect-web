import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, GraduationCap } from "lucide-react";
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

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Alumni", path: "/alumni" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
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
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
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
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
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
                  {navLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
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
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
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
