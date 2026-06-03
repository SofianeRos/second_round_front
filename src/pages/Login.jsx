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
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/profile");
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

      login(response.data.token);
      navigate("/profile");
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
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%), url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-[700px] overflow-hidden rounded-2xl bg-black/85 backdrop-blur-md border border-[#333] p-10 md:p-16 shadow-2xl">
          <div className="relative z-10">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                SE CONNECTER
              </h1>
              <p className="text-lg text-slate-400 font-light">
                Connectez-vous pour accéder à votre vestiaire
              </p>
            </div>

            {error && (
              <div className="mb-8 rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-center text-sm font-bold text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
              <div>
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                  placeholder="boxeur@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Bouton : modificateurs "!" ajoutés pour écraser le CSS global */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full !h-[80px] items-center justify-center border-[3px] !border-white !bg-transparent text-2xl font-black uppercase tracking-widest !text-white transition-all hover:!bg-[#ff0000] hover:!border-[#ff0000] hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderRadius: "0px",
                  height: "80px",
                  color: "#ffffff",
                }}
              >
                {loading ? "CONNEXION EN COURS..." : "CONNEXION"}
              </button>
            </form>

            <div className="mt-12 border-t border-slate-800/80 pt-8 text-center">
              <p className="text-lg text-slate-400">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#ff0000] uppercase tracking-wide transition-opacity hover:opacity-80 ml-2"
                >
                  CRÉER MON PROFIL
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
