import { useNavigate } from "react-router-dom";

const ALI_IMAGE = "http://localhost:8000/images/muhammad_ali.png";

const GUIDES = [
  {
    id: "tailles",
    title: "GUIDE DES TAILLES",
    clickable: true,
  },
  {
    id: "equipements",
    title: "GUIDE DES ÉQUIPEMENTS",
    clickable: false,
  },
  {
    id: "demarrer",
    title: "GUIDE DÉMARRER LA BOXE",
    clickable: false,
  },
];

export default function Guides() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">

      {/* ── HERO HEADER ── */}
      <section
        className="w-full flex flex-col justify-center px-8 md:px-16"
        style={{
          background: "linear-gradient(180deg, #1a1a1a 0%, #111 100%)",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.025) 20px, rgba(255,255,255,0.025) 40px)",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        {/* Back arrow + Title on same row — comme la maquette Figma */}
        <div className="flex items-center gap-6 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 text-white hover:text-[#ff0000] transition-colors duration-200 bg-transparent border-none outline-none cursor-pointer"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            UN COUP DE POING ?
          </h1>
        </div>
        <p className="text-[#a0a0a0] text-base md:text-lg font-light" style={{ paddingLeft: "60px" }}>
          Des guides pour mieux comprendre la boxe et ses équipements.
        </p>
      </section>

      {/* ── GUIDE LIST ── */}
      <section
        className="w-full flex flex-col"
        style={{
          background: "#111",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.04) 18px, rgba(255,255,255,0.04) 36px)",
        }}
      >
        {GUIDES.map((guide) => {
          const isClickable = guide.clickable;
          return (
            <div
              key={guide.id}
              onClick={isClickable ? () => navigate(`/guides/${guide.id}`) : undefined}
              className={`w-full group ${
                isClickable
                  ? "cursor-pointer"
                  : "cursor-default opacity-50"
              }`}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className={`w-full px-8 md:px-16 flex items-center justify-between py-16 md:py-20 transition-colors duration-200 ${
                  isClickable ? "hover:bg-white/5" : ""
                }`}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-tight">
                  {guide.title}
                </h2>
                <div className="flex-shrink-0 ml-8">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={isClickable ? "group-hover:translate-x-2 transition-transform duration-200" : ""}
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="#ff0000"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── MUHAMMAD ALI QUOTE BANNER ── */}
      <section
        className="w-full relative flex items-center justify-start overflow-hidden"
        style={{ minHeight: "600px" }}
      >
        {/* BG Image — centré sur Ali, recadré pour bien voir le boxeur */}
        <img
          src={ALI_IMAGE}
          alt="Muhammad Ali"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "brightness(0.6)",
            objectPosition: "center 20%",
          }}
        />

        {/* Gradient overlay — left side dark for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/* Quote content */}
        <div className="relative z-10 px-8 md:px-16 py-16 max-w-[640px]">
          <blockquote
            className="text-white font-black uppercase leading-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.1 }}
          >
            J'AI DÉTESTÉ CHAQUE MINUTE D'ENTRAÎNEMENT,{" "}
            <span style={{ color: "#ff0000" }}>
              MAIS JE N'AI JAMAIS ABANDONNÉ.
            </span>
          </blockquote>
          <p className="text-white font-bold uppercase tracking-widest mt-8 text-base md:text-lg">
            MUHAMMAD ALI
          </p>
        </div>
      </section>
    </div>
  );
}
