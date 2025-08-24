// src/components/critiques/CriticsPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { dataUsers } from "../../data/dataUser";

export const CriticsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"followers" | "likes">("followers");

  const parseFollowers = (followers: string) =>
    followers.includes("k") ? parseFloat(followers) * 1000 : parseInt(followers.replace(/\D/g, ""), 10);

  const sortedUsers = [...dataUsers]
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "followers" ? parseFollowers(b.followers) - parseFollowers(a.followers) : b.likes - a.likes
    );

  const popularMembers = sortedUsers.slice(0, 5);

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* --- Critiques populaires --- */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
            <h2 className="text-2xl font-bold">Critiques populaires</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Recherche par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "followers" | "likes")}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
              >
                <option value="followers">Popularité</option>
                <option value="likes">Likes</option>
              </select>
            </div>
          </div>

          {/* Table-like header */}
          <div className="grid grid-cols-5 px-4 py-2 bg-gray-800 text-gray-400 text-sm font-semibold rounded-t">
            <span>Nom</span>
            <span className="text-center">Regardé</span>
            <span className="text-center">Listes</span>
            <span className="text-center">Goûts</span>
            <span className="text-right">Avis</span>
          </div>

          {/* Users list */}
          <div className="divide-y divide-gray-800 border border-gray-800 rounded-b">
            {sortedUsers.map((user, index) => (
              <div
                key={user.id}
                className="grid grid-cols-5 items-center px-4 py-3 hover:bg-gray-800 transition-colors"
              >
                {/* Nom + avatar */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-6">{index + 1}</span>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <Link to={`/profile/${user.id}`} className="font-medium hover:underline">
                      {user.name}
                    </Link>
                  </div>
                </div>

                {/* Stats en colonnes */}
                <span className="text-center text-gray-300">
                  👀 {user.moviesWatched.toLocaleString()}
                </span>
                <span className="text-center text-gray-300">
                  📋 {user.lists.toLocaleString()}
                </span>
                <span className="text-center text-gray-300">
                  ❤️ {user.likes.toLocaleString()}
                </span>
                <span className="text-right text-gray-400 text-sm">
                  {user.reviews.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Membres populaires --- */}
        <aside className="w-64 hidden lg:block">
          <h3 className="text-xl font-bold mb-4">Membres populaires</h3>
          <div className="flex flex-col divide-y divide-gray-800 border border-gray-800 rounded-md">
            {popularMembers.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">
                    {user.moviesWatched.toLocaleString()} films, {user.reviews.toLocaleString()} critiques
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};
