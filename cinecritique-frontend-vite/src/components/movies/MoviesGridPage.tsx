// src/components/movies/MoviesGridPage.tsx
import { useParams } from "react-router-dom";
import { useMovies } from "../../hooks/useMovies";
import type { Movie } from "../../hooks/useMovies";
import { MoviesCard } from "./MoviesCard";
import { Link } from "react-router-dom";

export const MoviesGridPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  // mapping route → catégorie TMDB
  const map: Record<string, "popular" | "top_rated" | "now_playing"> = {
    "popular": "popular",
    "top-rated": "top_rated",
    "new-releases": "now_playing",
  };

  const category = map[type ?? "popular"];
  const { movies, loading } = useMovies(category);

  if (loading) {
    return <p className="text-white text-center py-10">Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {type === "popular" && "Films Populaires"}
        {type === "top-rated" && "Les mieux notés"}
        {type === "new-releases" && "Nouveautés"}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
        {movies.map((movie: Movie) => (
          <MoviesCard key={movie.id} movie={movie} />
        ))}
      </div>
      {/* Retour */}
            <div className="text-center py-6">
              <Link
                to="/movies"
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
              >
                ⬅ Retour
              </Link>
            </div>
    </div>
  );
};
