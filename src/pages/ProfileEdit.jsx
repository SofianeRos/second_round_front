import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const getPhotoUrl = (path) => {
  if (!path) return "https://via.placeholder.com/300x400/222222/555555?text=PROFIL";
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/images/photos/${path}`;
};

export default function ProfileEdit() {
  const { token, user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    tailleCm: "",
    poidsKg: "",
    niveau: "",
    typeBoxe: "",
    budgetMax: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        pseudo: user.pseudo || "",
        email: user.email || "",
        tailleCm: user.tailleCm !== null && user.tailleCm !== undefined ? String(user.tailleCm) : "",
        poidsKg: user.poidsKg !== null && user.poidsKg !== undefined ? String(user.poidsKg) : "",
        niveau: user.niveau || "",
        typeBoxe: user.typeBoxe || "",
        budgetMax: user.budgetMax !== null && user.budgetMax !== undefined ? String(user.budgetMax) : ""
      });
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    setUpdating(true);
    setMessage("");

    let updatedUser = user;

    // 1. Upload photo if selected
    if (selectedFile) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);
      try {
        const uploadResponse = await api.post("/me/avatar", formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        updatedUser = uploadResponse.data;
        setUser(updatedUser);
      } catch (uploadError) {
        console.error("Erreur lors de l'upload de la photo:", uploadError);
        setMessageType("error");
        setMessage("Erreur lors de l'upload de la photo de profil.");
        setUpdating(false);
        return;
      }
    }

    // 2. Patch other profile fields
    const patchData = {
      pseudo: formData.pseudo.trim(),
      email: formData.email.trim(),
      tailleCm: formData.tailleCm ? Number(formData.tailleCm) : null,
      poidsKg: formData.poidsKg ? Number(formData.poidsKg) : null,
      niveau: formData.niveau || null,
      typeBoxe: formData.typeBoxe || null,
      budgetMax: formData.budgetMax ? String(Number(formData.budgetMax).toFixed(2)) : null
    };

    try {
      const response = await api.patch(`/users/${user.id}`, patchData, {
        headers: {
          "Content-Type": "application/merge-patch+json"
        }
      });
      setUser(response.data);
      setMessageType("success");
      setMessage("Profil mis à jour avec succès ! Redirection...");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setMessageType("error");
      setMessage(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        "Une erreur est survenue lors de la mise à jour."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div 
        style={{ 
          minHeight: '100vh',
          width: '100%',
          background: "repeating-linear-gradient(-45deg, #0a0a0a, #0a0a0a 15px, #141414 15px, #141414 30px)",
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          fontSize: '2rem',
          fontWeight: '900',
          textTransform: 'uppercase',
          borderTop: '1px solid #222'
        }}
      >
        Chargement...
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        width: '100%',
        background: "repeating-linear-gradient(-45deg, #0a0a0a, #0a0a0a 15px, #141414 15px, #141414 30px)",
        display: 'flex', 
        justifyContent: 'center',
        borderTop: '1px solid #222'
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px', padding: '4rem 2rem' }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/profile")} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', 
            background: 'transparent', border: 'none', 
            marginBottom: '4rem', cursor: 'pointer', padding: 0,
            fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em',
            color: '#ffffff'
          }}
        >
          <span style={{ color: '#ff0000' }}>&lt;</span> MON PROFIL
        </button>

        {/* Form Card */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-black/90 p-10 md:p-12 border border-[#333] shadow-2xl">
          <h2 className="mb-8 text-3xl font-black uppercase tracking-tight text-white text-center">
            Mettre à jour mon profil
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            
            {/* Row 1: Pseudo & Email */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Pseudo
                </label>
                <input
                  type="text"
                  name="pseudo"
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                  required
                />
              </div>
            </div>

            {/* Row 2: Photo de profil File Upload */}
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-slate-300">
                Photo de profil
              </label>
              <div className="flex items-center gap-6">
                <div style={{ width: '100px', height: '100px', backgroundColor: '#111', border: '1px solid #333', overflow: 'hidden' }} className="rounded-lg flex-shrink-0">
                  <img 
                    src={previewUrl || getPhotoUrl(user?.photoProfil)} 
                    alt="Aperçu" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-[#ff0000] file:transition-all file:cursor-pointer"
                />
              </div>
            </div>

            {/* Row 3: Taille & Poids */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  name="tailleCm"
                  placeholder="175"
                  value={formData.tailleCm}
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
                  name="poidsKg"
                  placeholder="70"
                  value={formData.poidsKg}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
                />
              </div>
            </div>

            {/* Row 4: Niveau & Type de boxe */}
            <div className="grid gap-6 md:grid-cols-2">
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
                  <option value="Loisir">Loisir</option>
                  <option value="Compétition">Compétition</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                  Type de boxe
                </label>
                <select
                  name="typeBoxe"
                  value={formData.typeBoxe}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all hover:border-[#ff0000] focus:border-[#ff0000]"
                >
                  <option value="">Choisir</option>
                  <option value="Boxe Anglaise">Boxe Anglaise</option>
                  <option value="Boxe Française">Boxe Française</option>
                  <option value="Kickboxing">Kickboxing</option>
                  <option value="Muay Thai">Muay Thai</option>
                  <option value="MMA">MMA</option>
                </select>
              </div>
            </div>

            {/* Row 5: Budget Max */}
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-slate-300">
                Budget max (€)
              </label>
              <input
                type="number"
                step="0.01"
                name="budgetMax"
                placeholder="200"
                value={formData.budgetMax}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-medium text-white outline-none transition-all placeholder:text-white/40 hover:border-[#ff0000] focus:border-[#ff0000]"
              />
            </div>

            {/* Message block */}
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

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={updating}
                className="flex-grow flex h-[85px] items-center justify-center border-[3px] border-[#ff0000] bg-[#ff0000] text-2xl font-black uppercase tracking-widest !text-white hover:bg-[#d00000] hover:border-[#d00000] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{ height: "85px", fontSize: "1.5rem", color: "#ffffff" }}
              >
                {updating ? "ENREGISTREMENT..." : "SAUVEGARDER"}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-grow flex h-[85px] items-center justify-center border-[3px] border-slate-700 bg-transparent text-2xl font-black uppercase tracking-widest text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                style={{ height: "85px", fontSize: "1.5rem" }}
              >
                ANNULER
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
