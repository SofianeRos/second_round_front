import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        setArticles(response.data.member || response.data);
        setFilteredArticles(response.data.member || response.data);
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
            <div className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300">
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
      </section>

      {/* SECTION UN COUP DE POING ? */}
      <section
        className="w-full flex flex-col items-center justify-center py-72 md:py-96 relative"
        style={{
          backgroundColor: "#000000",
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)`,
        }}
      >
        {/* Title: full-width, hard left */}
        <div className="w-full px-8 md:px-16 mb-32 relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wide text-left">
            UN COUP DE POING ?
          </h2>
        </div>

        {/* Centered content block — cards + button */}
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col gap-16 relative z-10">
          {/* Cards: equal 3-column grid */}
          <div className="grid grid-cols-3 gap-8 md:gap-10 w-full">
            {/* Card 1: LES TAILLES */}
            <div
              onClick={() => navigate("/route-tailles")}
              className="bg-[#1a1a1a] rounded-3xl flex flex-col items-center justify-center p-10 md:p-14 hover:scale-105 hover:bg-[#222] transition-all duration-300 cursor-pointer aspect-square shadow-2xl group"
            >
              <svg
                width="180"
                height="180"
                viewBox="0 0 481 476"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mb-4 md:mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300"
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
              <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-1 uppercase tracking-wide text-center">
                LES TAILLES
              </h3>
              <p className="text-gray-400 text-[11px] md:text-xs lg:text-sm text-center font-light leading-snug">
                Trouver la bonne taille selon son corps.
              </p>
            </div>

            {/* Card 2: LES ÉQUIPEMENTS */}
            <div
              onClick={() => navigate("/route-equipements")}
              className="bg-[#1a1a1a] rounded-3xl flex flex-col items-center justify-center p-10 md:p-14 hover:scale-105 hover:bg-[#222] transition-all duration-300 cursor-pointer aspect-square shadow-2xl group"
            >
              <svg
                width="180"
                height="180"
                viewBox="0 0 481 476"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mb-4 md:mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300"
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
                    d="M290.831 53H292.476C305.321 53 315.754 63.4727 315.754 76.3747V214.629C315.754 227.527 305.325 238.004 292.476 238.004H290.831C277.986 238.004 267.553 227.531 267.553 214.629V76.3747C267.553 63.4763 277.982 53 290.831 53Z"
                    fill="#FF0000"
                  />
                  <path
                    d="M323.348 214.625V76.371C323.348 75.8554 323.334 75.3397 323.309 74.8277C325.099 74.2394 327.008 73.9163 328.993 73.9163C339.079 73.9163 347.281 82.152 347.281 92.2834V198.713C347.281 208.841 339.079 217.076 328.993 217.076C327.008 217.076 325.099 216.753 323.309 216.165C323.334 215.653 323.348 215.141 323.348 214.622V214.625Z"
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
              <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-1 uppercase tracking-wide text-center">
                LES ÉQUIPEMENTS
              </h3>
              <p className="text-gray-400 text-[11px] md:text-xs lg:text-sm text-center font-light leading-snug">
                Comprendre chaque équipement et à quoi il sert.
              </p>
            </div>

            {/* Card 3: BIEN DÉBUTER */}
            <div
              onClick={() => navigate("/route-debuter")}
              className="bg-[#1a1a1a] rounded-3xl flex flex-col items-center justify-center p-10 md:p-14 hover:scale-105 hover:bg-[#222] transition-all duration-300 cursor-pointer aspect-square shadow-2xl group"
            >
              <svg
                width="180"
                height="180"
                viewBox="0 0 481 476"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mb-4 md:mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300"
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
              <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-1 uppercase tracking-wide text-center">
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
              className="hover:opacity-80 hover:translate-x-1 transition-all duration-300 flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none text-[#ff0000] font-black text-xl md:text-2xl lg:text-3xl tracking-wider"
            >
              Voir les guides <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION NOTRE SÉLECTION ================= */}
      <section className="w-full bg-black py-72 md:py-96 flex flex-col items-center justify-center">
        {/* Title: full-width, hard left — même logique que UN COUP DE POING */}
        <div className="w-full px-8 md:px-16 mb-32">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wide text-left">
            NOTRE SELECTION
          </h2>
        </div>

        {/* Cards container — centré avec marges */}
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">
          <div
            className="flex flex-row gap-8 md:gap-10 lg:gap-12 w-full overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredArticles.slice(0, 5).map((item) => {
              return (
                <div
                  key={item.id}
                  className="min-w-[220px] md:min-w-[280px] lg:min-w-0 flex-1 flex flex-col cursor-pointer group"
                  onClick={() => navigate(`/articles/${item.id}`)}
                >
                  {/* Image placeholder — no image for now */}
                  <div className="w-full aspect-square bg-[#151515] relative mb-6 rounded-sm overflow-hidden flex items-center justify-center border border-white/5">
                    <div className="w-full h-full bg-[#1a1a1a]" />
                    {/* Badge Check inside top-right corner */}
                    <div className="absolute top-3 right-3 z-10 bg-black rounded-full w-9 h-9 flex items-center justify-center border border-white/20 shadow-md">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
                        <path d="M7 12L10.5 15.5L17.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {/* Heart inside bottom-right corner */}
                    <div className="absolute bottom-3 right-3 z-10 cursor-pointer hover:scale-110 transition-transform">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
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

          <div className="w-full border-b border-[#222] mt-40"></div>
        </div>
      </section>

      {/* ================= SECTION TON MATÉRIEL ================= */}
      <section className="w-full bg-black py-72 md:py-96 flex justify-center">
        <div className="w-full max-w-[1300px] px-8 flex flex-col">
          {/* Titre XXL */}
          <h2 className="text-[38px] lg:text-[64px] font-black text-white uppercase tracking-tight leading-[1.05] mb-32 text-left">
            TON MATÉRIEL PEUT
            <br />
            <span className="text-[#ff0000]">ENCORE</span> FAIRE DES
            <br />
            ROUNDS
          </h2>

          {/* Conteneur aligné en bas */}
          <div className="flex flex-row justify-between items-end w-full">
            {/* Grille des badges (SVG en fond + Texte superposé plus gros et en gras) */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 w-[65%]">
              {/* Badge 1 : GAGNE DE L'ARGENT */}
              <div className="relative flex items-center justify-center w-full">
                <svg
                  viewBox="0 0 408 92"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="405"
                    height="89"
                    rx="44.5"
                    stroke="#A6A6A6"
                    strokeWidth="3"
                  />
                </svg>
                <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                  GAGNE DE L'ARGENT
                </span>
              </div>

              {/* Badge 2 : AIDE UN BOXEUR */}
              <div className="relative flex items-center justify-center w-full">
                <svg
                  viewBox="0 0 351 92"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="348"
                    height="89"
                    rx="44.5"
                    stroke="#A6A6A6"
                    strokeWidth="3"
                  />
                </svg>
                <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                  AIDE UN BOXEUR
                </span>
              </div>

              {/* Badge 3 : ÉVITE LE GASPILLAGE */}
              <div className="relative flex items-center justify-center w-full">
                <svg
                  viewBox="0 0 428 92"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="425"
                    height="89"
                    rx="44.5"
                    stroke="#A6A6A6"
                    strokeWidth="3"
                  />
                </svg>
                <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                  ÉVITE LE GASPILLAGE
                </span>
              </div>

              {/* Badge 4 : VENTE SIMPLE ET RAPIDE */}
              <div className="relative flex items-center justify-center w-full">
                <svg
                  viewBox="0 0 475 92"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="472"
                    height="89"
                    rx="44.5"
                    stroke="#A6A6A6"
                    strokeWidth="3"
                  />
                </svg>
                <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                  VENTE SIMPLE ET RAPIDE
                </span>
              </div>
            </div>

            {/* Bouton Rouge (Fond transparent forcé pour tuer le carré blanc) */}
            <button
              onClick={() => {
                console.log("Redirection vers la page de revente");
                // navigate('/sell');
              }}
              className="bg-transparent border-none outline-none p-0 w-[28%] max-w-[286px] cursor-pointer hover:opacity-80 transition-opacity ml-auto"
            >
              <svg
                viewBox="0 0 286 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto block"
              >
                <rect
                  x="1.5"
                  y="1.5"
                  width="283"
                  height="89"
                  rx="44.5"
                  fill="#FF0000"
                  stroke="#FF0000"
                  strokeWidth="3"
                />
                <path
                  d="M257.414 47.4142C258.195 46.6332 258.195 45.3668 257.414 44.5858L244.686 31.8579C243.905 31.0768 242.639 31.0768 241.858 31.8579C241.077 32.6389 241.077 33.9052 241.858 34.6863L253.172 46L241.858 57.3137C241.077 58.0948 241.077 59.3611 241.858 60.1421C242.639 60.9232 243.905 60.9232 244.686 60.1421L257.414 47.4142ZM228 46V48H256V46V44H228V46Z"
                  fill="white"
                />
                <path
                  d="M37.7614 58V34.7273H47.375C49.1174 34.7273 50.6212 35.0417 51.8864 35.6705C53.1591 36.2917 54.1402 37.1856 54.8295 38.3523C55.5189 39.5114 55.8636 40.8864 55.8636 42.4773C55.8636 44.0909 55.5114 45.4621 54.8068 46.5909C54.1023 47.7121 53.1023 48.5682 51.8068 49.1591C50.5114 49.7424 48.9773 50.0341 47.2045 50.0341H41.125V45.6023H46.1591C47.0076 45.6023 47.7159 45.4924 48.2841 45.2727C48.8598 45.0455 49.2955 44.7045 49.5909 44.25C49.8864 43.7879 50.0341 43.197 50.0341 42.4773C50.0341 41.7576 49.8864 41.1629 49.5909 40.6932C49.2955 40.2159 48.8598 39.8598 48.2841 39.625C47.7083 39.3826 47 39.2614 46.1591 39.2614H43.3864V58H37.7614ZM50.8636 47.3636L56.6591 58H50.5227L44.8409 47.3636H50.8636ZM58.9489 58V34.7273H75.1761V39.2955H64.5739V44.0682H74.3466V48.6477H64.5739V53.4318H75.1761V58H58.9489ZM83.983 34.7273L89.1875 51.7727H89.3807L94.5852 34.7273H100.881L93.0284 58H85.5398L77.6875 34.7273H83.983ZM103.386 58V34.7273H119.614V39.2955H109.011V44.0682H118.784V48.6477H109.011V53.4318H119.614V58H103.386ZM142.943 34.7273V58H138.17L128.909 44.5682H128.761V58H123.136V34.7273H127.977L137.136 48.1364H137.33V34.7273H142.943ZM155.082 58H146.48V34.7273H155.071C157.442 34.7273 159.484 35.1932 161.196 36.125C162.916 37.0492 164.241 38.3826 165.173 40.125C166.105 41.8598 166.571 43.9356 166.571 46.3523C166.571 48.7765 166.105 50.8598 165.173 52.6023C164.249 54.3447 162.927 55.6818 161.207 56.6136C159.488 57.5379 157.446 58 155.082 58ZM152.105 53.2045H154.866C156.17 53.2045 157.272 52.9848 158.173 52.5455C159.082 52.0985 159.768 51.375 160.23 50.375C160.7 49.3674 160.935 48.0265 160.935 46.3523C160.935 44.678 160.7 43.3447 160.23 42.3523C159.76 41.3523 159.067 40.6326 158.151 40.1932C157.241 39.7462 156.12 39.5227 154.787 39.5227H152.105V53.2045ZM169.855 58V34.7273H179.469C181.211 34.7273 182.715 35.0417 183.98 35.6705C185.253 36.2917 186.234 37.1856 186.923 38.3523C187.613 39.5114 187.957 40.8864 187.957 42.4773C187.957 44.0909 187.605 45.4621 186.901 46.5909C186.196 47.7121 185.196 48.5682 183.901 49.1591C182.605 49.7424 181.071 50.0341 179.298 50.0341H173.219V45.6023H178.253C179.101 45.6023 179.81 45.4924 180.378 45.2727C180.954 45.0455 181.389 44.7045 181.685 44.25C181.98 43.7879 182.128 43.197 182.128 42.4773C182.128 41.7576 181.98 41.1629 181.685 40.6932C181.389 40.2159 180.954 39.8598 180.378 39.625C179.802 39.3826 179.094 39.2614 178.253 39.2614H175.48V58H169.855ZM182.957 47.3636L188.753 58H182.616L176.935 47.3636H182.957ZM191.043 58V34.7273H207.27V39.2955H196.668V44.0682H206.44V48.6477H196.668V53.4318H207.27V58H191.043Z"
                  fill="#E9E9E9"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
