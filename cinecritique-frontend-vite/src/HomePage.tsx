import React from "react";
import { MovieCard } from "./components/movies/MovieCard";
import { Button } from "./components/ui/button";
import { TrendingUp, Star, Users } from "lucide-react";

const popularMovies = [
  {
    id: 1,
    title: "Oppenheimer",
    posterPath: "/oppenheimer-backdrop.jpg",
    releaseDate: "2023-07-21",
    runtime: 180,
    genres: ["Drame", "Histoire", "Biographie"],
    rating: 4.5,
    reviewCount: 1247,
    overview:
      "L’histoire de J. Robert Oppenheimer et de son rôle dans le développement de la bombe atomique pendant la Seconde Guerre mondiale.",
  },
  {
    id: 2,
    title: "Barbie",
    posterPath: "/multiverse-movie-poster.jpg",
    releaseDate: "2023-07-21",
    runtime: 114,
    genres: ["Comédie", "Fantaisie", "Aventure"],
    rating: 4.2,
    reviewCount: 2156,
    overview:
      "Barbie et Ken vivent la meilleure période de leur vie dans le monde coloré et parfait de Barbie Land.",
  },
  {
    id: 3,
    title: "Dune: Deuxième Partie",
    posterPath: "/dune-part-two-inspired-desert.jpg",
    releaseDate: "2024-03-01",
    runtime: 166,
    genres: ["Science-fiction", "Aventure", "Drame"],
    rating: 4.7,
    reviewCount: 892,
    overview:
      "Paul Atreides s’unit à Chani et aux Fremen tout en cherchant à se venger des conspirateurs qui ont détruit sa famille.",
  },
  {
    id: 4,
    title: "Spider-Man: Across the Spider-Verse",
    posterPath: "/Spider-Man Across the Spider-Verse.jpg",
    releaseDate: "2023-06-02",
    runtime: 140,
    genres: ["Animation", "Action", "Aventure"],
    rating: 4.6,
    reviewCount: 1834,
    overview:
      "Miles Morales traverse le Multivers et rencontre une équipe de Spider-Personnes chargées de protéger son existence même.",
  },
  {
    id: 5,
    title: "The Batman",
    posterPath: "/The Batman.jpg",
    releaseDate: "2022-03-04",
    runtime: 176,
    genres: ["Action", "Crime", "Drame"],
    rating: 4.3,
    reviewCount: 2847,
    overview:
      "Lorsqu’un tueur en série sadique commence à assassiner des personnalités politiques de Gotham, Batman est contraint d’enquêter sur la corruption cachée de la ville.",
  },
  {
    id: 6,
    title: "Top Gun: Maverick",
    posterPath: "/Top Gun Maverick.jpg",
    releaseDate: "2022-05-27",
    runtime: 131,
    genres: ["Action", "Drame"],
    rating: 4.4,
    reviewCount: 3156,
    overview:
      "Après trente ans, Maverick continue de repousser ses limites comme pilote d’élite, mais il doit affronter les fantômes de son passé.",
  },
  {
    id: 7,
    title: "Avatar : La Voie de l’Eau",
    posterPath: "/Avatar The Way of Water.jpg",
    releaseDate: "2022-12-16",
    runtime: 192,
    genres: ["Action", "Aventure", "Fantaisie"],
    rating: 4.5,
    reviewCount: 2100,
    overview:
      "Jake Sully et Neytiri luttent pour protéger leur famille et la planète Pandora face à une nouvelle menace.",
  },
  {
    id: 8,
    title: "Les Gardiens de la Galaxie Vol. 3",
    posterPath: "/Guardians of the Galaxy Vol. 3.jpg",
    releaseDate: "2023-05-05",
    runtime: 150,
    genres: ["Action", "Comédie", "Science-fiction"],
    rating: 4.6,
    reviewCount: 1870,
    overview:
      "Les Gardiens font face à de nouveaux défis en explorant le passé de Peter Quill et en affrontant des menaces cosmiques.",
  },
  {
    id: 9,
    title: "Mission : Impossible – Dead Reckoning Partie 1",
    posterPath: "/Mission Impossible – Dead Reckoning Part One.jpg",
    releaseDate: "2023-07-12",
    runtime: 163,
    genres: ["Action", "Aventure", "Thriller"],
    rating: 4.4,
    reviewCount: 1400,
    overview:
      "Ethan Hunt et son équipe affrontent leur mission la plus dangereuse pour empêcher une catastrophe mondiale.",
  },
  {
    id: 10,
    title: "Black Panther : Wakanda Forever",
    posterPath: "/Black Panther Wakanda Forever.jpg",
    releaseDate: "2022-11-11",
    runtime: 161,
    genres: ["Action", "Aventure", "Drame"],
    rating: 4.3,
    reviewCount: 2250,
    overview:
      "Les dirigeants du Wakanda luttent pour protéger leur nation après la mort du roi T’Challa.",
  },
  {
    id: 11,
    title: "The Flash",
    posterPath: "The Flash.jpg",
    releaseDate: "2023-06-16",
    runtime: 144,
    genres: ["Action", "Aventure", "Science-fiction"],
    rating: 4.1,
    reviewCount: 900,
    overview:
      "Barry Allen utilise sa super-vitesse pour changer le passé, mais ses actions entraînent des conséquences imprévues dans le multivers.",
  },
  {
    id: 12,
    title: "Indiana Jones et le Cadran de la Destinée",
    posterPath: "/Indiana Jones and the Dial of Destiny.jpg",
    releaseDate: "2023-06-30",
    runtime: 154,
    genres: ["Action", "Aventure"],
    rating: 4.2,
    reviewCount: 1100,
    overview:
      "Indiana Jones se lance dans une course contre la montre pour empêcher qu’un puissant artefact antique ne tombe entre de mauvaises mains.",
  },
];

const featuredStats = [
  {
    icon: Star,
    label: "Films critiqués",
    value: "12 847",
    description: "Avis de la communauté",
  },
  {
    icon: Users,
    label: "Critiques actifs",
    value: "3 429",
    description: "Passionnés de cinéma",
  },
  {
    icon: TrendingUp,
    label: "Ce mois-ci",
    value: "1 247",
    description: "Nouvelles critiques",
  },
];

export const HomePage: React.FC = () => {
  return (
    <>
      {/* Section Héros */}
      <section className="relative bg-gradient-to-b from-card to-background py-16 md:py-24 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground font-space-grotesk">
          Découvrez votre prochain <span className="text-primary block">film préféré</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Rejoignez des milliers de passionnés de cinéma partageant leurs avis, découvrant des perles rares et notant les films qui comptent.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Commencer à critiquer
          </Button>
          <Button size="lg" variant="ghost" className="border-border text-foreground hover:bg-muted bg-transparent">
            Parcourir les films
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

      {/* Films Populaires */}
      <section className="py-16 bg-background">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground font-space-grotesk">Films populaires</h2>
            <p className="text-muted-foreground">Les films tendance appréciés par notre communauté</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      {/* Appel à l’action */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground font-space-grotesk">Prêt à partager votre avis ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Rejoignez notre communauté de passionnés du cinéma. Notez des films, écrivez des critiques et découvrez votre prochain film préféré à travers les yeux d’autres cinéphiles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Rejoindre CineCritique
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
