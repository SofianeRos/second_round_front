import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const HERO_IMAGE = "http://localhost:8000/images/background.png";
const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login_check", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-black"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%), url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav
        className="w-full border-b border-black px-6 py-3 md:px-8"
        style={{ backgroundColor: "#000000", opacity: 1 }}
      >
        <Link to="/" className="inline-block hover:opacity-80 transition">
          <img
            src={LOGO_URL}
            alt="2ROUND Logo"
            className="h-10 w-auto object-contain md:h-12 lg:h-14"
            style={{ maxWidth: "180px" }}
          />
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-center px-8 py-10 md:px-16">
        <div className="relative w-full max-w-[730px] overflow-hidden rounded-2xl bg-black/90 p-8 shadow-2xl group">
          <div className="absolute -inset-1 rounded-2xl bg-[#ff0000] opacity-0 blur transition duration-500 group-hover:opacity-10" />

          <div className="relative">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter text-white">
                Se connecter
              </h1>
              <p className="text-sm text-slate-400">
                Connectez-vous pour accéder à votre compte
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-center text-sm font-bold text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-[520px] flex-col space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  placeholder="jean@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 mx-auto inline-flex h-24 w-fit min-w-[380px] items-center justify-center rounded-lg border-2 px-12 text-3xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  borderColor: "#FFFFFF",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#DC2626";
                  event.currentTarget.style.color = "#FFFFFF";
                  event.currentTarget.style.borderColor = "#DC2626";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "transparent";
                  event.currentTarget.style.color = "#FFFFFF";
                  event.currentTarget.style.borderColor = "#FFFFFF";
                }}
              >
                {loading ? "Connexion..." : "Connexion"}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="font-bold text-red-500 transition-colors hover:text-red-400"
                >
                  Créer mon compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
