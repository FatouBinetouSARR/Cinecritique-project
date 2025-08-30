// src/components/membres/MembrePage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTopCritics } from "../../api/reviewService";

interface TopCritic {
  _id: string;
  reviewCount: number;
  totalLikes: number;
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

export const CriticsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"reviewCount" | "totalLikes">("reviewCount");
  const [critics, setCritics] = useState<TopCritic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCritics = async () => {
      try {
        setLoading(true);
        const data = await getTopCritics(50); // Récupérer plus de critiques
        setCritics(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des critiques:', err);
        setError('Erreur lors du chargement des critiques');
      } finally {
        setLoading(false);
      }
    };

    fetchCritics();
  }, []);

  const sortedUsers = [...critics]
    .filter((critic) => 
      critic.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      critic.user?.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "reviewCount" ? b.reviewCount - a.reviewCount : b.totalLikes - a.totalLikes
    );

  const popularMembers = sortedUsers.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen text-white bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>Chargement des critiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-neutral-950">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* --- Critiques populaires --- */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
            <h2 className="text-2xl font-bold">Critiques populaires</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Recherche par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "reviewCount" | "totalLikes")}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              >
                <option value="reviewCount">Nombre de critiques</option>
                <option value="totalLikes">Total des likes</option>
              </select>
            </div>
          </div>

          {/* Table-like header */}
          <div className="grid grid-cols-3 px-4 py-2 bg-gray-800 text-gray-400 text-sm font-semibold rounded-t">
            <span>Nom</span>
            <span className="text-center">Goûts</span>
            <span className="text-right">Avis</span>
          </div>

          {/* Users list */}
          <div className="divide-y divide-gray-800 border border-gray-800 rounded-b">
            {sortedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Aucun critique trouvé
              </div>
            ) : (
              sortedUsers.map((critic, index) => (
                <div
                  key={critic._id}
                  className="grid grid-cols-3 items-center px-4 py-3 hover:bg-gray-800 transition-colors"
                >
                  {/* Nom + avatar */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-6">{index + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {critic.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <Link to={`/profile/${critic._id}`} className="font-medium hover:underline">
                        {critic.user?.username || 'Utilisateur inconnu'}
                      </Link>
                    </div>
                  </div>

                  {/* Likes / Goûts */}
                  <span className="text-center text-gray-300">
                    ❤️ {critic.totalLikes.toLocaleString()}
                  </span>
                  <span className="text-right text-gray-400 text-sm">
                    {critic.reviewCount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Membres populaires --- */}
        <aside className="w-64 hidden lg:block">
          <h3 className="text-xl font-bold mb-4">Membres populaires</h3>
          <div className="flex flex-col divide-y divide-gray-800 border border-gray-800 rounded-md">
            {popularMembers.map((critic) => (
              <Link
                key={critic._id}
                to={`/profile/${critic._id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-black font-bold">
                    {critic.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{critic.user?.username || 'Utilisateur inconnu'}</p>
                  <p className="text-gray-400 text-sm">
                    {critic.reviewCount.toLocaleString()} critiques
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};
