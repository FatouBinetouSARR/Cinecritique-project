// src/components/Footer.tsx
import { Link } from "react-router-dom"
import { Star } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-secondary fill-current" />
              <span className="text-xl font-bold font-space-grotesk text-foreground">
                CineCritique
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover, review and rate movies with our passionate community of film enthusiasts. 
              Share your thoughts and find your next favorite film.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="text-muted-foreground hover:text-primary transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Search Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/my-reviews" className="text-muted-foreground hover:text-primary transition-colors">
                  My Reviews
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 CineCritique. Built with passion for cinema.
          </p>
        </div>
      </div>
    </footer>
  )
}
