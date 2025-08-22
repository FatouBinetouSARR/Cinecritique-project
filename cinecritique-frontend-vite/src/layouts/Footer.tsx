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
              Découvrez, critiquez et notez des films avec notre communauté passionnée de cinéphiles. 
              Partagez vos avis et trouvez votre prochain film préféré.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explorer</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-blue-500 transition-colors">
                  Films Populaires
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="text-muted-foreground hover:text-blue-500 transition-colors">
                   Les Mieux Notés
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-blue-500 transition-colors">
                  Rechercher un Film
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Compte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-blue-500 transition-colors">
                  Se Connecter
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-blue-500 transition-colors">
                  S’inscrire
                </Link>
              </li>
              <li>
                <Link to="/my-reviews" className="text-muted-foreground hover:text-blue-500 transition-colors">
                  Mes Critiques
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 CineCritique. Construit avec passion pour le cinéma.
          </p>
        </div>
      </div>
    </footer>
  )
}