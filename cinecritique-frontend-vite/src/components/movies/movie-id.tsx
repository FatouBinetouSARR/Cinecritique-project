// src/pages/MoviePage.tsx
import React from "react";
import { useParams, Navigate } from "react-router-dom";
// import { MovieDetails } from "../movies/MovieDetails";
// import { MovieReviews } from "../movies/MovieReviews";

// --- Mock movie data ---
const mockMovieDetails = {
  1: {
    id: 1,
    title: "Oppenheimer",
    posterPath: "/oppenheimer-inspired-poster.png",
    backdropPath: "/oppenheimer-backdrop.png",
    releaseDate: "2023-07-21",
    runtime: 180,
    genres: ["Drama", "History", "Biography"],
    rating: 4.5,
    reviewCount: 1247,
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II...",
    director: "Christopher Nolan",
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer" },
      { name: "Emily Blunt", character: "Katherine Oppenheimer" },
      { name: "Matt Damon", character: "Leslie Groves" },
      { name: "Robert Downey Jr.", character: "Lewis Strauss" },
      { name: "Florence Pugh", character: "Jean Tatlock" },
    ],
    budget: 100000000,
    revenue: 952000000,
    tagline: "The world forever changes.",
    originalLanguage: "English",
    productionCompanies: ["Universal Pictures", "Syncopy"],
  },
  2: {
    id: 2,
    title: "Barbie",
    posterPath: "/barbie-inspired-poster.png",
    backdropPath: "/barbie-backdrop.png",
    releaseDate: "2023-07-21",
    runtime: 114,
    genres: ["Comedy", "Fantasy", "Adventure"],
    rating: 4.2,
    reviewCount: 2156,
    overview:
      "Barbie and Ken are having the time of their lives in Barbie Land...",
    director: "Greta Gerwig",
    cast: [
      { name: "Margot Robbie", character: "Barbie" },
      { name: "Ryan Gosling", character: "Ken" },
      { name: "America Ferrera", character: "Gloria" },
      { name: "Kate McKinnon", character: "Weird Barbie" },
      { name: "Issa Rae", character: "President Barbie" },
    ],
    budget: 145000000,
    revenue: 1446000000,
    tagline: "She's everything. He's just Ken.",
    originalLanguage: "English",
    productionCompanies: ["Warner Bros. Pictures", "Mattel Films"],
  },
};

// --- Mock reviews data ---
// const mockReviews = {
//   1: [
//     {
//       id: 1,
//       userId: "user1",
//       username: "CinemaLover92",
//       rating: 5,
//       title: "A Masterpiece of Cinema",
//       content:
//         "Christopher Nolan has outdone himself with this biographical thriller...",
//       createdAt: "2023-08-15T10:30:00Z",
//       helpful: 45,
//     },
//     {
//       id: 2,
//       userId: "user2",
//       username: "HistoryBuff",
//       rating: 4,
//       title: "Historically Fascinating",
//       content: "As someone deeply interested in WWII history...",
//       createdAt: "2023-08-10T14:22:00Z",
//       helpful: 32,
//     },
//   ],
//   2: [
//     {
//       id: 4,
//       userId: "user4",
//       username: "PinkFan",
//       rating: 5,
//       title: "Pure Joy and Fun!",
//       content: "This movie exceeded all my expectations! Margot Robbie...",
//       createdAt: "2023-08-12T16:45:00Z",
//       helpful: 67,
//     },
//   ],
// };

export const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const movie = mockMovieDetails[movieId as keyof typeof mockMovieDetails];
  // const reviews = mockReviews[movieId as keyof typeof mockReviews] || [];

  // équivalent de next/navigation -> notFound()
  if (!movie) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* <MovieDetails movie={movie} />
        <MovieReviews movieId={movieId} reviews={reviews} /> */}
      </main>
    </div>
  );
};
