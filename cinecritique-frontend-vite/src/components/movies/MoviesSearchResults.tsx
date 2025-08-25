// src/components/movies/MoviesSearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MoviesCard } from "./MoviesCard";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export const MoviesSearchResults: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&query=${encodeURIComponent(q)}&language=fr-FR&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Erreur recherche :", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [q]);

  if (loading)
    return <p className="text-white text-center py-10">Chargement...</p>;

  if (!movies.length)
    return (
      <p className="text-white text-center py-10">
        Aucun résultat pour "{q}"
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <h2 className="text-xl font-bold mb-6">Résultats pour "{q}"</h2>

      {/* Résultats en grille */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MoviesCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};
