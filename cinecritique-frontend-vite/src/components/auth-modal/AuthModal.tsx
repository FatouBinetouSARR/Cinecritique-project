import { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (mode === "register" && formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        toast.success("Connexion réussie !");
      } else {
        await register(formData.email, formData.password);
        toast.success("Inscription réussie !");
      }
      onClose();
    } catch {
      toast.error(mode === "login" ? "Email ou mot de passe incorrect" : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white rounded-xl p-6 sm:p-8 flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            {mode === "login" ? "Bienvenue !" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {mode === "login" ? "Connectez-vous pour continuer" : "Remplissez le formulaire pour vous inscrire"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
          </div>
          {mode === "register" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirmez le mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-secondary text-black py-3 rounded-lg flex items-center justify-center font-medium hover:bg-secondary/80 transition"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          {mode === "login" ? (
            <>Pas encore de compte ? <span className="text-secondary cursor-pointer font-medium" onClick={() => window.dispatchEvent(new CustomEvent("switchAuthMode", { detail: "register" }))}>Inscrivez-vous</span></>
          ) : (
            <>Déjà inscrit ? <span className="text-secondary cursor-pointer font-medium" onClick={() => window.dispatchEvent(new CustomEvent("switchAuthMode", { detail: "login" }))}>Connectez-vous</span></>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
};
