// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      toast.error("Vérifiez vos champs et que les mots de passe correspondent");
      return;
    }
    setLoading(true);
    try {
      await register(formData.email, formData.password);
      toast.success("Inscription réussie !");
      navigate("/login");
    } catch {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirmez le mot de passe"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white p-2 rounded flex items-center justify-center"
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "S'inscrire"}
      </button>
    </form>
  );
}
