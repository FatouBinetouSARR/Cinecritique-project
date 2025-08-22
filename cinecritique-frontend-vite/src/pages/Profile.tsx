import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type ProfileData = { id: number; email: string } | null;

export default function Profile() {
  const { fetchWithAuth, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth("/api/profile");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError("Impossible de charger le profil");
      }
    })();
  }, [fetchWithAuth]);

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      {profile ? (
        <div className="space-y-2">
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={logout}>Se déconnecter</button>
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}


