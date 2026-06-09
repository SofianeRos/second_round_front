import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{
        background: "#0c0c0c",
        border: "1px solid #1a1a1a",
        borderRadius: "20px",
        padding: "3.5rem 2.5rem",
        width: "100%",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
      }}>
        {/* Cancel Icon */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "rgba(245,158,11,0.08)", border: "2px solid rgba(245,158,11,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
          PAIEMENT ANNULÉ
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.6", marginBottom: "2.5rem" }}>
          La transaction a été annulée. Aucun montant n'a été prélevé sur votre carte bancaire. Vous pouvez retourner à la messagerie pour poursuivre vos échanges.
        </p>

        <button
          onClick={() => navigate("/messages")}
          style={{
            width: "100%", background: "#ff0000", border: "none",
            borderRadius: "10px", padding: "15px", color: "#fff",
            fontWeight: "900", fontSize: "14px", textTransform: "uppercase",
            letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          Retourner à la messagerie
        </button>
      </div>
    </div>
  );
}
