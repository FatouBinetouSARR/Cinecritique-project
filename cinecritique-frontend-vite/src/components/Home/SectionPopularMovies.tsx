import React from "react";
import { MovieCard } from "../movies/MovieCard";
import { dataMovies } from "../../data/dataMovies";

export const PopularMovies: React.FC = () => {
  const movieList = [...dataMovies, ...dataMovies];

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

      {/* Conteneur défilement horizontal */}
      <div className="overflow-hidden relative">
        <div className="flex animate-scroll gap-2 md:gap-4">
          {movieList.map((movie, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[40%] sm:w-[35%] md:w-[25%] lg:w-[15%]"
            >
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>

      {/* Styles pour l'animation */}
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
