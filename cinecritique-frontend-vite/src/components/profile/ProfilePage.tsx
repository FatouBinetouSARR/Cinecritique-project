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

// ---------- UI helpers (moved out of component to preserve focus) ----------
const Card: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, right, className = "", children }) => (
  <section
    className={`bg-neutral-900/60 border border-neutral-800 rounded-2xl shadow-sm ${className}`}
  >
    {(title || subtitle || right) && (
      <header className="px-5 sm:px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-neutral-100">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
        </div>
        {right}
      </header>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className = "", ...props }) => (
  <button
    {...props}
    className={[
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
      "bg-secondary text-neutral-900 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary/40",
      "disabled:opacity-60 disabled:cursor-not-allowed",
      className,
    ].join(" ")}
  />
);

const MutedButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className = "", ...props }) => (
  <button
    {...props}
    className={[
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
      "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-700/50",
      className,
    ].join(" ")}
  />
);

const LinkButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className = "", ...props }) => (
  <button
    {...props}
    className={[
      "text-sm text-neutral-400 hover:text-neutral-200 underline-offset-4 hover:underline",
      className,
    ].join(" ")}
  />
);

export default function ProfilePage() {
  const { accessToken, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);

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

  // Fallback image (1x1 transparent GIF) to avoid 404s when no avatar
  const PLACEHOLDER =
    "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
  const resolveAvatarSrc = (u?: string | null) =>
    u ? `${API_URL}${u}` : PLACEHOLDER;

  // Charger profil
  useEffect(() => {
    const fetchProfile = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await apiFetch("/api/profile", {
          method: "GET",
          headers: authHeader,
        });

        if (!res.ok) {
          if (res.status === 401) {
            await logout();
            return;
          }

          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Erreur lors du chargement du profil"
          );
        }

        const data: ProfileData = await res.json();
        setProfile(data);
        setFormUsername(data.username || "");
        setFormBio(data.bio || "");
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erreur de connexion au serveur"
        );
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
        if (!uploadRes.ok)
          throw new Error("Échec de l'upload de la photo de profil");
      }

      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { ...(authHeader || {}), "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formUsername || undefined,
          bio: formBio || undefined,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          await logout();
          return;
        }
        throw new Error("Échec de la mise à jour du profil");
      }

      const refreshed = await apiFetch("/api/profile", {
        method: "GET",
        headers: authHeader,
      });
      const refreshedData: ProfileData = await refreshed.json();
      setProfile(refreshedData);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès.");
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Une erreur est survenue.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 bg-neutral-800 rounded"></div>
            <div className="h-32 bg-neutral-900 rounded-2xl border border-neutral-800"></div>
            <div className="h-64 bg-neutral-900 rounded-2xl border border-neutral-800"></div>
          </div>
          <p className="mt-6 text-center text-neutral-400">
            Chargement du profil…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-4">
          <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-4">
            <p className="text-red-300">{error}</p>
          </div>
          <MutedButton onClick={() => window.location.reload()}>
            Réessayer
          </MutedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Contenu */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
        {/* Profil */}
        <Card
          title="Profil utilisateur"
          subtitle="Informations personnelles et avatar"
          
        >

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Résumé */}
            <aside className="lg:col-span-1">
              <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-neutral-800 bg-neutral-900">
                <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-secondary ring-offset-2 ring-offset-neutral-900 mb-3">
                  <img
                    src={avatarPreview || resolveAvatarSrc(profile?.avatarUrl)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold">
                  {profile?.username || "Utilisateur"}
                </h4>
                <p className="text-sm text-neutral-400 mt-1">
                  {profile?.bio || "Aucune bio"}
                </p>

              </div>
            </aside>

            {/* Détails + formulaire */}
            <section className="lg:col-span-2 space-y-6">

              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-neutral-300 mb-2">
                        Photo de profil
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                          <img
                            src={avatarPreview || resolveAvatarSrc(profile?.avatarUrl)}
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
                          <PrimaryButton
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Choisir une image
                          </PrimaryButton>
                          {avatarPreview && (
                            <LinkButton
                              type="button"
                              onClick={() => {
                                if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                                setAvatarPreview(null);
                                setAvatarFile(null);
                              }}
                            >
                              Retirer
                            </LinkButton>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1 ">
                        Pseudo
                      </label>
                      <input
                        type="text"
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 placeholder:text-neutral-500"
                        placeholder="Votre pseudo"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-neutral-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 placeholder:text-neutral-500"
                        placeholder="Parlez de vous…"
                      />
                    </div>
                    
                  </div>
                  

                  <div className="flex flex-wrap items-center gap-3">
                    <PrimaryButton onClick={handleSave} disabled={saving}>
                      {saving ? "Sauvegarde…" : "Sauvegarder"}
                    </PrimaryButton>
                    <LinkButton type="button" onClick={() => setIsEditing(false)}>
                      Annuler
                    </LinkButton>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-3 text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Pseudo
                    </p>
                    <p className="mt-1 font-medium">
                      {profile?.username || "—"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Email
                    </p>
                    <p className="mt-1 font-medium">{profile?.email}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Bio
                    </p>
                    <p className="mt-1 text-neutral-200 whitespace-pre-line">
                      {profile?.bio || "—"}
                    </p>
                  </div>
                </div>
              )}
               {
            !isEditing && (
              <PrimaryButton
                onClick={() => {
                  setIsEditing(true);
                  setSuccess(null);
                  setError(null);
                }}
              >
                Modifier le profil
              </PrimaryButton>
            )
          }
            </section>
          </div>
        </Card>

        {/* Mes critiques */}
        <Card
          title="Mes critiques"
          subtitle="Historique de vos avis et notations"
          right={<span className="text-secondary" aria-hidden>★</span>}
        >
          <ReviewsPage mode="mine" />
        </Card>
      </main>
    </div>
  );
}
