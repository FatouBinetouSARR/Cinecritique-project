// src/layouts/Header.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Film, LogOut, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import { useAuth } from "../lib/useAuth";
import { AuthModal } from "../components/auth-modal/AuthModal"; // 👈 importer le modal

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false); // état pour modal
  const [authMode, setAuthMode] = useState<"login" | "register">("login"); // mode login/register
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, authLoading, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // couter l'vnement de switch mode depuis le modal
  useEffect(() => {
    const onSwitchMode = (e: CustomEvent) => {
      setAuthMode(e.detail);
    };
    const onOpenAuth = () => {
      setAuthModalOpen(true);
    };
    window.addEventListener("switchAuthMode", onSwitchMode as unknown as EventListener);
    window.addEventListener("openAuthModal", onOpenAuth as unknown as EventListener);
    return () => {
      window.removeEventListener("switchAuthMode", onSwitchMode as unknown as EventListener);
      window.removeEventListener("openAuthModal", onOpenAuth as unknown as EventListener);
    };
  }, []);

  const links = [
    { label: "Films", path: "/movies", icon: <Film className="h-4 w-4" /> },
    { label: "Membres", path: "/critics" },
    ...(isAuthenticated
      ? [
          { label: "Mes avis", path: "/reviews", icon: <span className="h-4 w-4">📝</span> },
          { label: "Profile", path: "/profile", icon: <User className="h-4 w-4" /> },
        ]
      : []),
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, isAuthenticated]);

  if (authLoading) return null;

  return (
    <>
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
          <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-4 hidden sm:block">
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
              <div className="hidden sm:flex items-center space-x-2">
                <Button onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" /> Déconnexion
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}>
                  Se connecter
                </Button>
                <Button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }}>
                  S'inscrire
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
            <form onSubmit={handleSearch} className="p-4 flex items-center space-x-2">
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
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthMode("login"); setAuthModalOpen(true); }}
                    className="text-left text-white px-2 py-1 rounded hover:bg-secondary/20"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthMode("register"); setAuthModalOpen(true); }}
                    className="text-left text-white px-2 py-1 rounded hover:bg-secondary/20"
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
};
