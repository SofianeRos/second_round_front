import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Header() {
  const { token, logout, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = searchParams.get("search") || "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (location.pathname === "/catalogue") {
      // On est déjà sur le catalogue : on met à jour les params en place
      setSearchParams(val ? { search: val } : {}, { replace: true });
    } else {
      // Depuis n'importe quelle autre page → catalogue avec recherche
      navigate(`/catalogue${val ? `?search=${encodeURIComponent(val)}` : ""}`, { replace: false });
    }
  };


  return (
    <header className="bg-black border-b border-[#222] sticky top-0 z-50 py-5.5 w-full flex justify-center">
      <div className="max-w-screen-2xl w-full px-4 md:px-8 relative">
        <div className="flex justify-between items-center w-full">
          {/* Column Left: Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 hover:opacity-80 transition inline-block"
            >
              <img
                src={LOGO_URL}
                alt="2ROUND Logo"
                className="h-11 md:h-15 lg:h-18 w-auto object-contain"
                style={{ maxWidth: "200px" }}
              />
            </Link>
          </div>

          {/* Column Center: Search Bar (Absolutely centered on desktop) */}
          <div className="hidden md:flex absolute justify-center z-10 w-full max-w-md lg:max-w-xl xl:max-w-2xl" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Recherche des articles"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-black border border-white/40 rounded-full search-input py-3 text-white text-base placeholder-gray-500 focus:border-white focus:outline-none transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Column Right: Actions Icons */}
          <div className="flex items-center gap-6">
            {/* Desktop-only Navigation Icons */}
            <nav className="hidden md:flex gap-6 items-center">
              {/* User Dropdown Profile Action */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="text-white hover:text-gray-300 transition flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-3 w-48 bg-[#151515] border border-white/10 rounded-md shadow-2xl py-2 z-50">
                      {token ? (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-white transition-colors"
                          >
                            Mon Vestiaire
                          </Link>
                          {user?.roles?.includes('ROLE_ADMIN') && (
                            <Link
                              to="/admin"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="block px-4 py-2 text-sm transition-colors"
                              style={{ color: '#ff6666' }}
                            >
                              ⚙ Panel Admin
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              handleLogout();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#222] hover:text-red-400 transition-colors cursor-pointer"
                          >
                            Déconnexion
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-white transition-colors"
                          >
                            Se connecter
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#222] hover:text-white transition-colors"
                          >
                            Créer un compte
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Admin Shield Icon — visible uniquement ROLE_ADMIN */}
              {user?.roles?.includes('ROLE_ADMIN') && (
                <Link
                  to="/admin"
                  title="Panel Admin"
                  style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  className="group"
                >
                  <div style={{
                    width: '34px', height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 0, 0, 0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,0,0,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255,0,0,0.7)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(255,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,0,0,0.35)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </Link>
              )}

              {/* Messages (Paper Airplane) */}
              <Link to={token ? "/messages" : "/login"} className="text-white hover:text-gray-300 transition inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" style={{ transform: "rotate(-45deg)", transformOrigin: "center" }}>
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.53 60.53 0 0 0 17.836-7.948.75.75 0 0 0 0-1.254A60.53 60.53 0 0 0 3.478 2.404Z" />
                </svg>
              </Link>

            </nav>


            {/* Hamburger Menu (Visible on all screens) */}
            <button
              className="text-white hover:text-gray-300 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 top-[73px] bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-[73px] left-0 right-0 bg-[#0a0a0a] border-b border-[#222] p-6 flex flex-col gap-6 z-50 md:hidden">
            {/* Search Bar for Mobile */}
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Recherche des articles"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-black border border-white/40 rounded-full search-input py-3 text-white text-base placeholder-gray-500 focus:border-white focus:outline-none transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </span>
            </div>

            {/* Navigation links for Mobile */}
            <div className="flex flex-col gap-4 font-bold tracking-wider text-lg uppercase">
              {token ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-red-500 transition py-2 border-b border-white/5">
                    Mon Vestiaire
                  </Link>
                  <Link to="/messages" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-red-500 transition py-2 border-b border-white/5">
                    Messagerie
                  </Link>
                  {user?.roles?.includes('ROLE_ADMIN') && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: '#ff6666' }} className="hover:opacity-80 transition py-2 border-b border-white/5">
                      ⚙ Panel Admin
                    </Link>
                  )}
                  <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="text-red-500 hover:text-red-400 transition text-left py-2">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-red-500 transition py-2 border-b border-white/5">
                    Se connecter
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-red-500 transition py-2 border-b border-white/5">
                    Créer un compte
                  </Link>

                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}