import React, { useState } from "react";

const popularReviews = [
{
  movie: "Dune: Part Two",
  poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  user: "Alice",
  rating: 5,
  comment:
    "Un space opera monumental : visuellement grandiose, rythmé par une mise en scène immersive et une tension constante. Villeneuve signe une fresque à couper le souffle.",
},

  {
    movie: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
    user: "Bob",
    rating: 5,
    comment:
      "La performance de Heath Ledger est incroyable, un chef-d'œuvre du genre.",
  },
  {
    movie: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    user: "Charlie",
    rating: 4,
    comment:
      "Émotionnel et visuellement époustouflant, un voyage dans l’espace captivant.",
  },
];

const popularCritics = [
  {
    user: "Kendra",
    avatar: "https://i.pravatar.cc/100?img=1",
    followers: "12k abonnés",
    bio: "Passionnée de SF et d’horreur psychologique.",
  },
  {
    user: "Red Room Ryan",
    avatar: "https://i.pravatar.cc/100?img=2",
    followers: "8k abonnés",
    bio: "Toujours à l’affût des thrillers les plus sombres.",
  },
  {
    user: "Gabi",
    avatar: "https://i.pravatar.cc/100?img=3",
    followers: "15k abonnés",
    bio: "Spécialiste des drames et critiques très suivie.",
  },
];

export const ReviewsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "critics">("reviews");

  return (
    <section className="py-12 px-4 md:px-8">
      {/* Onglets */}
      <div className="flex gap-6 border-b border-white/20 mb-8">
        <button
          className={`pb-2 font-semibold transition-colors ${
            activeTab === "reviews"
              ? "text-white border-b-2 border-yellow-400"
              : "text-white/60 hover:text-white"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Avis populaires
        </button>
        <button
          className={`pb-2 font-semibold transition-colors ${
            activeTab === "critics"
              ? "text-white border-b-2 border-yellow-400"
              : "text-white/60 hover:text-white"
          }`}
          onClick={() => setActiveTab("critics")}
        >
          Critiques populaires
        </button>
      </div>

      {/* Contenu */}
      <div className="transition-opacity duration-500">
        {activeTab === "reviews" ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Avis populaires cette semaine
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularReviews.map((review, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={review.poster}
                    alt={review.movie}
                    className="w-full h-64 object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{review.movie}</h3>
                    <p className="text-sm text-yellow-400 font-semibold">
                      {review.rating} ★ par {review.user}
                    </p>
                    <p className="text-sm mt-1 line-clamp-3">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Critiques populaires
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularCritics.map((critic, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <img
                    src={critic.avatar}
                    alt={critic.user}
                    className="w-20 h-20 rounded-full border-2 border-yellow-400 mb-4"
                  />
                  <h3 className="text-lg font-bold text-white">
                    {critic.user}
                  </h3>
                  <p className="text-xs text-yellow-400 mb-2">
                    {critic.followers}
                  </p>
                  <p className="text-sm text-white/80">{critic.bio}</p>
                  <button className="mt-4 px-4 py-1 text-sm font-semibold bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition">
                    Suivre
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
