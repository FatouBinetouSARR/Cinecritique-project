// cinecritique-frontend-vite/src/components/login-register/AuthModal.tsx
import { useState } from "react";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();

  // 🔄 Mode interne (login / register)
  const [mode, setMode] = useState<"login" | "register">("login");

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
      toast.error(
        mode === "login"
          ? "Email ou mot de passe incorrect"
          : "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700 shadow-2xl rounded-xl p-6 sm:p-8 max-w-md w-full animate-in fade-in-50 zoom-in-95">
        <DialogHeader className="text-center space-y-2">
          <div className="flex justify-center">
            {mode === "login" ? (
              <LogIn className="w-10 h-10 text-secondary" />
            ) : (
              <UserPlus className="w-10 h-10 text-secondary" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold tracking-wide">
            {mode === "login" ? "Bienvenue de retour" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            {mode === "login"
              ? "Accédez à votre espace personnel"
              : "Rejoignez notre communauté en quelques secondes"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <input
            name="email"
            type="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition"
          />

          {mode === "register" && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmez le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-secondary hover:bg-secondary/90 text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : mode === "login" ? (
              "Se connecter"
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>

        {/* 🔄 Switch login/register */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-secondary hover:underline"
              >
                Inscrivez-vous
              </button>
            </>
          ) : (
            <>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-secondary hover:underline"
              >
                Connectez-vous
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
