// src/data/dataMyReviews.ts
export interface MyReview {
  id: number;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export const dataMyReviews: MyReview[] = [
  {
    id: 1,
    movieId: 1,
    movieTitle: "Oppenheimer",
    moviePoster: "/oppenheimer-inspired-poster.png",
    rating: 5,
    review:
      "Christopher Nolan's masterpiece about the father of the atomic bomb. The cinematography and sound design are absolutely phenomenal. Cillian Murphy delivers a career-defining performance.",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    movieId: 2,
    movieTitle: "Barbie",
    moviePoster: "/barbie-inspired-poster.png",
    rating: 4,
    review:
      "A surprisingly deep and thoughtful comedy that manages to be both hilarious and meaningful. Margot Robbie and Ryan Gosling have incredible chemistry.",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
  },
  {
    id: 3,
    movieId: 3,
    movieTitle: "Dune: Part Two",
    moviePoster: "/dune-part-two-inspired-desert.png",
    rating: 5,
    review:
      "Denis Villeneuve continues to prove he's one of the best sci-fi directors of our time. The visuals are breathtaking and the story is compelling.",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
];
