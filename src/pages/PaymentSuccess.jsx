import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const articleId = searchParams.get("article_id");
  
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  // New shipping address form states
  const [article, setArticle] = useState(null);
  const [adresse, setAdresse] = useState("");
  const [cp, setCp] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("France");
  const [sendingAddress, setSendingAddress] = useState(false);
  const [addressSent, setAddressSent] = useState(false);
  const [addressError, setAddressError] = useState("");

  const confirmedRef = useRef(false);

  // Fetch article details to get seller information
  useEffect(() => {
    if (!articleId) return;
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${articleId}`);
        setArticle(response.data);
      } catch (err) {
        console.error("Erreur chargement article:", err);
      }
    };
    fetchArticle();
  }, [articleId]);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError("Session de paiement invalide.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.post("/payment/confirm", {
          session_id: sessionId,
        });

        if (response.data.success) {
          setOrderId(response.data.orderId);
        } else {
          setError(response.data.error || "Impossible de confirmer le paiement.");
        }
      } catch (err) {
        console.error("Payment confirmation error", err);
        setError(err.response?.data?.error || "Une erreur est survenue lors de la confirmation du paiement.");
      } finally {
        setLoading(false);
      }
    };

    if (!confirmedRef.current) {
      confirmedRef.current = true;
      confirmPayment();
    }
  }, [sessionId]);

  const handleSendAddress = async (e) => {
    e.preventDefault();
    setAddressError("");

    if (!adresse.trim()) {
      setAddressError("Veuillez saisir l'adresse de livraison.");
      return;
    }
    if (!cp.trim()) {
      setAddressError("Veuillez saisir le code postal.");
      return;
    }
    if (!ville.trim()) {
      setAddressError("Veuillez saisir la ville.");
      return;
    }
    if (!pays.trim()) {
      setAddressError("Veuillez saisir le pays.");
      return;
    }
    if (!article || !article.vendeur) {
      setAddressError("Données du vendeur introuvables. Impossible de transmettre l'adresse.");
      return;
    }

    setSendingAddress(true);
    try {
      // Send the address as a message in the chat
      await api.post("/messageries", {
        contenu: `📦 Adresse de livraison pour mon achat (article : ${article.marque || "Article"}) :\n${adresse.trim()}\n${cp.trim()} ${ville.trim()}\n${pays.trim()}`,
        estOffre: false,
        destinataire: `/api/users/${article.vendeur.id}`,
        article: `/api/articles/${article.id}`,
      });
      setAddressSent(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'adresse:", err);
      setAddressError(err.response?.data?.error || "Une erreur est survenue lors de la transmission de l'adresse.");
    } finally {
      setSendingAddress(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .success-checkmark {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .success-checkmark path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.5s 0.35s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .fade-in-el {
          opacity: 0;
          animation: fadeIn 0.4s 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

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
        {loading ? (
          <div style={{ padding: "2rem 0" }}>
            <div style={{
              width: "48px",
              height: "48px",
              border: "3px solid rgba(255,255,255,0.05)",
              borderTopColor: "#ff0000",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1.5rem"
            }} />
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Validation du paiement...
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "8px" }}>
              Veuillez patienter pendant que nous confirmons la transaction avec Stripe.
            </p>
          </div>
        ) : error ? (
          <div>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem"
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              Échec de validation
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.6", marginBottom: "2rem" }}>
              {error}
            </p>
            <button
              onClick={() => navigate("/messages")}
              style={{
                width: "100%", background: "transparent", border: "1.5px solid #333",
                borderRadius: "10px", padding: "14px", color: "#fff",
                fontWeight: "800", fontSize: "14px", textTransform: "uppercase",
                letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#666"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
            >
              Retourner à la messagerie
            </button>
          </div>
        ) : (
          <div>
            {/* Animated Checkmark Icon */}
            <div style={{
              width: "76px", height: "76px", borderRadius: "50%",
              background: "rgba(16,185,129,0.08)", border: "2.5px solid rgba(16,185,129,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.75rem"
            }} className="success-checkmark">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h2 style={{ fontSize: "1.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }} className="fade-in-el">
              PAIEMENT CONFIRMÉ !
            </h2>
            <p style={{ color: "#10b981", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2rem" }} className="fade-in-el">
              Votre commande est enregistrée
            </p>

            <div style={{
              background: "#121212", border: "1px solid #1c1c1c",
              borderRadius: "12px", padding: "1.25rem 1.5rem",
              textAlign: "left", marginBottom: "1.5rem"
            }} className="fade-in-el">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Référence Commande :</span>
                <span style={{ fontWeight: "700" }}>#{orderId || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Statut de livraison :</span>
                <span style={{ color: "#f59e0b", fontWeight: "700" }}>En attente</span>
              </div>
            </div>

            {/* Formulaire d'adresse de livraison */}
            <div style={{
              background: "#121212",
              border: addressSent ? "1.5px solid rgba(16, 185, 129, 0.3)" : "1px solid #1c1c1c",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "left",
              marginBottom: "2.5rem"
            }} className="fade-in-el">
              {addressSent ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center", textAlign: "center", padding: "0.5rem 0" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: "900", color: "#10b981", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Adresse Transmise !
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                    Votre adresse de livraison a été envoyée par message au vendeur.
                  </p>
                  <div style={{
                    marginTop: "1rem",
                    padding: "12px 14px",
                    background: "#080808",
                    border: "1px solid #1c1c1c",
                    borderRadius: "8px",
                    width: "100%",
                    fontSize: "13px",
                    color: "#fff",
                    textAlign: "left",
                    lineHeight: "1.5"
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", display: "block", fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Adresse envoyée :</span>
                    <strong>{adresse}</strong><br />
                    {cp} {ville}, {pays}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendAddress} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Adresse de livraison
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12.5px", margin: 0, lineHeight: "1.5" }}>
                    Saisissez vos coordonnées ci-dessous pour transmettre automatiquement l'adresse de livraison au vendeur :
                  </p>

                  {addressError && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", padding: "10px 12px", fontSize: "12.5px", color: "#ef4444", fontWeight: "700" }}>
                      ⚠ {addressError}
                    </div>
                  )}

                  {/* Street address */}
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", marginBottom: "5px" }}>
                      Adresse postale
                    </label>
                    <input
                      type="text"
                      placeholder="Ex. 15 Rue de la Paix"
                      value={adresse}
                      onChange={e => setAdresse(e.target.value)}
                      disabled={sendingAddress}
                      style={{
                        width: "100%", background: "#161616", border: "1.5px solid #222", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13.5px", outline: "none", transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = "#ff0000"}
                      onBlur={e => e.target.style.borderColor = "#222"}
                    />
                  </div>

                  {/* ZIP & City */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", marginBottom: "5px" }}>
                        Code Postal
                      </label>
                      <input
                        type="text"
                        placeholder="75002"
                        value={cp}
                        onChange={e => setCp(e.target.value)}
                        disabled={sendingAddress}
                        style={{
                          width: "100%", background: "#161616", border: "1.5px solid #222", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13.5px", outline: "none", textAlign: "center", transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#ff0000"}
                        onBlur={e => e.target.style.borderColor = "#222"}
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", marginBottom: "5px" }}>
                        Ville
                      </label>
                      <input
                        type="text"
                        placeholder="Paris"
                        value={ville}
                        onChange={e => setVille(e.target.value)}
                        disabled={sendingAddress}
                        style={{
                          width: "100%", background: "#161616", border: "1.5px solid #222", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13.5px", outline: "none", transition: "border-color 0.2s"
                        }}
                        onFocus={e => e.target.style.borderColor = "#ff0000"}
                        onBlur={e => e.target.style.borderColor = "#222"}
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", marginBottom: "5px" }}>
                      Pays
                    </label>
                    <input
                      type="text"
                      placeholder="France"
                      value={pays}
                      onChange={e => setPays(e.target.value)}
                      disabled={sendingAddress}
                      style={{
                        width: "100%", background: "#161616", border: "1.5px solid #222", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13.5px", outline: "none", transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = "#ff0000"}
                      onBlur={e => e.target.style.borderColor = "#222"}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={sendingAddress}
                    style={{
                      width: "100%",
                      background: "#fff",
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px",
                      fontWeight: "900",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: sendingAddress ? "not-allowed" : "pointer",
                      marginTop: "0.5rem",
                      transition: "opacity 0.2s"
                    }}
                    onMouseEnter={e => { if (!sendingAddress) e.currentTarget.style.opacity = 0.9; }}
                    onMouseLeave={e => { if (!sendingAddress) e.currentTarget.style.opacity = 1; }}
                  >
                    {sendingAddress ? "Transmission..." : "Transmettre au vendeur"}
                  </button>
                </form>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="fade-in-el">
              <button
                onClick={() => navigate(`/messages?article=${articleId}`)}
                style={{
                  width: "100%", background: "#ff0000", border: "none",
                  borderRadius: "10px", padding: "15px", color: "#fff",
                  fontWeight: "900", fontSize: "14px", textTransform: "uppercase",
                  letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                Retourner au chat messagerie
              </button>
              <button
                onClick={() => navigate("/profile")}
                style={{
                  width: "100%", background: "transparent", border: "1.5px solid #222",
                  borderRadius: "10px", padding: "14px", color: "rgba(255,255,255,0.6)",
                  fontWeight: "800", fontSize: "13px", textTransform: "uppercase",
                  letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                Voir Mon Vestiaire
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
