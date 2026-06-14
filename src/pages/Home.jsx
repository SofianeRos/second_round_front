import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const HERO_IMAGE = "http://localhost:8000/images/background.png";
const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles?pagination=false");
        const data = response.data['hydra:member'] || response.data.member || (Array.isArray(response.data) ? response.data : []);
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (a) =>
        (a.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (a.marque || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.vendeur?.pseudo || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);


  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      {/* HERO SECTION : Calibrée parfaitement pour 1080p */}
      <section
        className="w-full relative flex flex-col justify-between"
        style={{
          height: "100vh",
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.95) 100%), url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center left",
        }}
      >
        {/* Bloc central-droit */}
        <div className="flex-1 flex flex-col justify-center items-end px-8 md:px-16 lg:px-24">
          {/* Conteneur taille 1080p (max 500px de large) */}
          <div
            className="flex flex-col items-center w-full max-w-[500px]"
            style={{ gap: "40px" }}
          >
            <img
              src={LOGO_URL}
              alt="2ROUND Logo"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />

            {/* BOUTONS : Transparents, bordure blanche, hover ROUGE pour les deux */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                width: "100%",
              }}
            >
              <div
                onClick={() => navigate("/login")}
                className="w-full h-[75px] bg-transparent border-[3px] border-white text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-colors duration-300 flex justify-center items-center font-black text-xl uppercase tracking-widest cursor-pointer"
              >
                Créer mon profil
              </div>
              <div
                onClick={() => navigate("/sell")}
                className="w-full h-[75px] bg-transparent border-[3px] border-white text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-colors duration-300 flex justify-center items-center font-black text-xl uppercase tracking-widest cursor-pointer"
              >
                Commencer à vendre
              </div>
            </div>
          </div>
        </div>

        {/* MENU DU BAS : Textes agrandis (text-3xl/4xl) et mis en gras (font-bold) */}
        <div
          style={{
            width: "100%",
            paddingBottom: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "900px",
              padding: "0 20px",
            }}
          >
            <div
              onClick={() => navigate("/guides")}
              className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300"
            >
              Guide
            </div>

            <div
              onClick={() => navigate("/catalogue")}
              className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300"
            >
              Catalogue
            </div>

            <div
              onClick={() => navigate("/sell")}
              className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300"
            >
              Revente
            </div>
          </div>
        </div>
      </section>      {/* SECTION UN COUP DE POING ? */}
      <section
        className="w-full min-h-[85vh] bg-[#0c0c0c] border-y border-white/10 py-16 md:py-24 flex flex-col items-center relative overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 40px)`,
        }}
      >
        <div className="w-full max-w-[1400px] px-6 md:px-12 flex flex-col gap-8 md:gap-12 flex-grow">
          {/* Title */}
          <div className="w-full pt-20 md:pt-28">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wide text-left">
              UN COUP DE POING ?
            </h2>
          </div>

          {/* Cards wrapper */}
          <div className="w-full flex-grow flex flex-col justify-center gap-6 md:gap-8">
            {/* Cards grid - responsive: 1 column on mobile, 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
              {/* Card 1: LES TAILLES */}
              <div
                onClick={() => navigate("/guides/tailles")}
                className="bg-[#1a1a1a] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 hover:scale-[1.03] hover:bg-[#222] hover:border-white/10 transition-all duration-300 cursor-pointer aspect-square shadow-xl group"
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 481 476"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      d="M173.882 107.765C173.882 137.958 214.74 162.515 264.946 162.515C315.153 162.515 356 137.958 356 107.765C356 77.5717 315.269 53.0763 265.161 53L264.703 53.0109C214.623 53.0872 173.878 77.648 173.878 107.765H173.882ZM238.317 89.8721C245.46 85.4207 254.925 82.9643 264.946 82.9643C274.968 82.9643 284.422 85.4207 291.58 89.8721C299.105 94.5524 303.257 100.912 303.257 107.765C303.257 114.618 299.105 120.977 291.58 125.658C284.422 130.109 274.972 132.566 264.946 132.566C254.921 132.566 245.46 130.109 238.317 125.658C230.788 120.977 226.636 114.618 226.636 107.765C226.636 100.912 230.788 94.5488 238.317 89.8721Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M335.633 153.975C316.67 165.766 291.565 172.264 264.946 172.264C238.328 172.264 213.226 165.766 194.26 153.975C185.767 148.684 178.951 142.641 173.882 135.955V182.896C173.882 194.357 179.777 205.001 189.828 213.805V196.984C189.828 194.179 192.113 191.897 194.922 191.897C197.732 191.897 200.017 194.179 200.017 196.984V221.24C207.185 225.63 215.57 229.296 224.842 232.047V212.337C224.842 209.532 227.127 207.25 229.936 207.25C232.745 207.25 235.031 209.532 235.031 212.337V234.609C242.876 236.255 251.202 237.283 259.856 237.57V216.785C259.856 213.98 262.141 211.698 264.95 211.698C267.759 211.698 270.045 213.98 270.045 216.785V237.57C278.694 237.283 287.02 236.255 294.869 234.609V213.049C294.869 210.244 297.155 207.962 299.964 207.962C302.773 207.962 305.058 210.244 305.058 213.049V232.047C314.33 229.3 322.715 225.63 329.883 221.236V198.888C329.883 196.083 332.169 193.801 334.978 193.801C337.787 193.801 340.072 196.083 340.072 198.888V213.794C350.112 204.993 356.004 194.35 356.004 182.893V135.951C350.949 142.641 344.122 148.68 335.636 153.971L335.633 153.975Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M194.26 61.125C199.191 58.0617 204.54 55.3509 210.257 53.0107H125V118.397H163.693V107.765C163.693 89.9591 174.559 73.3854 194.26 61.125Z"
                      fill="#FF0000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect
                        width="231"
                        height="185"
                        fill="white"
                        transform="translate(125 53)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-2 uppercase tracking-wide text-center">
                  LES TAILLES
                </h3>
                <p className="text-gray-400 text-[11px] md:text-xs lg:text-sm text-center font-light leading-snug">
                  Trouver la bonne taille selon son corps.
                </p>
              </div>

              {/* Card 2: LES ÉQUIPEMENTS */}
              <div
                className="bg-[#1a1a1a] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 aspect-square shadow-xl group opacity-60"
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 481 476"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <g clipPath="url(#clip1)">
                    <path
                      d="M189.524 53H191.169C204.014 53 214.447 63.4727 214.447 76.3747V214.629C214.447 227.527 204.018 238.004 191.169 238.004H189.524C176.679 238.004 166.246 227.531 166.246 214.629V76.3747C166.246 63.4727 176.679 53 189.524 53Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M158.652 214.625V76.371C158.652 75.8554 158.666 75.3397 158.691 74.8277C156.901 74.2394 154.992 73.9163 153.007 73.9163C142.921 73.9163 134.719 82.152 134.719 92.2834V198.713C134.719 208.841 142.921 217.076 153.007 217.076C154.992 217.076 156.901 216.753 158.691 216.165C158.666 215.653 158.652 215.141 158.652 214.622V214.625Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M127.125 111.831C126.235 111.671 125.324 111.58 124.391 111.58C115.911 111.58 109 118.505 109 127.035V163.969C109 172.495 115.911 179.424 124.391 179.424C125.324 179.424 126.235 179.333 127.125 179.173V111.831Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M290.831 53H292.476C305.321 53 315.754 76.3747 315.754 76.3747V214.629C315.754 227.527 305.325 238.004 292.476 238.004H290.831C277.986 238.004 267.553 227.531 267.553 214.629V76.3747C267.553 63.4763 277.982 53 290.831 53Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M323.348 214.625V76.371C323.348 75.8554 323.334 75.3397 323.309 74.8277C325.099 74.2394 327.008 73.9163 328.993 73.9163C339.079 73.9163 347.281 82.152 328.993 217.076C327.008 217.076 325.099 216.753 323.309 216.165C323.334 215.653 323.348 215.141 323.348 214.622V214.625Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M354.875 111.831C355.765 111.671 356.676 111.58 357.609 111.58C366.089 111.58 373 118.505 373 127.035V163.969C373 172.495 366.089 179.424 357.609 179.424C356.676 179.424 355.765 179.333 354.875 179.173V111.831Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M258.722 128.342H223.282V162.658H258.722V128.342Z"
                      fill="#FF0000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip1">
                      <rect
                        width="264"
                        height="185"
                        fill="white"
                        transform="translate(109 53)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-2 uppercase tracking-wide text-center">
                  LES ÉQUIPEMENTS
                </h3>
                <p className="text-gray-400 text-[11px] md:text-xs lg:text-sm text-center font-light leading-snug">
                  Comprendre chaque équipement et à quoi il sert.
                </p>
              </div>

              {/* Card 3: BIEN DÉBUTER */}
              <div
                className="bg-[#1a1a1a] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 aspect-square shadow-xl group opacity-60"
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 481 476"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <g clipPath="url(#clip2)">
                    <path
                      d="M182.873 142.243L195.276 121.502C196.074 120.162 197.551 119.332 199.133 119.332C199.213 119.332 199.296 119.332 199.376 119.338C201.04 119.427 202.504 120.43 203.204 121.954L218.514 156.175L238.765 95.4912C239.366 93.6678 241.075 92.4395 243.012 92.4395C245.031 92.4618 246.728 93.741 247.291 95.6248L268.136 164.951L277.253 145.374C277.985 143.806 279.582 142.794 281.318 142.794H341.868C346.298 126.339 346.048 109.162 340.993 91.6121C340.954 91.5039 340.919 91.4339 340.919 91.3639C336.142 76.8916 321.701 58.4733 296.708 53.9929C293.634 53.3533 264.975 48.09 240.979 70.4191C217.025 48.0868 188.363 53.3501 185.289 53.9897C160.296 58.4702 145.855 76.8884 141.081 91.3607C141.081 91.4308 141.043 91.5039 141.007 91.609C136.006 108.964 135.712 125.954 139.991 142.243H182.873Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M284.165 151.7L271.29 179.356C270.555 180.925 268.96 181.934 267.231 181.934C267.123 181.934 267.017 181.931 266.908 181.921C265.049 181.788 263.454 180.508 262.94 178.736L242.788 111.685L223.368 169.877C222.786 171.637 221.205 172.836 219.338 172.925L219.121 172.932C217.351 172.932 215.747 171.891 215.034 170.284L198.554 133.448L189.264 148.986C188.427 150.335 186.96 151.153 185.42 151.153H142.822C149.492 169.081 161.852 186.055 179.773 201.587C206.914 225.125 236.946 237.001 238.202 237.465C239.091 237.822 240.052 238 240.979 238C241.906 238 242.906 237.822 243.795 237.465C245.054 237.004 275.083 225.128 302.223 201.587C319.962 186.211 332.253 169.425 338.97 151.697H284.165V151.7Z"
                      fill="#FF0000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip2">
                      <rect
                        width="208"
                        height="185"
                        fill="white"
                        transform="translate(137 53)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-2 uppercase tracking-wide text-center">
                  BIEN DÉBUTER
                </h3>
                <p className="text-gray-400 text-[11px] md:text-xs lg:text-sm text-center font-light leading-snug">
                  Conseil sécurité et entraînement.
                </p>
              </div>
            </div>

            {/* Button: bottom-right of the content block */}
            <div className="w-full flex justify-end">
              <button
                onClick={() => navigate("/guides")}
                className="hover:opacity-80 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none text-[#ff0000] font-black text-lg md:text-2xl tracking-wider"
              >
                Voir les guides <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION NOTRE SÉLECTION */}
      <section className="w-full min-h-[85vh] bg-[#080808] border-b border-white/10 py-16 md:py-24 flex flex-col items-center relative overflow-hidden">
        <div className="w-full max-w-[1400px] px-6 md:px-12 flex flex-col gap-8 md:gap-12 flex-grow">
          {/* Title */}
          <div className="w-full pt-20 md:pt-28">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wide text-left">
              NOTRE SELECTION
            </h2>
          </div>

          {/* Cards wrapper */}
          <div className="w-full flex-grow flex flex-col justify-center">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="catalogue-spinner" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-gray-500 text-center py-12 font-medium">
                Aucun article dans notre sélection pour le moment.
              </div>
            ) : (
              <div className="relative w-full group">
                {/* Left arrow */}
                <button
                  onClick={() => scroll("left")}
                  className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-[#ff0000] text-white w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/10 hover:border-[#ff0000] transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-2xl active:scale-95"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Scrollable list */}
                <div
                  ref={scrollRef}
                  className="flex flex-row gap-6 md:gap-8 w-full overflow-x-auto pb-4 scroll-smooth scrollbar-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredArticles.slice(0, 10).map((item) => {
                    const imageUrl = item.imageUrl
                      ? `http://localhost:8000${item.imageUrl}`
                      : null;
                    return (
                      <div
                        key={item.id}
                        className="w-[260px] md:w-[340px] lg:w-[320px] flex-shrink-0 flex flex-col cursor-pointer group bg-[#151515] p-4 rounded-2xl border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:bg-[#1c1c1c] hover:border-white/10"
                        onClick={() => navigate(`/articles/${item.id}`)}
                      >
                        {/* Image Wrapper */}
                        <div className="w-full aspect-square bg-[#1a1a1a] relative mb-4 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.marque}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#222] to-[#111]">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m21 15-5-5L5 21" />
                              </svg>
                            </div>
                          )}
                          {/* Badge Check inside top-right corner */}
                          {item.certifie && (
                            <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center border border-emerald-500/30 shadow-md">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                                <path d="M7 12l3.5 3.5 6.5-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col px-1">
                          <h3 className="text-white font-bold text-[17px] leading-tight truncate">
                            {item.marque}
                          </h3>
                          <p className="text-[#a0a0a0] text-[14px] font-light mt-1 truncate">
                            {item.description}
                          </p>
                          <p className="text-white font-bold text-[20px] mt-3">
                            {parseFloat(item.prix)}€
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => scroll("right")}
                  className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-[#ff0000] text-white w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/10 hover:border-[#ff0000] transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-2xl active:scale-95"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BOX 3: SECTION TON MATÉRIEL */}
      <section className="w-full min-h-[50vh] bg-black border-b border-white/10 py-20 md:py-28 flex justify-center items-center">
        <div className="w-full max-w-[1400px] px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 w-full">
          
          {/* Left Column: Title + Badges */}
          <div className="flex flex-col gap-8 md:gap-12 flex-grow max-w-[800px]">
            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.1] text-left">
              TON MATÉRIEL PEUT<br />
              <span className="text-[#ff0000]">ENCORE</span> FAIRE DES<br />
              ROUNDS
            </h2>

            {/* Badges Grid (2x2 grid on larger screens, 1 column on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[650px] w-full">
              {/* Badge 1 : GAGNE DE L'ARGENT */}
              <div className="border-2 border-[#A6A6A6] rounded-full py-4 px-8 text-white text-[13px] md:text-base lg:text-[18px] font-bold tracking-widest uppercase bg-transparent flex items-center justify-center text-center whitespace-nowrap">
                GAGNE DE L'ARGENT
              </div>

              {/* Badge 2 : AIDE UN BOXEUR */}
              <div className="border-2 border-[#A6A6A6] rounded-full py-4 px-8 text-white text-[13px] md:text-base lg:text-[18px] font-bold tracking-widest uppercase bg-transparent flex items-center justify-center text-center whitespace-nowrap">
                AIDE UN BOXEUR
              </div>

              {/* Badge 3 : ÉVITE LE GASPILLAGE */}
              <div className="border-2 border-[#A6A6A6] rounded-full py-4 px-8 text-white text-[13px] md:text-base lg:text-[18px] font-bold tracking-widest uppercase bg-transparent flex items-center justify-center text-center whitespace-nowrap">
                ÉVITE LE GASPILLAGE
              </div>

              {/* Badge 4 : VENTE SIMPLE ET RAPIDE */}
              <div className="border-2 border-[#A6A6A6] rounded-full py-4 px-8 text-white text-[13px] md:text-base lg:text-[18px] font-bold tracking-widest uppercase bg-transparent flex items-center justify-center text-center whitespace-nowrap">
                VENTE SIMPLE ET RAPIDE
              </div>
            </div>
          </div>

          {/* Right Column: Button aligned to the bottom right */}
          <div className="flex items-center justify-end w-full md:w-auto md:pb-2">
            <button
              onClick={() => navigate("/sell")}
              className="bg-[#ff0000] hover:bg-[#cc0000] border-none text-white font-black text-lg md:text-xl lg:text-2xl uppercase tracking-widest rounded-full py-5 px-10 md:py-6 md:px-12 flex items-center gap-4 transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              REVENDRE
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
