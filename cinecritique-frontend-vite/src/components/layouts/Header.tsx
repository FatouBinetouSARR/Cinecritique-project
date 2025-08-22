import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, User, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-secondary fill-current" />
            <span className="text-2xl font-bold font-space-grotesk text-foreground">
              CineCritique
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/top-rated" className="text-foreground hover:text-primary transition-colors">
              Top Rated
            </Link>
            <Link to="/my-reviews" className="text-foreground hover:text-primary transition-colors">
              My Reviews
            </Link>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Link to="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
