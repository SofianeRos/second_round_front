import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PaymentMockCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const articleId = searchParams.get("article_id");
  const initialPrice = searchParams.get("prix");

  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch article details
  useEffect(() => {
    if (!articleId) {
      setLoadingArticle(false);
      return;
    }
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${articleId}`);
        setArticle(response.data);
      } catch (err) {
        console.error("Erreur de récupération de l'article:", err);
      } finally {
        setLoadingArticle(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  // Card formatting handlers
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length > 16) value = value.slice(0, 16);
    // Add space every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvc(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const rawCardNumber = cardNumber.replace(/\s/g, "");
    if (rawCardNumber.length !== 16) {
      setErrorMessage("Le numéro de carte doit comporter 16 chiffres.");
      return;
    }

    if (cardExpiry.length !== 5) {
      setErrorMessage("La date d'expiration doit être au format MM/AA.");
      return;
    }

    const [month, year] = cardExpiry.split("/");
    const m = parseInt(month, 10);
    if (m < 1 || m > 12) {
      setErrorMessage("Le mois d'expiration est invalide.");
      return;
    }

    if (cardCvc.length !== 3) {
      setErrorMessage("Le code CVC doit comporter 3 chiffres.");
      return;
    }

    if (!cardName.trim()) {
      setErrorMessage("Veuillez saisir le nom du titulaire de la carte.");
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to the success url with the session ID
      navigate(`/payment/success?session_id=${sessionId}&article_id=${articleId}`);
    }, 2000);
  };

  const formattedPrice = article ? parseFloat(article.prix) : parseFloat(initialPrice || "0");
  const displayPrice = initialPrice ? parseFloat(initialPrice) : formattedPrice;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      color: "#fff",
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      fontFamily: "'Outfit', 'Inter', sans-serif",
    }}>
      <style>{`
        @keyframes rotate { 100% { transform: rotate(360deg); } }
        @keyframes dash { 
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
        .spinner {
          animation: rotate 2s linear infinite;
        }
        .spinner .path {
          stroke: #ff0000;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }
        .card-input:focus {
          border-color: #ff0000 !important;
          box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
        }
      `}</style>

      {/* Main Container */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: "1100px",
        margin: "auto",
        padding: "2rem",
        gap: "4rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}>

        {/* Left Side: Order Summary */}
        <div style={{
          flex: "1 1 450px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}>
          {/* Header Link */}
          <button
            onClick={() => navigate("/messages")}
            style={{
              alignSelf: "flex-start",
              background: "transparent",
              border: "none",
              color: "#aaa",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0",
              marginBottom: "1rem",
              transition: "color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Retourner aux messages
          </button>

          {/* Site name */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", background: "#ff0000", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontWeight: "900", letterSpacing: "0.1em" }}>TEST MODE</span>
            <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "0.05em", color: "#fff" }}>SECOND ROUND</span>
          </div>

          {/* Pricing */}
          <div>
            <span style={{ fontSize: "16px", color: "#888", fontWeight: "600" }}>Payer Second Round</span>
            <h1 style={{ fontSize: "44px", fontWeight: "900", margin: "8px 0 0 0", color: "#fff" }}>
              {displayPrice.toFixed(2)} €
            </h1>
          </div>

          {/* Article detail card */}
          {loadingArticle ? (
            <div style={{ color: "#666", padding: "1rem 0" }}>Chargement du récapitulatif de commande...</div>
          ) : article ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              background: "#0c0c0c",
              border: "1px solid #1a1a1a",
              padding: "1.25rem",
              borderRadius: "14px",
            }}>
              {/* Image */}
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "8px",
                background: "#161616",
                overflow: "hidden",
                border: "1px solid #222",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {article.photos?.length > 0 ? (
                  <img
                    src={`${API_URL}${article.photos[0].cheminFichier || article.photos[0].url}`}
                    alt={article.marque}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", textTransform: "uppercase", margin: "0 0 4px 0", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {article.marque || "Article"}
                </h3>
                <p style={{ fontSize: "13px", color: "#888", margin: "0 0 4px 0" }}>
                  Taille : {article.taille || "N/A"} · État : {article.etat || "N/A"}
                </p>
                <p style={{ fontSize: "12px", color: "#666", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  Catégorie : {article.categorie || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ color: "#ef4444", fontWeight: "600" }}>Impossible de charger le produit.</div>
          )}

          {/* Trust information */}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", color: "#666", fontSize: "13px", lineHeight: "1.5" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: "2px" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>
                <strong>Simulateur Stripe de test</strong><br />
                Il s'agit d'un environnement de test sécurisé. Aucune transaction bancaire réelle ne sera effectuée.
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Card Form */}
        <div style={{
          flex: "1 1 450px",
          background: "#0c0c0c",
          border: "1px solid #1a1a1a",
          borderRadius: "20px",
          padding: "2.5rem",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Overlay loading */}
          {isProcessing && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(12,12,12,0.9)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem"
            }}>
              <svg className="spinner" width="50" height="50" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
              </svg>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "800", fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>Traitement sécurisé...</p>
                <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>Veuillez patienter pendant la validation de la carte bancaire.</p>
              </div>
            </div>
          )}

          <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Informations de paiement
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Alert banner with Stripe test card */}
            <div style={{
              background: "rgba(255, 0, 0, 0.05)",
              border: "1px solid rgba(255, 0, 0, 0.15)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "12.5px",
              color: "#aaa",
              lineHeight: "1.5"
            }}>
              💡 Carte de test recommandée : <strong style={{ color: "#fff", letterSpacing: "0.05em" }}>4242 4242 4242 4242</strong> (toutes autres entrées de test à 16 chiffres sont également acceptées).
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#ef4444",
                fontWeight: "700"
              }}>
                ⚠ {errorMessage}
              </div>
            )}

            {/* Cardholder name */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", marginBottom: "6px" }}>
                Nom sur la carte
              </label>
              <input
                type="text"
                placeholder="Ex. Jane Doe"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="card-input"
                style={{
                  width: "100%",
                  background: "#141414",
                  border: "1.5px solid #222",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              />
            </div>

            {/* Card number */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", marginBottom: "6px" }}>
                Numéro de carte
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="card-input"
                  style={{
                    width: "100%",
                    background: "#141414",
                    border: "1.5px solid #222",
                    borderRadius: "8px",
                    padding: "12px 14px 12px 42px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                    letterSpacing: "0.05em",
                  }}
                />
                {/* Lock or Card icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            {/* Expiry & CVC */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", marginBottom: "6px" }}>
                  Expiration
                </label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  className="card-input"
                  style={{
                    width: "100%",
                    background: "#141414",
                    border: "1.5px solid #222",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", marginBottom: "6px" }}>
                  Code CVC / CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cardCvc}
                  onChange={handleCvcChange}
                  className="card-input"
                  style={{
                    width: "100%",
                    background: "#141414",
                    border: "1.5px solid #222",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#ff0000",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "15px",
                fontWeight: "900",
                fontSize: "15px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                marginTop: "1rem",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              Payer {displayPrice.toFixed(2)} €
            </button>
          </form>

          {/* Footer security badges */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginTop: "1.5rem",
            color: "#444",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Sécurisé</span>
            </div>
            <span>·</span>
            <span>Simulateur Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
