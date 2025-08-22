import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-black shadow-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                🎬 CineCritique
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-blue-500 text-white"
                    : "border-transparent text-gray-300 hover:border-gray-400 hover:text-white"
                }`}
              >
                Accueil
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/profile")
                      ? "border-blue-500 text-white"
                      : "border-transparent text-gray-300 hover:border-gray-400 hover:text-white"
                  }`}
                >
                  Mon Profil
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  window.location.href = "/login";
                }}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Se déconnecter
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/login")
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/register")
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
