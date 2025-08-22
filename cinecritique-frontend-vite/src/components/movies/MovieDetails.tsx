import { Calendar, Clock, DollarSign, Globe, Building } from "lucide-react"
import { Card, CardContent } from "../../ui/card" // adapter selon ton dossier
import { Badge } from "../../ui/badge"
import { StarRating } from "../../ui/StarRating"

interface Cast {
  name: string
  character: string
}

interface MovieDetailsProps {
  movie: {
    id: number
    title: string
    posterPath: string
    backdropPath: string
    releaseDate: string
    runtime: number
    genres: string[]
    rating: number
    reviewCount: number
    overview: string
    director: string
    cast: Cast[]
    budget: number
    revenue: number
    tagline: string
    originalLanguage: string
    productionCompanies: string[]
  }
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const year = new Date(movie.releaseDate).getFullYear()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={movie.backdropPath || "/placeholder.svg"}
          alt={`${movie.title} backdrop`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border overflow-hidden">
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.posterPath || "/placeholder.svg"}
                  alt={`${movie.title} poster`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-space-grotesk mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && <p className="text-lg text-muted-foreground italic">"{movie.tagline}"</p>}
              </div>

              {/* Rating and Basic Info */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <StarRating rating={movie.rating} size="lg" />
                  <span className="text-xl font-bold text-foreground">{movie.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({movie.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre} className="bg-muted text-muted-foreground">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Movie Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{year}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.runtime}min</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{movie.originalLanguage}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{movie.productionCompanies[0]}</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground font-space-grotesk">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {/* Director */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground font-space-grotesk">Director</h3>
              <p className="text-foreground">{movie.director}</p>
            </div>

            {/* Box Office */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Budget</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(movie.budget)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Revenue</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(movie.revenue)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Cast */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-foreground font-space-grotesk">Cast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movie.cast.map((actor, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{actor.name}</p>
                    <p className="text-sm text-muted-foreground">{actor.character}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
