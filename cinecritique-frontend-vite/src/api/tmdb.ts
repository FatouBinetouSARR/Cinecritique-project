// src/api/tmdb.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
  );
  if (!res.ok) throw new Error("Erreur API TMDb");
  const data = await res.json();
  return data.results; // tableau de films
};
