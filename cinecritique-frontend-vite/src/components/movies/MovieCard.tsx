// src/components/movies/MovieCard.tsx
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const year = new Date(movie.release_date).getFullYear();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md w-full h-full"
    >
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.svg"}
        alt={`${movie.title} poster`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {movie.title} ({year})
        </h3>
      </div>
    </div>
  );
};
