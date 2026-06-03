import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Header() {
  const { token, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Correction du bug qui fait planter
  const navigate = useNavigate(); // Ajout pour la redirection après déconnexion

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-black border-b border-[#222] sticky top-0 z-50 py-4">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center gap-6 md:gap-8">
          {/* Logo Image */}
          <Link
            to="/"
            className="flex-shrink-0 hover:opacity-80 transition inline-block"
          >
            <img
              src={LOGO_URL}
              alt="2ROUND Logo"
              className="h-10 md:h-14 lg:h-16 w-auto object-contain"
              style={{ maxWidth: "180px" }}
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-3xl justify-center">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Recherche des articles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border-2 border-gray-600 rounded-full pl-12 pr-12 py-3 text-white text-base placeholder-gray-500 focus:border-white focus:outline-none transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition text-lg">
                📷
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            {token ? (
              <>
                {/* Icône Profil (Lien vers le vestiaire/profil) */}
                <Link to="/profile" className="text-white hover:text-gray-300 transition flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>

                {/* Icône Messages */}
                <button className="text-white hover:text-gray-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>

                {/* Icône Panier */}
                <button className="text-white hover:text-gray-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </button>

                {/* Bouton DÉCONNEXION (Rouge) */}
                <button 
                  onClick={handleLogout}
                  className="text-[#ff0000] font-bold text-[15px] tracking-widest uppercase hover:text-white transition ml-4"
                >
                  Déconnexion
                </button>

                {/* Menu Burger */}
                <button
                  className="text-white hover:text-gray-300 transition ml-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Lien SE CONNECTER */}
                <Link to="/login" className="text-white font-bold text-[15px] tracking-widest uppercase hover:text-[#ff0000] transition mr-4">
                  Se connecter
                </Link>

                {/* Icône Panier */}
                <button className="text-white hover:text-gray-300 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </button>

                {/* Menu Burger */}
                <button
                  className="text-white hover:text-gray-300 transition ml-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}