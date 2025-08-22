import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, User, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem("accessToken");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold font-space-grotesk text-orange-400">
              CineCritique
            </span>
          </Link>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Rechercher un film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`${
                isActive("/") ? "text-orange-400 font-bold" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            >
              Accueil
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/top-rated"
                  className={`${
                    isActive("/top-rated") ? "text-orange-400 font-bold" : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  Les mieux notés
                </Link>
                <Link
                  to="/my-reviews"
                  className={`${
                    isActive("/my-reviews") ? "text-orange-400 font-bold" : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  Mes critiques
                </Link>
                <Link
                  to="/profile"
                  className={`${
                    isActive("/profile") ? "text-orange-400 font-bold" : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  Profil
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  <User className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link to="/login">
                  <Button
                    size="sm"
                    className={`${
                      isActive("/login")
                        ? "bg-orange-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-orange-600 hover:text-white"
                    }`}
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className={`${
                      isActive("/register")
                        ? "bg-orange-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-orange-600 hover:text-white"
                    }`}
                  >
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
