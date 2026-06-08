import { useNavigate } from "react-router-dom";
import etape1 from "../assets/etape1.png";
import etape2 from "../assets/etape2.png";
import etape3 from "../assets/etape3.png";
import etape4 from "../assets/etape4.png";

export default function SellLanding() {
  const navigate = useNavigate();

  const steps = [
    {
      num: "1",
      name: "LA GARDE",
      title: "Choisis ton équipement",
      desc: "Gants, casque, vêtements, sac...",
      Boxer: etape1,
      align: "left",
    },
    {
      num: "2",
      name: "GAUCHE",
      title: "Décris son état",
      desc: "Taille, usage, état général.",
      Boxer: etape2,
      align: "left",
    },
    {
      num: "3",
      name: "DROITE",
      title: "Ajoute des photos",
      desc: "Pour rassurer l'acheteur.",
      Boxer: etape3,
      align: "right",
    },
    {
      num: "4",
      name: "UPERCUT",
      title: "Mets en ligne",
      desc: "Ton équipement est visible immédiatement.",
      Boxer: etape4,
      align: "right",
    },
  ];

  return (
    <div className="sell-root">

      {/* ── SECTION 1 : HERO ──────────────────────────────────────────────── */}
      <section className="sell-hero">
        <div className="sell-hero-inner">
          <button className="sell-back-btn" onClick={() => navigate(-1)} aria-label="Retour">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="sell-hero-content">
            <h1 className="sell-hero-title">
              TON MATÉRIEL PEUT<br />
              <span className="sell-hero-red">ENCORE</span> FAIRE DES<br />
              ROUNDS
            </h1>
            <p className="sell-hero-sub">Donne une seconde vie à ton équipement !</p>
            <button className="sell-cta-btn" onClick={() => navigate("/sell/form")}>
              COMMENCER LA REVENTE
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 10 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : AVANTAGES ─────────────────────────────────────────── */}
      <section className="sell-benefits">
        <div className="sell-benefits-inner">
          <div className="sell-benefit-card">
            <h3 className="sell-benefit-title">GAGNE DE L'ARGENT</h3>
            <p className="sell-benefit-desc">Ton ancien matériel devient un nouveau budget.</p>
          </div>
          <div className="sell-benefit-divider" />
          <div className="sell-benefit-card">
            <h3 className="sell-benefit-title">AIDE</h3>
            <p className="sell-benefit-desc">Un boxeur peut s'équiper à moindre coût.</p>
          </div>
          <div className="sell-benefit-divider" />
          <div className="sell-benefit-card">
            <h3 className="sell-benefit-title">ÉVITE LE GASPILLAGE</h3>
            <p className="sell-benefit-desc">Moins de déchets, plus d'impact.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : LEÇON DE TECHNIQUE ───────────────────────────────── */}
      <section className="sell-steps">
        <div className="sell-steps-inner">
          <h2 className="sell-steps-title">LEÇON DE TECHNIQUE</h2>

          <div className="sell-steps-list">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`sell-step-row${step.align === "right" ? " reversed" : ""}`}
              >
                {/* Boxer illustration */}
                <div className="sell-step-boxer-wrap">
                  <img src={step.Boxer} alt={step.name} className="sell-boxer-img" />
                </div>

                {/* Texte */}
                <div className={`sell-step-text${step.align === "right" ? " right" : ""}`}>
                  <p className="sell-step-label">
                    ÉTAPE {step.num} : <strong>{step.name}</strong>
                  </p>
                  <p className="sell-step-head">{step.title}</p>
                  <p className="sell-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 : CTA FINAL ─────────────────────────────────────────── */}
      <section className="sell-final">
        <div className="sell-final-inner">
          <p className="sell-final-tagline">
            UN ENCHAÎNEMENT FACILE, SIMPLE ET EFFICACE.
          </p>
          <button className="sell-cta-btn" onClick={() => navigate("/sell/form")}>
            COMMENCER LA REVENTE
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 10 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}
