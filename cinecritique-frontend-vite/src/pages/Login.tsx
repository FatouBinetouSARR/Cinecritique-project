import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
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
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
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
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-4">
        Pas de compte ? <Link className="text-blue-600" to="/register">Inscription</Link>
      </p>
    </div>
  );
}


