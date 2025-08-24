import { useNavigate } from "react-router-dom";
import { dataMovies } from "../../data/dataMovies";

interface MovieCardProps {
  movieId: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movieId }) => {
  const navigate = useNavigate();
  const movie = dataMovies.find((m) => m.id === movieId);

  if (!movie) return null;

  const year = new Date(movie.releaseDate).getFullYear();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md w-full h-full"
    >
      <img
        src={movie.posterPath || "/placeholder.svg"}
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
