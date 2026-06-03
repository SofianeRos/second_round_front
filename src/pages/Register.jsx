import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const HERO_IMAGE = "http://localhost:8000/images/background.png";
const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

const initialFormState = {
  email: "",
  pseudo: "",
  taille_cm: "",
  poids_kg: "",
  niveau: "",
  type_boxe: "",
  budget_max: "",
  password: "",
  password_confirm: "",
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.pseudo.trim()) {
      setMessageType("error");
      setMessage("Le pseudo est requis.");
      return false;
    }

    if (!formData.email.includes("@")) {
      setMessageType("error");
      setMessage("Veuillez entrer une adresse email valide.");
      return false;
    }

    if (formData.password.length < 6) {
      setMessageType("error");
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }

    if (formData.password !== formData.password_confirm) {
      setMessageType("error");
      setMessage("Les mots de passe ne correspondent pas.");
      return false;
    }

    return true;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/register", {
        email: formData.email,
        pseudo: formData.pseudo,
        password: formData.password,
        taille_cm: formData.taille_cm ? Number(formData.taille_cm) : null,
        poids_kg: formData.poids_kg ? Number(formData.poids_kg) : null,
        niveau: formData.niveau || null,
        type_boxe: formData.type_boxe || null,
        budget_max: formData.budget_max ? Number(formData.budget_max) : null,
      });

      setMessageType("success");
      setMessage("Inscription réussie ! Redirection vers connexion...");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);

      let errorMsg = "Une erreur est survenue lors de l'inscription.";

      if (error.response?.status === 409) {
        errorMsg = "Cet utilisateur ou email existe déjà.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }

      setMessageType("error");
      setMessage(errorMsg);
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
      <div className="flex flex-1 items-center justify-center px-8 py-10 md:px-16">
        <div className="relative w-full max-w-[830px] overflow-hidden rounded-2xl bg-black/90 p-9 shadow-2xl group">
          <div className="absolute -inset-1 rounded-2xl bg-[#ff0000] opacity-0 blur transition duration-500 group-hover:opacity-10" />

          <div className="relative">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-black uppercase tracking-tighter text-white">
                S'inscrire
              </h1>
              <p className="text-sm text-slate-400">
                Créez un compte pour accéder à la boutique
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="mx-auto flex w-full max-w-[680px] flex-col space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Pseudo
                </label>
                <input
                  type="text"
                  name="pseudo"
                  placeholder="jeandupont"
                  value={formData.pseudo}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jean@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Taille (cm)
                  </label>
                  <input
                    type="number"
                    name="taille_cm"
                    placeholder="175"
                    value={formData.taille_cm}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    name="poids_kg"
                    placeholder="70"
                    value={formData.poids_kg}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Niveau
                  </label>
                  <select
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all hover:border-[#ff0000] focus:border-[#ff0000]"
                  >
                    <option value="">Choisir</option>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Type de boxe
                  </label>
                  <select
                    name="type_boxe"
                    value={formData.type_boxe}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all hover:border-[#ff0000] focus:border-[#ff0000]"
                  >
                    <option value="">Choisir</option>
                    <option value="boxe_anglaise">Boxe Anglaise</option>
                    <option value="boxe_francaise">Boxe Française</option>
                    <option value="kickboxing">Kickboxing</option>
                    <option value="muay_thai">Muay Thai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Budget max
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="budget_max"
                  placeholder="100"
                  value={formData.budget_max}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="password_confirm"
                    placeholder="••••••••"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-lg border p-4 text-center text-sm font-bold ${
                    messageType === "success"
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                      : "border-red-500/50 bg-red-500/20 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full h-[80px] items-center justify-center border-[3px] border-white bg-transparent text-2xl font-black uppercase tracking-widest !text-white transition-all hover:bg-[#ff0000] hover:border-[#ff0000] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderRadius: "0px", color: "#ffffff" }}
              >
                {loading ? "Inscription en cours..." : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#ff0000] uppercase tracking-wide transition-opacity hover:opacity-80 ml-2"
                >
                  SE CONNECTER
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
