// src/pages/Account.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../lib/useAuth";
import { apiFetch } from "../../lib/apiFetch";
import { API_URL } from "../../lib/apiFetch";

interface ProfileData {
  id: number;
  email: string;
  username?: string;
  bio?: string;
  adresse?: string;
  age?: number;
  avatarUrl?: string;
}

export default function Profile() {
  const { accessToken, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formAdresse, setFormAdresse] = useState("");
  const [formAge, setFormAge] = useState<number | "">("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const authHeader = useMemo(() => (
    accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
  ), [accessToken]);

  useEffect(() => {
    const fetchProfile = async () => {
      setError(null);
      try {
        const res = await apiFetch("/api/profile", {
          method: "GET",
          headers: authHeader,
        });
        if (res.ok) {
          const data: ProfileData = await res.json();
          setProfile(data);
          // Pré-remplir le formulaire
          setFormUsername(data.username || "");
          setFormBio(data.bio || "");
          setFormAdresse(data.adresse || "");
          setFormAge(typeof data.age === "number" ? data.age : "");
        } else if (res.status === 401) {
          await logout();
        } else {
          setError("Impossible de charger le profil");
        }
      } catch {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authHeader, logout]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    if (!profile) return;
    setFormUsername(profile.username || "");
    setFormBio(profile.bio || "");
    setFormAdresse(profile.adresse || "");
    setFormAge(typeof profile.age === "number" ? profile.age : "");
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      // 1) Uploader l'avatar si sélectionné
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const uploadRes = await fetch(`${API_URL}/api/profile/avatar`, {
          method: "PUT",
          body: formData,
          credentials: "include",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!uploadRes.ok) {
          throw new Error("Échec de l'upload de la photo de profil");
        }
      }

      // 2) Mettre à jour les infos du profil
      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { ...(authHeader || {}) },
        body: JSON.stringify({
          username: formUsername || undefined,
          bio: formBio || undefined,
          adresse: formAdresse || undefined,
          age: formAge === "" ? undefined : Number(formAge),
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          await logout();
          return;
        }
        throw new Error("Échec de la mise à jour du profil");
      }

      // 3) Rafraîchir les données
      const refreshed = await apiFetch("/api/profile", {
        method: "GET",
        headers: authHeader,
      });
      const refreshedData: ProfileData = await refreshed.json();
      setProfile(refreshedData);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès");
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-md bg-red-50 p-4 max-w-md">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profil utilisateur</h3>
              <p className="mt-1 text-sm text-gray-500">Gérez vos informations personnelles</p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => { setIsEditing(true); setSuccess(null); setError(null); }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Modifier le profil
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profil résumé */}
            <aside className="lg:col-span-1">
              <div className="flex flex-col items-center text-center p-4 border rounded-md">
                <div className="w-28 h-28 rounded-full overflow-hidden border mb-3">
                  <img
                    src={avatarPreview || profile?.avatarUrl || "/avatar-placeholder.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold">{profile?.username || "Utilisateur"}</h4>
                <p className="text-sm text-gray-600 mt-1">{profile?.bio || "Aucune bio"}</p>
                <div className="text-sm text-gray-700 mt-4 w-full text-left space-y-2">
                  <p><span className="font-medium">Email:</span> {profile?.email}</p>
                  {profile?.age !== undefined && (
                    <p><span className="font-medium">Âge:</span> {profile?.age}</p>
                  )}
                  {profile?.adresse && (
                    <p><span className="font-medium">Adresse:</span> {profile?.adresse}</p>
                  )}
                </div>
              </div>
            </aside>

            {/* Détails + formulaire */}
            <section className="lg:col-span-2">
              {success && (
                <div className="mb-4 rounded-md bg-green-50 p-3 text-green-800 text-sm">{success}</div>
              )}

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <p className="text-xs uppercase text-gray-500">Pseudo</p>
                      <p className="text-gray-900">{profile?.username || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <p className="text-xs uppercase text-gray-500">Email</p>
                      <p className="text-gray-900">{profile?.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded sm:col-span-2">
                      <p className="text-xs uppercase text-gray-500">Bio</p>
                      <p className="text-gray-900 whitespace-pre-line">{profile?.bio || "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <p className="text-xs uppercase text-gray-500">Âge</p>
                      <p className="text-gray-900">{profile?.age ?? "—"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <p className="text-xs uppercase text-gray-500">Adresse</p>
                      <p className="text-gray-900">{profile?.adresse || "—"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pseudo</label>
                      <input
                        type="text"
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Votre pseudo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Âge</label>
                      <input
                        type="number"
                        value={formAge}
                        onChange={(e) => setFormAge(e.target.value === "" ? "" : Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Votre âge"
                        min={0}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Parlez de vous..."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <input
                        type="text"
                        value={formAdresse}
                        onChange={(e) => setFormAdresse(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Votre adresse"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
                      <div className="mt-1 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border">
                          <img
                            src={avatarPreview || profile?.avatarUrl || "/avatar-placeholder.png"}
                            alt="Aperçu avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSelectAvatar}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200"
                          >
                            Choisir une image
                          </button>
                          {avatarPreview && (
                            <button
                              type="button"
                              onClick={() => { if (avatarPreview) URL.revokeObjectURL(avatarPreview); setAvatarPreview(null); setAvatarFile(null); }}
                              className="px-3 py-2 text-sm text-red-600 hover:underline"
                            >
                              Retirer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                    </button>
                    <button
                      onClick={resetForm}
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      type="button"
                      className="px-4 py-2 text-sm text-gray-600 hover:underline"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
