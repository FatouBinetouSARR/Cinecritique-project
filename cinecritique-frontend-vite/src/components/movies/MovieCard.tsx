import { useNavigate } from "react-router-dom";

export const MovieCard: React.FC<MovieCardProps> = ({ id, title, posterPath, releaseDate }) => {
  const navigate = useNavigate();
  const year = new Date(releaseDate).getFullYear();

  return (
    <div
      onClick={() => navigate(`/movie/${id}`)} // 👈 redirection dynamique
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md w-full h-full"
    >
      <img
        src={posterPath || "/placeholder.svg"}
        alt={`${title} poster`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {title} ({year})
        </h3>
      </div>
    </div>
  );
};
