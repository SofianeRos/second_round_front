import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import api from "../services/api";

const getPhotoUrl = (path) => {
  if (!path) return "https://via.placeholder.com/300x400/222222/555555?text=PROFIL";
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/images/photos/${path}`;
};

export default function Profile() {
  const { token, user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("id");

  const [displayedUser, setDisplayedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const isOwnProfile = !userIdParam || (user && parseInt(userIdParam) === user.id);

  useEffect(() => {
    if (!token && !userIdParam) {
      navigate("/login");
    }
  }, [token, userIdParam, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userIdParam) {
        try {
          setLoadingUser(true);
          const response = await api.get(`/users/${userIdParam}`);
          setDisplayedUser(response.data);
        } catch (err) {
          console.error("Error fetching user details:", err);
        } finally {
          setLoadingUser(false);
        }
      } else {
        setDisplayedUser(user);
      }
    };
    fetchUser();
  }, [userIdParam, user]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (displayedUser?.id) {
        try {
          setLoadingArticles(true);
          const response = await api.get(`/articles?vendeur.id=${displayedUser.id}`);
          const data = response.data['hydra:member'] || response.data.member || response.data || [];
          setArticles(data);
        } catch (error) {
          console.error("Error fetching user articles:", error);
        } finally {
          setLoadingArticles(false);
        }
      }
    };
    fetchArticles();
  }, [displayedUser]);

  // ── Favoris ──────────────────────────────────────────────
  const getFavIds = () => {
    const ids = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("fav_art_") && localStorage.getItem(key) === "true") {
        const id = parseInt(key.replace("fav_art_", ""), 10);
        if (!isNaN(id)) ids.push(id);
      }
    }
    return ids;
  };

  const [favIds, setFavIds] = useState(() => getFavIds());
  const [favArticles, setFavArticles] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  useEffect(() => {
    if (activeTab !== "favoris" || !isOwnProfile) return;
    const ids = getFavIds();
    setFavIds(ids);
    if (ids.length === 0) {
      setFavArticles([]);
      return;
    }
    const fetchFavs = async () => {
      setLoadingFavs(true);
      try {
        const results = await Promise.all(
          ids.map((id) => api.get(`/articles/${id}`).catch(() => null))
        );
        setFavArticles(results.filter(Boolean).map((r) => r.data));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoadingFavs(false);
      }
    };
    fetchFavs();
  }, [activeTab, isOwnProfile]);

  const removeFav = (articleId) => {
    localStorage.setItem(`fav_art_${articleId}`, "false");
    setFavArticles((prev) => prev.filter((a) => a.id !== articleId));
    setFavIds((prev) => prev.filter((id) => id !== articleId));
  };
  // ─────────────────────────────────────────────────────────

  if (loading || loadingUser || (token && !displayedUser && !userIdParam)) {
    return (
      <div 
        style={{ 
          minHeight: '100vh',
          width: '100%',
          background: "repeating-linear-gradient(-45deg, #0a0a0a, #0a0a0a 15px, #141414 15px, #141414 30px)",
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          fontSize: '2rem',
          fontWeight: '900',
          textTransform: 'uppercase',
          borderTop: '1px solid #222'
        }}
      >
        Chargement du profil...
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        width: '100%',
        background: "repeating-linear-gradient(-45deg, #0a0a0a, #0a0a0a 15px, #141414 15px, #141414 30px)",
        display: 'flex', 
        justifyContent: 'center',
        borderTop: '1px solid #222'
      }}
    >
      <div style={{ width: '100%', maxWidth: '1200px', padding: '4rem 2rem' }}>
        
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', 
            background: 'transparent', border: 'none', 
            marginBottom: '4rem', cursor: 'pointer', padding: 0,
            fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em',
            color: '#ffffff'
          }}
        >
          <span style={{ color: '#ff0000' }}>&lt;</span> {isOwnProfile ? "MON VESTIAIRE" : `VESTIAIRE DE ${displayedUser?.pseudo || "UTILISATEUR"}`}
        </button>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#111', border: '1px solid #333', overflow: 'hidden' }}>
              <img 
                src={getPhotoUrl(displayedUser?.photoProfil)} 
                alt="Profil" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: displayedUser?.photoProfil ? 'none' : 'grayscale(100%)' }}
              />
            </div>
            {isOwnProfile && (
              <button 
                onClick={() => navigate("/profile/edit")}
                style={{ color: '#9ca3af', fontSize: '1rem', background: 'transparent', border: 'none', textAlign: 'left', textDecoration: 'underline', textUnderlineOffset: '4px', cursor: 'pointer', padding: 0 }}
              >
                Mettre à jour mon profil
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', color: '#ffffff', paddingTop: '1rem', flex: 1, minWidth: '300px' }}>
            
            <h2 style={{ fontSize: '4.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1rem 0', color: '#ffffff' }}>
              {displayedUser?.pseudo || displayedUser?.username || "UTILISATEUR"}
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
              {[1, 2, 3, 4].map(star => (
                <svg key={star} style={{ width: '32px', height: '32px', color: '#ff0000' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg style={{ width: '32px', height: '32px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Type de Boxe :</span> 
                <span style={{ color: '#d1d5db' }}>{displayedUser?.typeBoxe || "Non renseigné"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Poids :</span> 
                <span style={{ color: '#d1d5db' }}>{displayedUser?.poidsKg ? `${displayedUser.poidsKg} Kg` : "Non renseigné"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Taille :</span> 
                <span style={{ color: '#d1d5db' }}>{displayedUser?.tailleCm ? `${displayedUser.tailleCm} cm` : "Non renseigné"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Niveau :</span> 
                <span style={{ color: '#d1d5db' }}>{displayedUser?.niveau || "Non renseigné"}</span>
              </div>
            </div>

          </div>
        </div>

        <div style={{ display: 'flex', gap: '4rem', marginTop: '5rem', borderTop: '1px solid #333', paddingTop: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('articles')}
            style={{ 
              paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', fontSize: '1.25rem', 
              background: 'transparent', border: 'none', borderBottom: activeTab === 'articles' ? '4px solid #ff0000' : '4px solid transparent',
              color: activeTab === 'articles' ? '#ffffff' : '#6b7280', cursor: 'pointer', paddingLeft: 0, paddingRight: 0
            }}
          >
            ARTICLES
          </button>
          <button 
            onClick={() => setActiveTab('evaluations')}
            style={{ 
              paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', fontSize: '1.25rem', 
              background: 'transparent', border: 'none', borderBottom: activeTab === 'evaluations' ? '4px solid #ff0000' : '4px solid transparent',
              color: activeTab === 'evaluations' ? '#ffffff' : '#6b7280', cursor: 'pointer', paddingLeft: 0, paddingRight: 0
            }}
          >
            ÉVALUATIONS
          </button>
          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('favoris')}
              style={{ 
                paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', fontSize: '1.25rem', 
                background: 'transparent', border: 'none', borderBottom: activeTab === 'favoris' ? '4px solid #ff0000' : '4px solid transparent',
                color: activeTab === 'favoris' ? '#ffffff' : '#6b7280', cursor: 'pointer', paddingLeft: 0, paddingRight: 0,
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={activeTab === 'favoris' ? '#ff0000' : 'none'} stroke={activeTab === 'favoris' ? '#ff0000' : '#6b7280'} strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              MES FAVORIS
              {favIds.length > 0 && (
                <span style={{
                  background: '#ff0000',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '900',
                  borderRadius: '999px',
                  padding: '1px 7px',
                  minWidth: '20px',
                  textAlign: 'center',
                }}>
                  {favIds.length}
                </span>
              )}
            </button>
          )}
        </div>

        <div style={{ marginTop: '3rem', width: '100%' }}>
          {activeTab === 'articles' && (
            loadingArticles ? (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', padding: '2rem 0' }}>
                Chargement des articles...
              </div>
            ) : articles.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', padding: '2rem 0' }}>
                Aucun article en vente pour le moment.
              </div>
            ) : (
              <div className="catalogue-grid">
                {articles.map((article) => {
                  const imageUrl = article.photos && article.photos.length > 0
                    ? `http://localhost:8000/images/photos/${article.photos[0].nomFichier}`
                    : article.imageUrl
                      ? `http://localhost:8000${article.imageUrl}`
                      : null;
                  
                  return (
                    <div 
                      key={article.id} 
                      className="catalogue-card"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      <div className="catalogue-card-img-wrap">
                        {imageUrl ? (
                          <img src={imageUrl} alt={article.categorie} className="catalogue-card-img" />
                        ) : (
                          <div className="catalogue-card-img-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          zIndex: 2,
                          backgroundColor: article.statut?.couleurBadge || '#10B981',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {article.statut?.libelle || "En vente"}
                        </div>
                      </div>
                      <div className="catalogue-card-info">
                        <p className="catalogue-card-cat">{article.categorie} <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'normal' }}>{article.marque}</span></p>
                        <p className="catalogue-card-detail">{article.taille} · {article.etat}</p>
                        <p className="catalogue-card-price">{parseFloat(article.prix)}€</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'evaluations' && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', padding: '2rem 0' }}>
              Aucune évaluation reçue pour le moment.
            </div>
          )}

          {activeTab === 'favoris' && isOwnProfile && (
            <div style={{ width: '100%' }}>
              {loadingFavs ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', padding: '2rem 0' }}>
                  Chargement des favoris...
                </div>
              ) : favArticles.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '5rem 2rem',
                  textAlign: 'center',
                }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1.1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Aucun favori pour l'instant
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.95rem' }}>
                    Clique sur le ❤ d'un article pour le retrouver ici
                  </p>
                  <button
                    onClick={() => navigate('/catalogue')}
                    style={{
                      marginTop: '0.5rem',
                      background: '#ff0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 2rem',
                      fontWeight: '900',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                    }}
                  >
                    Explorer le catalogue
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {favArticles.length} article{favArticles.length > 1 ? 's' : ''} sauvegardé{favArticles.length > 1 ? 's' : ''}
                  </p>
                  <div className="catalogue-grid">
                    {favArticles.map((article) => {
                      const imageUrl = article.photos && article.photos.length > 0
                        ? `http://localhost:8000/images/photos/${article.photos[0].nomFichier}`
                        : null;

                      return (
                        <div
                          key={article.id}
                          className="catalogue-card"
                          style={{ position: 'relative' }}
                          onClick={() => navigate(`/articles/${article.id}`)}
                        >
                          <div className="catalogue-card-img-wrap">
                            {imageUrl ? (
                              <img src={imageUrl} alt={article.categorie} className="catalogue-card-img" />
                            ) : (
                              <div className="catalogue-card-img-placeholder">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                                  <rect x="3" y="3" width="18" height="18" rx="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <path d="m21 15-5-5L5 21" />
                                </svg>
                              </div>
                            )}

                            <button
                              onClick={(e) => { e.stopPropagation(); removeFav(article.id); }}
                              title="Retirer des favoris"
                              style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                zIndex: 10,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.7)',
                                border: '1px solid rgba(255,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)',
                                transition: 'transform 0.2s, background 0.2s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000" stroke="#ff0000" strokeWidth="1.5">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </button>
                          </div>
                          <div className="catalogue-card-info">
                            <p className="catalogue-card-cat">
                              {article.categorie} <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'normal' }}>{article.marque}</span>
                            </p>
                            <p className="catalogue-card-detail">{article.taille} · {article.etat}</p>
                            <p className="catalogue-card-price">{parseFloat(article.prix)}€</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}