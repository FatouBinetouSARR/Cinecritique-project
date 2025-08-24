// src/components/home/PopularMovies.tsx
import React, { useEffect, useState } from "react";
import { MovieCard } from "../movies/MovieCard";
import { getPopularMovies } from "../../api/tmdb";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

export const PopularMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getPopularMovies()
      .then(setMovies)
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-12 px-4 md:px-8 relative">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white font-space-grotesk">
          Films populaires
        </h2>
        <p className="text-white/70 text-sm md:text-base">
          Les films tendance appréciés par notre communauté
        </p>
      </div>

      <div className="overflow-hidden relative">
        <div className="flex animate-scroll gap-2 md:gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[40%] sm:w-[35%] md:w-[25%] lg:w-[15%]"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 35s linear infinite;
          }
        `}
      </style>
    </section>
  );
};
