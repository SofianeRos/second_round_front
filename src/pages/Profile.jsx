import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // Si on essaie d'accéder au profil sans être connecté, on dégage vers le login
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl border border-[#333] bg-black/80 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
          MON VESTIAIRE
        </h1>
        <div className="w-24 h-1 bg-[#ff0000] mx-auto mb-8"></div>
        
        <p className="text-xl text-slate-400 font-light mb-12">
          Bienvenue dans ton espace personnel. Le design de cette page est en cours de construction sur Figma !
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => navigate("/")}
            className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Retour au catalogue
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-8 py-4 border-2 border-[#ff0000] text-[#ff0000] font-bold uppercase tracking-widest hover:bg-[#ff0000] hover:text-white transition-colors"
          >
            Me déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}