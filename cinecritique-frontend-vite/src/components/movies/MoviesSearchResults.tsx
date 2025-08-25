// src/components/movies/MoviesSearchResults.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { CompactMovieCard } from "./CompactMovieCard";

interface Movie {
  id: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  fileSize?: string;
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
          `https://api.themoviedb.org/3/search/movie?api_key=<<YOUR_TMDB_KEY>>&query=${encodeURIComponent(
            q
          )}&language=fr-FR&page=1`
        );
        const data = await res.json();
        setMovies(
          data.results.map((m: Movie) => ({
            ...m,
            fileSize: "368 Ko", // tu peux calculer la taille réelle si tu veux
          }))
        );
      } catch (err) {
        console.error(err);
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
      <h2 className="text-xl font-bold mb-4">Résultats pour "{q}"</h2>

      {/* Résultats sous forme de grille */}
      {/* <div className="flex flex-wrap gap-4">
        {movies.map((movie) => (
          <CompactMovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              posterPath: movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "/placeholder.png",
              rating: Math.round(movie.vote_average * 10) / 10,
              reviewCount: movie.vote_count,
              fileSize: movie.fileSize!,
            }}
          />
        ))}
      </div> */}
    </div>
  );
};
