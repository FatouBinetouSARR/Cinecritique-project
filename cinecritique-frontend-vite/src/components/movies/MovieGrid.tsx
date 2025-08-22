import { MovieCard } from "./MovieCard"

interface Movie {
  id: number
  title: string
  posterPath: string
  releaseDate: string
  runtime?: number
  genres: string[]
  rating: number
  reviewCount: number
  overview: string
}

interface MovieGridProps {
  movies: Movie[]
  className?: string
}

export function MovieGrid({ movies, className = "" }: MovieGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  )
}
