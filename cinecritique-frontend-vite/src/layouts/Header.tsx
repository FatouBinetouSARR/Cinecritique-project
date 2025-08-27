// cinecritique-frontend-vite/src/components/AuthModal.tsx
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../lib/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";   // 👈 repasse en props
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      <DialogContent className="bg-black text-white border border-secondary max-w-sm rounded-xl shadow-xl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded bg-gray-900 text-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded bg-gray-900 text-white"
          />

          {mode === "register" && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmez le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded bg-gray-900 text-white"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-secondary text-black py-2 px-4 rounded flex items-center justify-center hover:bg-secondary/80 transition"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === "login" ? "Se connecter" : "S'inscrire")}
          </button>
        </form>

        {/* Switch mode */}
        <p className="mt-4 text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>Pas encore de compte ? <span className="text-secondary cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent("switchAuthMode", { detail: "register" }))}>Inscrivez-vous</span></>
          ) : (
            <>Déjà inscrit ? <span className="text-secondary cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent("switchAuthMode", { detail: "login" }))}>Connectez-vous</span></>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
};
