import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Afficher message de succès si redirigé depuis l'inscription
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        navigate("/profile");
      } else {
        const errorData = await response.json();
        setBackendError(errorData.message || "Identifiants invalides");
      }
    } catch {
      setBackendError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-4 p-2">
          <h1 className="text-3xl font-bold text-foreground p-2">CineCritique</h1>
          <p className="text-muted-foreground">Connectez-vous pour découvrir et critiquer des films</p>
        </div>

        {/* Carte */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {successMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-green-700 text-sm font-medium">
              ✅ {successMessage}
            </div>
          )}

          {backendError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm font-medium">
              ❌ {backendError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.email ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.password ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="Votre mot de passe"
                  required
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Se connecter"}
            </button>
          </form>

          {/* Lien inscription */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Créez un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
