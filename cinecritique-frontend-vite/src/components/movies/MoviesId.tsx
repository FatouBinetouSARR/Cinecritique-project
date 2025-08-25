import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Play, X } from "lucide-react";
import { ReviewsPage } from "../reviews/ReviewsPage";

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  overview: string;
  vote_average: number;
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  videos?: {
    results: { key: string; site: string; type: string; name: string }[];
  };
}

export const MoviesId: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=credits,videos`
      );
      const data = await res.json();

      const ytTrailer = data.videos?.results.find(
        (v: { key: string; site: string; type: string; name: string }) =>
          v.site === "YouTube" && v.type === "Trailer"
      );

      setMovie(data);
      setTrailerKey(ytTrailer ? ytTrailer.key : null);
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div className="text-center p-10 text-gray-400">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 🎬 Backdrop */}
      {movie.backdrop_path && (
        <div
          className="relative h-[60vh] bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="absolute bottom-8 left-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
            <p className="mt-2 text-gray-300">{movie.release_date} • {movie.runtime} min</p>
            <p className="mt-4 text-sm md:text-base max-w-xl text-gray-200">{movie.overview}</p>
          </div>
        </div>
      )}

      {/* 📝 Infos principales */}
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1 flex justify-center">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg w-72"
            />
          ) : (
            <div className="w-72 h-[400px] bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              Pas d’affiche
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="md:col-span-2 space-y-4">
          {/* Note */}
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-semibold">{movie.vote_average.toFixed(1)} / 10</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                {g.name}
              </span>
            ))}
          </div>

          {/* Trailer */}
          {trailerKey && (
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded"
            >
              <Play className="w-5 h-5" /> Regarder la bande-annonce
            </button>
          )}
        </div>
      </div>

      {/* 🎭 Casting */}
      {movie.credits?.cast && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Casting principal</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {movie.credits.cast.slice(0, 12).map((actor) => (
              <Link
                to={`/person/${actor.id}`}
                key={actor.id}
                className="group block text-center hover:scale-105 transition-transform duration-300"
              >
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-40 object-cover rounded-md shadow-md group-hover:shadow-xl mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-xs mb-2">
                    Pas d’image
                  </div>
                )}
                <p className="font-semibold text-sm truncate group-hover:text-yellow-400">{actor.name}</p>
                <p className="text-xs text-gray-400 truncate">{actor.character}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 💬 Critiques */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Critiques</h2>
        <ReviewsPage mode="all" movieId={movie.id} />
      </div>

      {/* 🎥 Modal Trailer */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-70 p-2 rounded-full hover:bg-opacity-100"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

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
