// src/components/movies/MoviesPage.tsx
import React, { useMemo, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMovies } from "../../hooks/useMovies";
import { CompactMovieCard } from "./CompactMovieCard";

export interface CompactMovie {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  reviewCount: number;
  fileSize: string; // ex: "368 Ko"
}

export const MoviesPage: React.FC = () => {
  const { movies: popularRaw, loading } = useMovies("popular");
  const [search, setSearch] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);

  // Transformer les données pour l'affichage
  const popularMovies: CompactMovie[] = useMemo(
    () =>
      popularRaw
        .map((m) => ({
          id: m.id,
          title: m.title,
          posterPath: m.poster_path
            ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
            : "/placeholder.png",
          rating: Math.round(m.vote_average * 10) / 10,
          reviewCount: m.vote_count,
          fileSize: "368 Ko",
        }))
        .filter((m) => m.title.toLowerCase().includes(search.toLowerCase())),
    [popularRaw, search]
  );

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth / 2;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) return <p className="text-white text-center py-10">Chargement...</p>;

  return (
    <div className="min-h-screen text-white px-4 py-6 ">
      {/* Barre de recherche + filtres */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Trouver un film"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-400 w-full md:w-1/3"
        />
        <div className="flex flex-wrap gap-2 text-sm text-gray-300">
          {["Année", "Notation", "Populaire", "Genre", "Service", "Autre"].map((f) => (
            <button
              key={f}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Films populaires cette semaine */}
      <div className="mb-6 relative">
        <h2 className="text-xl font-bold mb-2">Films populaires cette semaine</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide" ref={sliderRef}>
          {popularMovies.map((movie) => (
            <CompactMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {/* Flèches */}
        <button
          className="absolute top-1/2 -left-2 -translate-y-1/2 bg-gray-700 p-2 rounded-full hover:bg-gray-600 z-10"
          onClick={() => scrollSlider("left")}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          className="absolute top-1/2 -right-2 -translate-y-1/2 bg-gray-700 p-2 rounded-full hover:bg-gray-600 z-10"
          onClick={() => scrollSlider("right")}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Section Top Rated */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Top Rated</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularMovies.slice(0, 10).map((movie) => (
            <CompactMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Section Nouveautés */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Nouveautés</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularMovies.slice(-10).map((movie) => (
            <CompactMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};
