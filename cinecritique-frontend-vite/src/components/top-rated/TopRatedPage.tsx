import React, { useState } from "react";
import { Star, Trophy, TrendingUp, Users, Filter } from "lucide-react";
import { dataMovies } from "../../data/dataMovies"; // adapte le chemin selon ton projet

// Type pour options de tri
type SortOption = "rating" | "reviews" | "year";

// Type du film
interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  runtime: number;
  genres: string[];
  rating: number;
  reviewCount: number;
  overview: string;
  year?: number;
}

export const TopRatedPage: React.FC = () => {
  // enrichir dataMovies avec year extrait de releaseDate
  const initialMovies: Movie[] = dataMovies.map((movie) => ({
    ...movie,
    year: new Date(movie.releaseDate).getFullYear(),
  }));

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    const sortedMovies = [...movies].sort((a, b) => {
      switch (option) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "year":
          return (b.year ?? 0) - (a.year ?? 0);
        default:
          return 0;
      }
    });
    setMovies(sortedMovies);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-4 h-4 text-gray-400"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-gray-700 ">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Top Rated Movies</h1>
          </div>
          <p className="text-gray-400 mb-6">
            Découvrez les films les mieux notés par la communauté
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
              <Star className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Note moyenne</p>
                <p className="text-xl font-bold">4.7/5</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Avis totaux</p>
                <p className="text-xl font-bold">
                  {movies.reduce((sum, m) => sum + m.reviewCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Films listés</p>
                <p className="text-xl font-bold">{movies.length}</p>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Trier par :</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
            >
              <option value="rating">Mieux notés</option>
              <option value="reviews">Plus d'avis</option>
              <option value="year">Plus récents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
            >
              <div className="relative">
                {/* Ranking Badge */}
                <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black px-2 py-1 rounded font-bold text-sm">
                  #{index + 1}
                </div>

                {/* Poster */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={movie.posterPath || "/placeholder.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-yellow-400">
                  {movie.title}
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{movie.year}</span>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map((g) => (
                      <span
                        key={g}
                        className="px-2 py-1 bg-gray-700 text-xs rounded"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {renderStars(movie.rating)}
                    <span className="text-sm font-semibold text-yellow-400">
                      {movie.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    {movie.reviewCount.toLocaleString()}
                  </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                  {movie.overview}
                </p>

                <a
                  href={`/movie/${movie.id}`}
                  className="block text-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded py-2 transition"
                >
                  Voir détails
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
