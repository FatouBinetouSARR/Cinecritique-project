import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  const [backendError, setBackendError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validation des champs obligatoires
    if (!formData.email.trim()) newErrors.email = "Email requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    if (!formData.adresse.trim()) newErrors.adresse = "Adresse requise";
    if (!formData.age) newErrors.age = "Âge requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmation du mot de passe requise";

    // Validation de l'email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation de l'âge
    if (formData.age <= 0) newErrors.age = "L'âge doit être supérieur à 0";

    // Validation de la confirmation du mot de passe
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        // Inscription réussie, redirection vers login
        navigate("/login", { 
          state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." }
        });
      } else {
        const errorData = await response.json();
        setBackendError(errorData.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setBackendError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Rejoignez CineCritique pour partager vos avis sur les films
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.prenom ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Votre prénom"
                />
                {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.nom ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Votre nom"
                />
                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                id="adresse"
                name="adresse"
                type="text"
                autoComplete="street-address"
                required
                value={formData.adresse}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.adresse ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Votre adresse complète"
              />
              {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
            </div>

            {/* Âge */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Âge
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                required
                value={formData.age || ""}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.age ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="25"
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Votre mot de passe"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirmez votre mot de passe"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Erreur backend */}
            {backendError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {backendError}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription en cours...
                  </div>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Déjà inscrit ?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Connectez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


