export type User = {
  id: number;
  name: string;
  avatar: string;
  followers: string; // ex: "3.2k abonnés"
  bio: string;
  reviews: number;
  moviesWatched: number;
  lists: number;
  likes: number;
  reviewsList?: { movie: string; comment: string }[]; // optionnel pour ProfilePage
};

export const dataUsers: User[] = [
  {
    id: 1,
    name: "Fatou Ndiaye",
    avatar: "https://i.pravatar.cc/100?img=21",
    followers: "3.2k abonnés",
    bio: "Passionnée par le cinéma africain et les histoires de femmes.",
    reviews: 312,
    moviesWatched: 1250,
    lists: 18,
    likes: 8420,
  },
  {
    id: 2,
    name: "Moussa Diop",
    avatar: "https://i.pravatar.cc/100?img=22",
    followers: "2.7k abonnés",
    bio: "Cinéphile sénégalais, amateur de documentaires et de drames sociaux.",
    reviews: 450,
    moviesWatched: 1395,
    lists: 22,
    likes: 10500,
  },
  {
    id: 3,
    name: "Awa Sarr",
    avatar: "https://i.pravatar.cc/100?img=23",
    followers: "4.1k abonnés",
    bio: "Fan de comédies et de cinéma sénégalais contemporain.",
    reviews: 389,
    moviesWatched: 980,
    lists: 15,
    likes: 9300,
  },
  {
    id: 4,
    name: "Cheikh Ba",
    avatar: "https://i.pravatar.cc/100?img=24",
    followers: "1.9k abonnés",
    bio: "Grand amateur de films historiques et de classiques africains.",
    reviews: 278,
    moviesWatched: 1520,
    lists: 12,
    likes: 7200,
  },
  {
    id: 5,
    name: "Sokhna Fall",
    avatar: "https://i.pravatar.cc/100?img=25",
    followers: "3.5k abonnés",
    bio: "Adepte de thrillers et de récits immersifs.",
    reviews: 401,
    moviesWatched: 1115,
    lists: 19,
    likes: 8900,
  },
  {
    id: 6,
    name: "Idrissa Kane",
    avatar: "https://i.pravatar.cc/100?img=26",
    followers: "1.1k abonnés",
    bio: "Cinéphile de Dakar, amateur de cinéma indépendant.",
    reviews: 210,
    moviesWatched: 845,
    lists: 10,
    likes: 4500,
  },
  {
    id: 7,
    name: "Mariama Sow",
    avatar: "https://i.pravatar.cc/100?img=27",
    followers: "2.9k abonnés",
    bio: "Fan de films d’animation et de fictions poétiques.",
    reviews: 355,
    moviesWatched: 1270,
    lists: 20,
    likes: 9700,
  },
  {
    id: 8,
    name: "Amadou Gueye",
    avatar: "https://i.pravatar.cc/100?img=28",
    followers: "2.2k abonnés",
    bio: "Adore les films d’action et les épopées spectaculaires.",
    reviews: 500,
    moviesWatched: 1620,
    lists: 25,
    likes: 11200,
  },
  {
    id: 9,
    name: "Ndeye Faye",
    avatar: "https://i.pravatar.cc/100?img=29",
    followers: "3.8k abonnés",
    bio: "Critique spécialisée dans les drames psychologiques.",
    reviews: 420,
    moviesWatched: 1345,
    lists: 17,
    likes: 9900,
  },
  {
    id: 10,
    name: "Ousmane Diallo",
    avatar: "https://i.pravatar.cc/100?img=30",
    followers: "1.6k abonnés",
    bio: "Explorateur de cinéma expérimental et d’avant-garde.",
    reviews: 185,
    moviesWatched: 765,
    lists: 8,
    likes: 3800,
  },
];
