import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carousel and visuals
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Lists
  const [dressing, setDressing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  // CTAs
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    // Reset page index on id change
    setActiveIndex(0);
    setIsFavorite(localStorage.getItem(`fav_art_${id}`) === "true");

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/articles/${id}`);
        const artData = response.data;
        setArticle(artData);

        // Fetch seller's other articles
        if (artData?.vendeur?.id) {
          try {
            const dressingRes = await api.get(`/articles?vendeur.id=${artData.vendeur.id}`);
            const dressingMember = dressingRes.data['hydra:member'] || dressingRes.data.member || dressingRes.data || [];
            // Exclude current article
            setDressing(dressingMember.filter(item => item.id !== artData.id));
          } catch (err) {
            console.error("Failed to load seller dressing", err);
          }

          // Fetch evaluations of the seller
          try {
            const evalsRes = await api.get('/evaluations');
            const allEvals = evalsRes.data['hydra:member'] || evalsRes.data.member || evalsRes.data || [];
            const sellerEvals = allEvals.filter(e => {
              const sellerId = typeof e.userCible === 'string' 
                ? parseInt(e.userCible.split('/').pop()) 
                : e.userCible?.id;
              return sellerId === artData.vendeur.id;
            });
            setEvaluations(sellerEvals);
          } catch (err) {
            console.error("Failed to load seller evaluations", err);
          }
        }

        // Fetch suggestions of same category
        if (artData?.categorie) {
          try {
            const suggestionsRes = await api.get(`/articles?categorie=${encodeURIComponent(artData.categorie)}`);
            const sugMember = suggestionsRes.data['hydra:member'] || suggestionsRes.data.member || suggestionsRes.data || [];
            // Exclude current article
            setSuggestions(sugMember.filter(item => item.id !== artData.id).slice(0, 4));
          } catch (err) {
            console.error("Failed to load suggestions", err);
          }
        }

      } catch (err) {
        setError("Article non trouvé");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const toggleFavorite = () => {
    const nextVal = !isFavorite;
    setIsFavorite(nextVal);
    localStorage.setItem(`fav_art_${id}`, nextVal ? "true" : "false");
  };

  const handleSendMessage = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setSubmittingMessage(true);
    try {
      await api.post('/messageries', {
        contenu: `Bonjour ! Je suis intéressé(e) par votre article : ${article.categorie} ${article.marque}. Est-il toujours disponible ?`,
        estOffre: false,
        destinataire: `/api/users/${article.vendeur.id}`,
        article: `/api/articles/${article.id}`,
      });
      navigate(`/messages?user=${article.vendeur.id}&article=${article.id}`);
    } catch (err) {
      console.error("Error initiating conversation", err);
      alert("Une erreur est survenue lors du démarrage de la discussion.");
    } finally {
      setSubmittingMessage(false);
    }
  };

  const handleSendOfferSubmit = async (e) => {
    e.preventDefault();
    const val = parseFloat(offerAmount);
    if (isNaN(val) || val <= 0) return;

    setOfferLoading(true);
    try {
      await api.post('/messageries', {
        contenu: `Bonjour ! Je vous propose une offre à ${val} € pour votre article : ${article.categorie} ${article.marque}.`,
        estOffre: true,
        montantOffre: val.toString(),
        destinataire: `/api/users/${article.vendeur.id}`,
        article: `/api/articles/${article.id}`,
      });
      setShowOfferModal(false);
      setOfferAmount("");
      navigate(`/messages?user=${article.vendeur.id}&article=${article.id}`);
    } catch (err) {
      console.error("Error sending offer", err);
      alert("Une erreur est survenue lors de l'envoi de l'offre.");
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-root flex justify-center items-center">
        <div className="catalogue-spinner"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="product-detail-root flex justify-center items-center flex-col gap-4">
        <p className="text-red-500 text-xl font-bold">{error || "Article non trouvé"}</p>
        <button onClick={() => navigate("/")} className="catalogue-empty-reset">Retour à l'accueil</button>
      </div>
    );
  }

  // Fallback photos array
  const getPhotos = () => {
    if (article.photos && article.photos.length > 0) {
      return article.photos.map(p => `http://localhost:8000/images/photos/${p.nomFichier}`);
    }
    return [];
  };

  const photos = getPhotos();

  const handleNextPhoto = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getColor = () => {
    const desc = (article.description || "").toLowerCase();
    if (article.id === 1 || article.marque === "Venum") {
      return "Noir & Gold";
    }
    if (desc.includes("rouge")) return "Rouge";
    if (desc.includes("bleu")) return "Bleu";
    if (desc.includes("noir")) return "Noir";
    return "Unique";
  };

  const getDressingCardPhoto = (item) => {
    if (item.photos && item.photos.length > 0) {
      return `http://localhost:8000/images/photos/${item.photos[0].nomFichier}`;
    }
    return null;
  };

  const getSellerRating = () => {
    if (evaluations.length > 0) {
      const avg = evaluations.reduce((acc, curr) => acc + curr.note, 0) / evaluations.length;
      return {
        rating: Math.round(avg),
        count: evaluations.length
      };
    }
    // Mock user rating stable seed
    const sId = article?.vendeur?.id || 1;
    const seed = sId * 3;
    const rating = 3 + (seed % 3); // 3, 4, or 5
    const count = 3 + (seed % 7); // 3 to 9
    return { rating, count };
  };

  const sellerRating = getSellerRating();

  return (
    <div className="product-detail-root">
      <div className="product-detail-inner">
        
        {/* Layout Grid */}
        <div className="product-detail-layout">
          
          {/* COLUMN LEFT */}
          <div className="product-left-col">
            
            {/* Gallery Section */}
            <div className="product-gallery-container">
              <button onClick={() => navigate(-1)} className="product-back-btn" aria-label="Retour">
                &lt;
              </button>

              <div className="product-image-carousel">
                {photos.length > 0 ? (
                  <img 
                    src={photos[activeIndex]} 
                    alt={`${article.marque} ${article.categorie}`} 
                    className="product-carousel-img"
                  />
                ) : (
                  <div className="catalogue-card-img-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                )}

                {photos.length > 1 && (
                  <>
                    <button onClick={handlePrevPhoto} className="product-carousel-arrow left">
                      &larr;
                    </button>
                    <button onClick={handleNextPhoto} className="product-carousel-arrow right">
                      &rarr;
                    </button>
                    <div className="product-carousel-dots">
                      {photos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIndex(idx)}
                          className={`product-carousel-dot${idx === activeIndex ? " active" : ""}`}
                          aria-label={`Image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button 
                  onClick={toggleFavorite}
                  className="product-gallery-heart" 
                  aria-label="Ajouter aux favoris"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorite ? "#ff0000" : "none"} stroke={isFavorite ? "#ff0000" : "#ffffff"} strokeWidth="1.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Seller Dressing */}
            <div className="dressing-section-container">
              <h3 className="dressing-section-title">Dressing du membre</h3>
              
              {dressing.length === 0 ? (
                <p className="text-gray-500 italic">Aucun autre article en vente pour ce membre.</p>
              ) : (
                <div className="dressing-grid-horizontal">
                  {dressing.map((item) => (
                    <div 
                      key={item.id} 
                      className="catalogue-card dressing-horizontal-card"
                      onClick={() => navigate(`/articles/${item.id}`)}
                    >
                      <div className="catalogue-card-img-wrap">
                        {getDressingCardPhoto(item) ? (
                          <img 
                            src={getDressingCardPhoto(item)} 
                            alt={item.categorie} 
                            className="catalogue-card-img" 
                          />
                        ) : (
                          <div className="catalogue-card-img-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                        {item.certifie && (
                          <div className="catalogue-card-badge-check" style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(0,0,0,0.6)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                              <path d="M7 12l3.5 3.5 6.5-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="catalogue-card-info">
                        <p className="catalogue-card-cat">{item.categorie} <span>{item.marque}</span></p>
                        <p className="catalogue-card-detail">{item.taille} · {item.etat}</p>
                        <p className="catalogue-card-price">{parseFloat(item.prix)}€</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* COLUMN RIGHT */}
          <div className="product-right-col">
            <h1 className="product-detail-title">{article.categorie}</h1>
            <p className="product-detail-price">{parseFloat(article.prix)}€</p>

            {/* Badge Certifié */}
            {article.certifie && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '10px', padding: '10px 18px',
                marginBottom: '2rem',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981' }}>
                    Article Certifié Second Round
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(16,185,129,0.6)' }}>
                    Vérifié manuellement par notre équipe
                  </p>
                </div>
              </div>
            )}

            <div className="product-specs-list">
              <div className="product-spec-row">
                <span className="product-spec-label">Taille :</span>
                <span className="product-spec-value">
                  {article.taille}
                  <a href="#size-guide" className="product-spec-link" onClick={(e) => { e.preventDefault(); alert("Guide des tailles bientôt disponible !"); }}>
                    Voir le guide &rarr;
                  </a>
                </span>
              </div>
              <div className="product-spec-row">
                <span className="product-spec-label">Marque :</span>
                <span className="product-spec-value">{article.marque}</span>
              </div>
              <div className="product-spec-row">
                <span className="product-spec-label">État :</span>
                <span className="product-spec-value">{article.etat}</span>
              </div>
              <div className="product-spec-row">
                <span className="product-spec-label">Couleurs :</span>
                <span className="product-spec-value">{getColor()}</span>
              </div>
            </div>

            <p className="product-description-text">{article.description}</p>

            <div className="product-actions-ctas">
              <button 
                onClick={handleSendMessage} 
                disabled={submittingMessage}
                className="product-btn-buy"
              >
                {submittingMessage ? "Envoi..." : "Envoyer un message"}
              </button>
              <button 
                onClick={() => { if (!token) navigate('/login'); else setShowOfferModal(true); }}
                className="product-btn-offer"
              >
                Faire une offre
              </button>
            </div>

            {/* Seller Info Card */}
            {article.vendeur && (
              <div 
                className="seller-profile-card"
                onClick={() => navigate(`/profile?id=${article.vendeur.id}`)}
              >
                <div className="seller-card-info-wrap">
                  <div className="seller-card-avatar-container">
                    {article.vendeur.photoProfil ? (
                      <img 
                        src={`http://localhost:8000/images/photos/${article.vendeur.photoProfil}`} 
                        alt={article.vendeur.pseudo} 
                        className="seller-card-avatar-img"
                      />
                    ) : (
                      <span className="seller-card-initials">
                        {(article.vendeur.pseudo || "?")[0]}
                      </span>
                    )}
                  </div>
                  <div className="seller-card-details">
                    <p className="seller-card-name">{article.vendeur.pseudo || "Utilisateur"}</p>
                    <div className="seller-card-stars">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <svg 
                          key={idx} 
                          className="seller-card-star-svg" 
                          fill={idx < sellerRating.rating ? "#ff0000" : "#ffffff"} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="seller-card-eval-count">
                      {sellerRating.count} évaluations
                    </span>
                  </div>
                </div>
                <span className="seller-card-chevron">&rarr;</span>
              </div>
            )}

          </div>

        </div>

        {/* Suggestions */}
        <div className="suggestions-section-container">
          <h3 className="suggestions-section-title">Suggestions</h3>
          
          {suggestions.length === 0 ? (
            <p className="text-gray-500 italic">Aucune autre suggestion pour le moment.</p>
          ) : (
            <div className="suggestions-grid">
              {suggestions.map((item) => {
                const itemPhoto = getDressingCardPhoto(item);
                const hasFav = localStorage.getItem(`fav_art_${item.id}`) === "true";

                return (
                  <div 
                    key={item.id} 
                    className="catalogue-card"
                    onClick={() => navigate(`/articles/${item.id}`)}
                  >
                    <div className="catalogue-card-img-wrap">
                      {itemPhoto ? (
                        <img 
                          src={itemPhoto} 
                          alt={item.categorie} 
                          className="catalogue-card-img" 
                        />
                      ) : (
                        <div className="catalogue-card-img-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                        </div>
                      )}
                      
                      {item.certifie && (
                        <div className="catalogue-card-badge-check" style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(0,0,0,0.6)' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                            <path d="M7 12l3.5 3.5 6.5-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}

                      <button
                        className={`catalogue-card-heart${hasFav ? " active" : ""}`}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const newFav = !hasFav;
                          localStorage.setItem(`fav_art_${item.id}`, newFav ? "true" : "false");
                          // Trick to force render
                          setSuggestions([...suggestions]);
                        }}
                        aria-label="Ajouter aux favoris"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill={hasFav ? "#ff0000" : "black"} stroke={hasFav ? "#ff0000" : "white"} strokeWidth="1.5">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>
                    <div className="catalogue-card-info">
                      <p className="catalogue-card-cat">{item.categorie} <span>{item.marque}</span></p>
                      <p className="catalogue-card-detail">{item.taille} · {item.etat}</p>
                      <p className="catalogue-card-price">{parseFloat(item.prix)}€</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Offer Modal Overlay */}
      {showOfferModal && (
        <div
          id="offer-modal-overlay"
          onClick={e => { if (e.target.id === "offer-modal-overlay") setShowOfferModal(false); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#111",
              border: "1.5px solid #2a2a2a",
              borderRadius: 16,
              padding: "32px",
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff" }}>
              Faire une offre
            </h2>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
              Prix original :{" "}
              <span style={{ color: "#fff", fontWeight: 700 }}>{parseFloat(article.prix)} €</span>
            </p>

            <form onSubmit={handleSendOfferSubmit}>
              <label style={{ display: "block", color: "#aaa", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Votre offre (€)
              </label>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={offerAmount}
                  onChange={e => setOfferAmount(e.target.value)}
                  placeholder="Ex : 12"
                  autoFocus
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: "1.5px solid #333",
                    borderRadius: 10,
                    padding: "14px 48px 14px 16px",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#fff",
                    outline: "none"
                  }}
                />
                <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#666", fontWeight: 700 }}>
                  €
                </span>
              </div>

              {offerAmount && !isNaN(parseFloat(offerAmount)) && parseFloat(article.prix) > 0 && (
                <div style={{
                  background: "#1a1a1a",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 20,
                  fontSize: 13,
                  color: "#aaa",
                }}>
                  Réduction :{" "}
                  <span style={{ color: parseFloat(offerAmount) < parseFloat(article.prix) ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
                    {Math.round((1 - parseFloat(offerAmount) / parseFloat(article.prix)) * 100)}%
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1.5px solid #333",
                    borderRadius: 10,
                    padding: "13px",
                    color: "#aaa",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={offerLoading || !offerAmount}
                  style={{
                    flex: 2,
                    background: offerLoading || !offerAmount ? "#333" : "#ff0000",
                    border: "none",
                    borderRadius: 10,
                    padding: "13px",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 14,
                    cursor: offerLoading || !offerAmount ? "not-allowed" : "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {offerLoading ? "Envoi…" : "Envoyer l'offre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
