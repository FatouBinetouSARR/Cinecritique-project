import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 🟢 Ajout de "now_playing"
export type Category = "popular" | "top_rated" | "upcoming" | "now_playing";

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
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status}`);
        }
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Erreur lors du chargement des films :", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  return { movies, loading };
};
