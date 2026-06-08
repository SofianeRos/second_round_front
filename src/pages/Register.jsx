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
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%), url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-[800px] overflow-hidden rounded-2xl bg-black/85 backdrop-blur-md border border-[#333] p-10 md:p-16 shadow-2xl">
          <div className="relative z-10">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                S'INSCRIRE
              </h1>
              <p className="text-lg text-slate-400 font-light">
                Créez un compte pour accéder à la boutique
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
            >
              {/* Pseudo */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Pseudo
                </label>
                <input
                  type="text"
                  name="pseudo"
                  placeholder="jeandupont"
                  value={formData.pseudo}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jean@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                  required
                />
              </div>

              {/* Taille */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  name="taille_cm"
                  placeholder="175"
                  value={formData.taille_cm}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                />
              </div>

              {/* Poids */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  name="poids_kg"
                  placeholder="70"
                  value={formData.poids_kg}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                />
              </div>

              {/* Niveau */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Niveau
                </label>
                <div className="relative">
                  <select
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 pr-12 text-xl font-medium !text-white outline-none transition-all hover:!border-[#ff0000] focus:!border-[#ff0000] appearance-none"
                    style={{ borderRadius: "0px" }}
                  >
                    <option value="" className="bg-[#151515] text-white">Choisir</option>
                    <option value="debutant" className="bg-[#151515] text-white">Débutant</option>
                    <option value="intermediaire" className="bg-[#151515] text-white">Intermédiaire</option>
                    <option value="avance" className="bg-[#151515] text-white">Avancé</option>
                    <option value="expert" className="bg-[#151515] text-white">Expert</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                    <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Type de boxe */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Type de boxe
                </label>
                <div className="relative">
                  <select
                    name="type_boxe"
                    value={formData.type_boxe}
                    onChange={handleChange}
                    className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 pr-12 text-xl font-medium !text-white outline-none transition-all hover:!border-[#ff0000] focus:!border-[#ff0000] appearance-none"
                    style={{ borderRadius: "0px" }}
                  >
                    <option value="" className="bg-[#151515] text-white">Choisir</option>
                    <option value="boxe_anglaise" className="bg-[#151515] text-white">Boxe Anglaise</option>
                    <option value="boxe_francaise" className="bg-[#151515] text-white">Boxe Française</option>
                    <option value="kickboxing" className="bg-[#151515] text-white">Kickboxing</option>
                    <option value="muay_thai" className="bg-[#151515] text-white">Muay Thai</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                    <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Budget max */}
              <div className="flex flex-col md:col-span-2">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Budget max
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="budget_max"
                  placeholder="100"
                  value={formData.budget_max}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                />
              </div>

              {/* Mot de passe */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                  required
                />
              </div>

              {/* Confirmer le mot de passe */}
              <div className="flex flex-col">
                <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="w-full !h-16 border-2 !border-slate-700 !bg-black/60 px-5 text-xl font-medium !text-white outline-none transition-all placeholder:!text-white/30 hover:!border-[#ff0000] focus:!border-[#ff0000]"
                  style={{ borderRadius: "0px" }}
                  required
                />
              </div>

              {/* Error/Success message */}
              {message && (
                <div
                  className={`md:col-span-2 rounded-lg border p-4 text-center text-sm font-bold ${
                    messageType === "success"
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                      : "border-red-500/50 bg-red-500/20 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Button */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full !h-[80px] items-center justify-center border-[3px] !border-white !bg-transparent text-2xl font-black uppercase tracking-widest !text-white transition-all hover:!bg-[#ff0000] hover:!border-[#ff0000] hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ borderRadius: "0px", height: "80px", color: "#ffffff" }}
                >
                  {loading ? "Inscription en cours..." : "Créer mon compte"}
                </button>
              </div>
            </form>

            <div className="mt-12 border-t border-slate-800/80 pt-8 text-center">
              <p className="text-lg text-slate-400">
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
