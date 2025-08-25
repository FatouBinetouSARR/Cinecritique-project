import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Person {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  combined_credits?: {
    cast: {
      id: number;
      title?: string;
      name?: string;
      poster_path: string | null;
      character?: string;
      media_type: string;
    }[];
  };
}

export const PersonPage: React.FC = () => {
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&append_to_response=combined_credits`
      );
      const data = await res.json();
      setPerson(data);
    };
    fetchPerson();
  }, [id]);

  if (!person) {
    return <div className="text-center text-gray-400 p-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <div className="bg-gray-800 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {person.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
            alt={person.name}
            className="w-48 h-64 object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-48 h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold">{person.name}</h1>
          <p className="text-gray-400 mt-1">
            {person.birthday || "Date de naissance inconnue"} •{" "}
            {person.place_of_birth || "Lieu de naissance inconnu"}
          </p>
          <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
            {person.biography || "Aucune biographie disponible."}
          </p>
        </div>
      </div>

      {/* Filmographie */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Filmographie</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {person.combined_credits?.cast
            .filter((m) => m.poster_path)
            .slice(0, 18)
            .map((m) => (
              <Link
                key={m.id}
                to={`/movies/${m.id}`}
                className="group hover:scale-105 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                  alt={m.title || m.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="mt-2 text-sm font-semibold truncate group-hover:text-yellow-400">
                  {m.title || m.name}
                </p>
                <p className="text-xs text-gray-400">
                  {m.character || "Rôle inconnu"}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {/* Retour */}
      <div className="text-center py-6">
        <Link
          to="/movies"
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
        >
          ⬅ Retour aux films
        </Link>
      </div>
    </div>
  );
};
