import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Home, Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface RegisterFormData {
  email: string;
  prenom: string;
  nom: string;
  adresse: string;
  age: number;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  email?: string;
  prenom?: string;
  nom?: string;
  adresse?: string;
  age?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    prenom: "",
    nom: "",
    adresse: "",
    age: 0,
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    if (!formData.adresse.trim()) newErrors.adresse = "Adresse requise";
    if (!formData.age) newErrors.age = "Âge requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmation requise";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Format d'email invalide";

    if (formData.age <= 0) newErrors.age = "L'âge doit être supérieur à 0";

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          prenom: formData.prenom,
          nom: formData.nom,
          adresse: formData.adresse,
          age: formData.age,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erreur lors de l'inscription");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4 pt-6 pb-20">

      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">CineCritique</h1>
          <p className="text-muted-foreground">Rejoignez notre communauté de passionnés de cinéma</p>
        </div>

        {/* Carte */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom */}
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-foreground">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.prenom ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="Votre prénom"
                  required
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-foreground">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.nom ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

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
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-foreground">Adresse</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.adresse ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="Votre adresse"
                  required
                />
              </div>
            </div>

            {/* Âge */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-foreground">Âge</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  value={formData.age || ""}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.age ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="25"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
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
            </div>

            {/* Confirmation */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 mt-1 rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-border"} bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none`}
                  placeholder="Confirmez le mot de passe"
                  required
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Créer mon compte"}
            </button>
          </form>

          {/* Lien login */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
