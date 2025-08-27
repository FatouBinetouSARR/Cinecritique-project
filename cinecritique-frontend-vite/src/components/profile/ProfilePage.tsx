// src/components/profile/ProfilePage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../lib/useAuth";
import { apiFetch, API_URL } from "../../lib/apiFetch";
import { ReviewsPage } from "../reviews/ReviewsPage";

interface ProfileData {
  id: number;
  email: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export default function Profile() {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formBio, setFormBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const authHeader = useMemo(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    [accessToken]
  );

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
          setFormUsername(data.username || "");
          setFormBio(data.bio || "");
        } else {
          setError("Impossible de charger le profil.");
        }
      } catch {
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authHeader]);

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
    setSaving(true);
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const uploadRes = await fetch(`${API_URL}/api/profile/avatar`, {
          method: "PUT",
          body: formData,
          credentials: "include",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!uploadRes.ok) throw new Error("Échec de l'upload de la photo de profil");
      }

      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { ...(authHeader || {}), "Content-Type": "application/json" },
        body: JSON.stringify({ username: formUsername || undefined, bio: formBio || undefined }),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour du profil");

      const refreshed = await apiFetch("/api/profile", { method: "GET", headers: authHeader });
      const refreshedData: ProfileData = await refreshed.json();
      setProfile(refreshedData);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès.");
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Une erreur est survenue.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const Card: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode }> = ({
    title,
    subtitle,
    children,
  }) => (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-lg p-6 space-y-4">
      {title && <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>}
      {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
      {children}
    </div>
  );

  const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", ...props }) => (
    <button
      {...props}
      className={`px-5 py-2 rounded-xl font-medium bg-yellow-500 text-neutral-900 hover:bg-yellow-400 transition ${className}`}
    />
  );

  const MutedButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", ...props }) => (
    <button
      {...props}
      className={`px-5 py-2 rounded-xl font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition ${className}`}
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
        <div className="space-y-4 w-full max-w-lg animate-pulse">
          <div className="h-6 w-40 bg-neutral-800 rounded"></div>
          <div className="h-32 bg-neutral-900 rounded-2xl border border-neutral-800"></div>
          <div className="h-64 bg-neutral-900 rounded-2xl border border-neutral-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-16 container mx-auto space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Mon compte ⭐</h1>
        <p className="text-neutral-400">Gérez votre profil et vos préférences.</p>
      </div>

      {/* Profil */}
      <Card title="Profil utilisateur" subtitle="Informations personnelles et avatar">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center lg:w-1/3 text-center space-y-3">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-yellow-500/60 mb-2 transition-transform hover:scale-105">
              <img
                src={avatarPreview || profile?.avatarUrl || "/avatar-placeholder.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xl font-semibold">{profile?.username || "Utilisateur"}</h4>
            <p className="text-neutral-400 text-sm">{profile?.bio || "Aucune bio"}</p>
            <p className="text-neutral-300 text-sm mt-2 break-words">{profile?.email}</p>
          </div>

          {/* Formulaire */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Pseudo</label>
                  <input
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 outline-none"
                    placeholder="Votre pseudo"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Bio</label>
                  <textarea
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 outline-none"
                    placeholder="Parlez de vous…"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                    <img
                      src={avatarPreview || profile?.avatarUrl || "/avatar-placeholder.png"}
                      alt="Aperçu avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectAvatar} />
                    <PrimaryButton onClick={() => fileInputRef.current?.click()}>Choisir une image</PrimaryButton>
                    {avatarPreview && (
                      <MutedButton onClick={() => { if (avatarPreview) URL.revokeObjectURL(avatarPreview); setAvatarPreview(null); setAvatarFile(null); }}>
                        Retirer
                      </MutedButton>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? "Sauvegarde…" : "Sauvegarder"}</PrimaryButton>
                  <MutedButton onClick={resetForm}>Réinitialiser</MutedButton>
                  <MutedButton onClick={() => setIsEditing(false)}>Annuler</MutedButton>
                </div>

                {error && <p className="text-red-400 mt-2">{error}</p>}
                {success && <p className="text-green-400 mt-2">{success}</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-xs text-neutral-500">Pseudo</p>
                  <p className="font-medium mt-1">{profile?.username || "—"}</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="font-medium mt-1">{profile?.email}</p>
                </div>
                <div className="sm:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-xs text-neutral-500">Bio</p>
                  <p className="text-neutral-200 mt-1 whitespace-pre-line">{profile?.bio || "—"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Mes critiques */}
      <Card title="Mes critiques" subtitle="Historique de vos avis et notations">
        <ReviewsPage mode="mine" />
      </Card>
    </div>
  );
}
