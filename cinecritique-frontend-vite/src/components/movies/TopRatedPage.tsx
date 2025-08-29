// src/components/movies/TopRatedPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Star, Film } from "lucide-react";

interface TopRatedItem {
  movieId: string;
  avgRating: number;
  reviewCount: number;
}

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

export const TopRatedPage: React.FC = () => {
  const [items, setItems] = useState<TopRatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<TopRatedItem[]>("/reviews/top-rated", {
          params: { minCount: 2, limit: 30 },
        });
        setItems(data);
      } catch {
        setError("Impossible de charger le classement");
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  const [tmdbMap, setTmdbMap] = useState<Record<string, TmdbMovie>>({});

  useEffect(() => {
    const loadDetails = async () => {
      if (items.length === 0) return;
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
      const uniqueIds = Array.from(new Set(items.map((i) => i.movieId)));

      const chunks: string[][] = [];
      for (let i = 0; i < uniqueIds.length; i += 8) chunks.push(uniqueIds.slice(i, i + 8));

      const results: Record<string, TmdbMovie> = {};
      for (const batch of chunks) {
        const batchResults = await Promise.all(
          batch.map(async (id) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=fr-FR`
              );
              if (!res.ok) throw new Error("TMDB error");
              const data = (await res.json()) as TmdbMovie;
              return { id, data } as { id: string; data: TmdbMovie };
            } catch {
              return { id, data: { id: Number(id), title: "Film", poster_path: null } as TmdbMovie };
            }
          })
        );
        for (const r of batchResults) results[r.id] = r.data;
      }
      setTmdbMap(results);
    };
    loadDetails();
  }, [items]);

  const combined = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        tmdb: tmdbMap[i.movieId],
      })),
    [items, tmdbMap]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-900 bg-neutral-950/60 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <Film className="w-7 h-7 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold">Classement des films les mieux notés</h1>
            <p className="text-sm text-neutral-400">Calculé à partir des notes des utilisateurs</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {loading && <div className="text-neutral-400">Chargement…</div>}

        {!loading && combined.length === 0 && (
          <p className="text-neutral-400">Pas encore de classement disponible.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {combined.map((it, idx) => (
            <Link
              to={`/movies/${it.movieId}`}
              key={it.movieId}
              className="group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors"
            >
              <div className="relative">
                {it.tmdb?.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${it.tmdb.poster_path}`}
                    alt={it.tmdb.title}
                    className="w-full h-[420px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[420px] bg-neutral-800 flex items-center justify-center text-neutral-400">
                    Aucune affiche
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                  #{idx + 1}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1 group-hover:text-yellow-400">
                  {it.tmdb?.title || `Film #${it.movieId}`}
                </h3>
                {it.tmdb?.release_date && (
                  <p className="text-xs text-neutral-400">{new Date(it.tmdb.release_date).getFullYear()}</p>
                )}
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">{it.avgRating.toFixed(2)} / 5</span>
                  <span className="text-xs text-neutral-400">({it.reviewCount} avis)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};
