import { useNavigate } from "react-router-dom";

const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-black pt-36 pb-32 flex justify-center border-t border-[#333] mt-32">
      <div className="w-full max-w-[1300px] px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
        {/* Column 1: Logo & Actions */}
        <div className="flex flex-col gap-6">
          <img
            src={LOGO_URL}
            alt="2ROUND Logo"
            className="w-[180px] h-auto object-contain -ml-2"
          />
          <div className="flex flex-col gap-4 mt-4">
            <span
              onClick={() => navigate("/login")}
              className="text-white font-bold text-[17px] uppercase tracking-wider cursor-pointer hover:text-[#ff0000] transition-colors"
            >
              CRÉER MON PROFIL
            </span>
            <span
              onClick={() => navigate("/sell")}
              className="text-white font-bold text-[17px] uppercase tracking-wider cursor-pointer hover:text-[#ff0000] transition-colors"
            >
              COMMENCER À VENDRE
            </span>
          </div>
        </div>

        {/* Column 2: Guides & Packs */}
        <div className="flex flex-col gap-4 md:pt-[106px]">
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Les Packs
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Les Guides
          </span>
        </div>

        {/* Column 3: Mon Round Perso */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-[18px] uppercase tracking-wider mb-2">
            MON ROUND PERSO
          </h3>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Pack personnalisé
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Favoris
          </span>
        </div>

        {/* Column 4: Mon Vestiaire */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-[18px] uppercase tracking-wider mb-2">
            MON VESTIAIRE
          </h3>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Articles
          </span>
          <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
            Évaluations
          </span>
        </div>
      </div>
    </footer>
  );
}
