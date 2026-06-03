import { useNavigate } from "react-router-dom";

const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-black pt-28 pb-24 flex justify-center border-t border-[#333] mt-24">
      <div className="w-full max-w-[1300px] px-8 flex flex-col">
        {/* LIGNE 1 : Logo & Titres (FORCÉ à 4 colonnes) */}
        <div className="grid grid-cols-4 gap-8 items-end mb-16">
          {/* Colonne 1 : Logo */}
          <div>
            <img
              src={LOGO_URL}
              alt="2ROUND Logo"
              className="w-[180px] h-auto object-contain -ml-2"
            />
          </div>
          {/* Colonne 2 : Vide pour créer l'espace */}
          <div></div>
          {/* Colonne 3 : Titre 1 */}
          <div>
            <h3 className="text-white font-bold text-[18px] uppercase tracking-wider mb-2">
              MON ROUND PERSO
            </h3>
          </div>
          {/* Colonne 4 : Titre 2 */}
          <div>
            <h3 className="text-white font-bold text-[18px] uppercase tracking-wider mb-2">
              MON VESTIAIRE
            </h3>
          </div>
        </div>

        {/* LIGNE 2 : Première rangée de liens (FORCÉ à 4 colonnes) */}
        <div className="grid grid-cols-4 gap-8 mb-6">
          <span
            onClick={() => navigate("/login")}
            className="text-white font-bold text-[17px] uppercase tracking-wider cursor-pointer hover:text-[#ff0000] transition-colors"
          >
            CRÉER MON PROFIL
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Les Packs
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Pack personnalisé
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Articles
          </span>
        </div>

        {/* LIGNE 3 : Deuxième rangée de liens (FORCÉ à 4 colonnes) */}
        <div className="grid grid-cols-4 gap-8">
          <span
            onClick={() => navigate("/sell")}
            className="text-white font-bold text-[17px] uppercase tracking-wider cursor-pointer hover:text-[#ff0000] transition-colors"
          >
            COMMENCER À VENDRE
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Les Guides
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Favoris
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Évaluations
          </span>
        </div>
      </div>
    </footer>
  );
}
