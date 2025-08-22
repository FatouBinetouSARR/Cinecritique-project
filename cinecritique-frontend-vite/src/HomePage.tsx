import React from "react";
import { MovieCard } from "./components/movies/MovieCard";
import { Button } from "./components/ui/Button";
import { TrendingUp, Star, Users } from "lucide-react";

const popularMovies = [
  {
    id: 1,
    title: "Oppenheimer",
    posterPath: "/oppenheimer-inspired-poster.png",
    releaseDate: "2023-07-21",
    runtime: 180,
    genres: ["Drama", "History", "Biography"],
    rating: 4.5,
    reviewCount: 1247,
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
  },
  {
    id: 2,
    title: "Barbie",
    posterPath: "/barbie-inspired-poster.png",
    releaseDate: "2023-07-21",
    runtime: 114,
    genres: ["Comedy", "Fantasy", "Adventure"],
    rating: 4.2,
    reviewCount: 2156,
    overview:
      "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.",
  },
  {
    id: 3,
    title: "Dune: Part Two",
    posterPath: "/dune-part-two-inspired-desert.png",
    releaseDate: "2024-03-01",
    runtime: 166,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 4.7,
    reviewCount: 892,
    overview:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
  {
    id: 4,
    title: "Spider-Man: Across the Spider-Verse",
    posterPath: "/placeholder-74yfu.png",
    releaseDate: "2023-06-02",
    runtime: 140,
    genres: ["Animation", "Action", "Adventure"],
    rating: 4.6,
    reviewCount: 1834,
    overview:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
  },
  {
    id: 5,
    title: "The Batman",
    posterPath: "/dark-knight-poster.png",
    releaseDate: "2022-03-04",
    runtime: 176,
    genres: ["Action", "Crime", "Drama"],
    rating: 4.3,
    reviewCount: 2847,
    overview:
      "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
  },
  {
    id: 6,
    title: "Top Gun: Maverick",
    posterPath: "/placeholder-dhgq8.png",
    releaseDate: "2022-05-27",
    runtime: 131,
    genres: ["Action", "Drama"],
    rating: 4.4,
    reviewCount: 3156,
    overview:
      "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.",
  },
]

const featuredStats = [
  {
    icon: Star,
    label: "Movies Reviewed",
    value: "12,847",
    description: "Community reviews",
  },
  {
    icon: Users,
    label: "Active Critics",
    value: "3,429",
    description: "Film enthusiasts",
  },
  {
    icon: TrendingUp,
    label: "This Month",
    value: "1,247",
    description: "New reviews",
  },
]

export const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-card to-background py-16 md:py-24 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground font-space-grotesk">
          Discover Your Next <span className="text-primary block">Favorite Film</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join thousands of film enthusiasts sharing reviews, discovering hidden gems, and rating the movies that matter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Reviewing
          </Button>
          <Button size="lg" variant="ghost" className="border-border text-foreground hover:bg-muted bg-transparent">
            Browse Movies
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {featuredStats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center">
                <stat.icon className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground font-space-grotesk">{stat.value}</p>
              <p className="text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="py-16 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground font-space-grotesk">Popular Movies</h2>
            <p className="text-muted-foreground">Trending films loved by our community</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground font-space-grotesk">Ready to Share Your Opinion?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join our community of passionate film critics. Rate movies, write reviews, and discover your next
                favorite film through the eyes of fellow cinephiles.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join CineCritique
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
    </>
  );
};
