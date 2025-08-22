import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      navigate("/profile");
    } catch (err) {
      setError("Inscription échouée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input className="w-full border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">Mot de passe</label>
          <input className="w-full border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
      <p className="mt-4">
        Déjà un compte ? <Link className="text-blue-600" to="/login">Connexion</Link>
      </p>
    </div>
  );
}


