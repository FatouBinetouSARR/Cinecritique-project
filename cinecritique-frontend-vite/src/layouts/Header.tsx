import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, User, Film, LogOut, Settings, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem("accessToken");
  const username = localStorage.getItem("username") || "U";
  const email = localStorage.getItem("email") || "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const links = [
    { label: "Accueil", path: "/" },
    { label: "Films", path: "/movies", icon: <Film className="h-4 w-4" /> },
    { label: "Les mieux notés", path: "/top-rated"},
    { label: "Mes critiques", path: "/my-reviews", icon: <User className="h-4 w-4" /> },
    ...(isAuthenticated ? [{ label: "", path: "" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Film className="h-6 w-6 text-secondary" />
          </div>
          <span className="text-xl font-bold font-space-grotesk">
            Cine<span className="text-secondary">Critique</span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                isActive(link.path)
                  ? "text-secondary font-bold"
                  : "text-white hover:text-secondary"
              }`}
            >
              {link.icon || null}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search bar desktop */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-sm mx-4 hidden sm:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white h-4 w-4" />
            <Input
              type="search"
              placeholder="Rechercher un film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-secondary text-white placeholder:text-white/50 bg-black"
            />
          </div>
        </form>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                  <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-white">{username}</p>
                    <p className="w-[200px] truncate text-sm text-white/70">{email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-white" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-white" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-white" />
                    Déconnexion
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur border-t border-secondary">
          <form
            onSubmit={handleSearch}
            className="p-4 flex items-center space-x-2"
          >
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-secondary text-white placeholder:text-white/50 bg-black"
            />
            <Button type="submit">Go</Button>
          </form>
          <nav className="flex flex-col space-y-2 p-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-white px-2 py-1 rounded hover:bg-secondary/20 ${
                  isActive(link.path) ? "text-secondary font-bold" : ""
                }`}
              >
                {link.icon || null} {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 mt-2">
                <Link
                  to="/login"
                  className="text-white px-2 py-1 rounded hover:bg-secondary/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="text-white px-2 py-1 rounded hover:bg-secondary/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};




