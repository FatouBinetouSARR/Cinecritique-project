import { Link, useNavigate } from "react-router-dom";
import { Search, User, Star } from "lucide-react";
// Update the import path if Button exists elsewhere, for example:
import { Button } from "../ui/Button";
// Or create the file './ui/Button.tsx' if it does not exist.
import { Input } from "../ui/Input";
import { useState } from "react";

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
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Star className="h-8 w-8 text-yellow-400" />
          <span className="text-2xl font-bold">CineCritique</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full text-gray-900"
            />
          </div>
        </form>

        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/top-rated" className="hover:text-yellow-400">Top Rated</Link>
          <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-1" /> Profile
          </Button>
          <Link to="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
