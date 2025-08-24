// src/hooks/useMovies.ts
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type Category = "popular" | "top_rated" | "upcoming";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export const useMovies = (category: Category = "popular") => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=fr-FR&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  return { movies, loading };
};
