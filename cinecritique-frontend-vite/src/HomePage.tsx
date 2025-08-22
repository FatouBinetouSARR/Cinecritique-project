import React from "react";
import { MovieCard } from "./components/movies/MovieCard";
import { Button } from "./components/ui/Button";
import { TrendingUp, Star, Users } from "lucide-react";

const popularMovies = [
  {
    id: 1,
    title: "Oppenheimer",
    posterPath: "/oppenheimer-backdrop.jpg",
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
    posterPath: "/multiverse-movie-poster.jpg",
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
    posterPath: "/dune-part-two-inspired-desert.jpg",
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
    posterPath: "/Spider-Man Across the Spider-Verse.jpg",
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
    posterPath: "/The Batman.jpg",
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
    posterPath: "/Top Gun Maverick.jpg",
    releaseDate: "2022-05-27",
    runtime: 131,
    genres: ["Action", "Drama"],
    rating: 4.4,
    reviewCount: 3156,
    overview:
      "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.",
  },
   {
    id: 7,
    title: "Avatar: The Way of Water",
    posterPath: "/Avatar The Way of Water.jpg",
    releaseDate: "2022-12-16",
    runtime: 192,
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 4.5,
    reviewCount: 2100,
    overview:
      "Jake Sully and Neytiri work to protect their family and the planet of Pandora from a new threat.",
  },
  {
    id: 8,
    title: "Guardians of the Galaxy Vol. 3",
    posterPath: "/Guardians of the Galaxy Vol. 3.jpg",
    releaseDate: "2023-05-05",
    runtime: 150,
    genres: ["Action", "Comedy", "Sci-Fi"],
    rating: 4.6,
    reviewCount: 1870,
    overview:
      "The Guardians face new challenges as they unravel mysteries of Peter Quill’s past and battle cosmic threats.",
  },
  {
    id: 9,
    title: "Mission: Impossible – Dead Reckoning Part One",
    posterPath: "/Mission Impossible – Dead Reckoning Part One.jpg",
    releaseDate: "2023-07-12",
    runtime: 163,
    genres: ["Action", "Adventure", "Thriller"],
    rating: 4.4,
    reviewCount: 1400,
    overview:
      "Ethan Hunt and his team face the deadliest mission yet as they attempt to stop a global catastrophe.",
  },
  {
    id: 10,
    title: "Black Panther: Wakanda Forever",
    posterPath: "/Black Panther Wakanda Forever.jpg",
    releaseDate: "2022-11-11",
    runtime: 161,
    genres: ["Action", "Adventure", "Drama"],
    rating: 4.3,
    reviewCount: 2250,
    overview:
      "The leaders of Wakanda fight to protect their nation following the death of King T’Challa.",
  },
  {
    id: 11,
    title: "The Flash",
    posterPath: "The Flash.jpg",
    releaseDate: "2023-06-16",
    runtime: 144,
    genres: ["Action", "Adventure", "Sci-Fi"],
    rating: 4.1,
    reviewCount: 900,
    overview:
      "Barry Allen uses his super speed to change the past, but his actions have unintended consequences on the multiverse.",
  },
  {
    id: 12,
    title: "Indiana Jones and the Dial of Destiny",
    posterPath: "/Indiana Jones and the Dial of Destiny.jpg",
    releaseDate: "2023-06-30",
    runtime: 154,
    genres: ["Action", "Adventure"],
    rating: 4.2,
    reviewCount: 1100,
    overview:
      "Indiana Jones races against time and enemies to secure a powerful ancient artifact before it falls into the wrong hands.",
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
