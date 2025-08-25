// src/components/movies/MoviesPage.tsx
import React, { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMovies } from "../../hooks/useMovies";
import type { Movie as MovieType } from "../../hooks/useMovies";

import { MoviesCard } from "./MoviesCard";
import { Link } from "react-router-dom";

export const MoviesPage: React.FC = () => {
  const { movies: popularRaw, loading: loadingPopular } = useMovies("popular");
  const { movies: topRatedRaw, loading: loadingTop } = useMovies("top_rated");
  const { movies: newRaw, loading: loadingNew } = useMovies("now_playing");

  const sliderRefs = {
    popular: useRef<HTMLDivElement | null>(null),
    top: useRef<HTMLDivElement | null>(null),
    new: useRef<HTMLDivElement | null>(null),
  };

  const scrollSlider = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    if (!ref.current) return;
    const scrollAmount = ref.current.clientWidth;
    ref.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const buildMovies = (raw: MovieType[]): MovieType[] =>
    raw.map((m) => ({
      id: m.id,
      title: m.title,
      release_date: m.release_date,
      poster_path: m.poster_path,
      overview: m.overview,
      vote_average: m.vote_average,
      vote_count: m.vote_count,
      genre_ids: m.genre_ids,
    }));

  const popularMovies = useMemo(() => buildMovies(popularRaw), [popularRaw]);
  const topRatedMovies = useMemo(() => buildMovies(topRatedRaw), [topRatedRaw]);
  const newMovies = useMemo(() => buildMovies(newRaw), [newRaw]);

  if (loadingPopular || loadingTop || loadingNew) {
    return <p className="text-white text-center py-10">Chargement...</p>;
  }

  const Section = ({
    title,
    link,
    movies,
    sliderKey,
  }: {
    title: string;
    link: string;
    movies: MovieType[];
    sliderKey: keyof typeof sliderRefs;
  }) => (
    <div className="mb-12 relative">
      {/* Titre cliquable */}
      <Link
        to={link}
        className="text-2xl font-bold mb-4 block hover:text-blue-500 transition-colors"
      >
        {title}
      </Link>

      <div className="relative">
        <div
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          ref={sliderRefs[sliderKey]}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] h-[400px]"
            >
              <MoviesCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Flèches */}
        <button
          className="absolute top-1/2 -left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full z-10"
          onClick={() => scrollSlider(sliderRefs[sliderKey], "left")}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          className="absolute top-1/2 -right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full z-10"
          onClick={() => scrollSlider(sliderRefs[sliderKey], "right")}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8 space-y-12">
      <Section
        title="Films populaires cette semaine"
        link="/popular"
        movies={popularMovies}
        sliderKey="popular"
      />
      <Section
        title="Les mieux Notés"
        link="/top-rated"
        movies={topRatedMovies}
        sliderKey="top"
      />
      <Section
        title="Nouveautés"
        link="/new-releases"
        movies={newMovies}
        sliderKey="new"
      />
    </div>
  );
};
