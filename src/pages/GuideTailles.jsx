import { useNavigate } from "react-router-dom";

const GANT_HOMME = "http://localhost:8000/images/gant_homme.png";
const GANT_FEMME = "http://localhost:8000/images/gant_femme.png";

const HOMME_DATA = [
  { poids: "< 50", entrainement: "8 oz", sparring: "10 oz" },
  { poids: "51 - 63", entrainement: "10 oz", sparring: "12 oz" },
  { poids: "64 - 74", entrainement: "12 oz", sparring: "14 oz" },
  { poids: "75 - 90", entrainement: "14 oz", sparring: "16 oz" },
  { poids: "> 90", entrainement: "16 oz", sparring: "16 oz" },
];

const FEMME_DATA = [
  { poids: "< 45", entrainement: "8 oz", sparring: "10 oz" },
  { poids: "45 - 50", entrainement: "10 oz", sparring: "12 oz" },
  { poids: "50 - 60", entrainement: "12 oz", sparring: "14 oz" },
  { poids: "60 - 70", entrainement: "14 oz", sparring: "16 oz" },
  { poids: "> 70", entrainement: "16 oz", sparring: "16 oz" },
];

const STRIPE_BG = {
  background: "#111",
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.04) 18px, rgba(255,255,255,0.04) 36px)",
};

function SizeTable({ data }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#1a1a1a", borderBottom: "2px solid #333" }}>
          <th style={{ color: "#fff", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 20px", textAlign: "left" }}>
            POIDS (en KG)
          </th>
          <th style={{ color: "#fff", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 20px", textAlign: "center" }}>
            ENTRAINEMENT
          </th>
          <th style={{ color: "#fff", fontWeight: 900, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 20px", textAlign: "center" }}>
            SPARRING
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #2a2a2a" }}>
            <td style={{ color: "#fff", fontSize: "15px", padding: "13px 20px" }}>{row.poids}</td>
            <td style={{ color: "#fff", fontSize: "15px", padding: "13px 20px", textAlign: "center" }}>{row.entrainement}</td>
            <td style={{ color: "#fff", fontSize: "15px", padding: "13px 20px", textAlign: "center" }}>{row.sparring}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function GuideTailles() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>

      {/* ── HERO HEADER ── */}
      <section style={{ ...STRIPE_BG, width: "100%", padding: "100px 0" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px" }}>

          {/* Flèche + Titre sur même ligne */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "12px" }}>
            <button
              onClick={() => navigate("/guides")}
              style={{ background: "none", border: "none", outline: "none", cursor: "pointer", color: "#fff", flexShrink: 0, padding: 0, display: "flex", alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ff0000"}
              onMouseLeave={e => e.currentTarget.style.color = "#fff"}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
              GUIDE DES TAILLES
            </h1>
          </div>

          {/* Sous-titre */}
          <p style={{ color: "#a0a0a0", fontSize: "17px", fontWeight: 300, marginBottom: "32px", paddingLeft: "60px" }}>
            Trouver la bonne taille selon son corps
          </p>

          {/* Badge GANTS rouge */}
          <div style={{ paddingLeft: "60px" }}>
            <span style={{
              display: "inline-block",
              background: "#ff0000",
              color: "#fff",
              fontWeight: 900,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              padding: "10px 24px",
            }}>
              GANTS
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION HOMME ── */}
      <section style={{ ...STRIPE_BG, width: "100%", padding: "80px 0", borderTop: "1px solid #222" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "60px", alignItems: "flex-start" }}>

          {/* Tableau HOMME */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2.5rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "32px" }}>
              HOMME
            </h2>
            <SizeTable data={HOMME_DATA} />
          </div>

          {/* Image gant HOMME */}
          <div style={{ flexShrink: 0, width: "260px", borderRadius: "4px", overflow: "hidden" }}>
            <img
              src={GANT_HOMME}
              alt="Gant de boxe homme"
              style={{ width: "100%", height: "280px", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION FEMME ── */}
      <section style={{ ...STRIPE_BG, width: "100%", padding: "80px 0", borderTop: "1px solid #222" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px", display: "flex", flexDirection: "row-reverse", gap: "60px", alignItems: "flex-start" }}>

          {/* Tableau FEMME */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2.5rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "32px", textAlign: "right" }}>
              FEMME
            </h2>
            <SizeTable data={FEMME_DATA} />
          </div>

          {/* Image gant FEMME */}
          <div style={{ flexShrink: 0, width: "260px", borderRadius: "4px", overflow: "hidden" }}>
            <img
              src={GANT_FEMME}
              alt="Gant de boxe femme"
              style={{ width: "100%", height: "280px", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
