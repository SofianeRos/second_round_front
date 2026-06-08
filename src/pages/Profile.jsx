import { useNavigate } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (user?.id) {
        try {
          setLoadingArticles(true);
          const response = await api.get(`/articles?vendeur.id=${user.id}`);
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
  }, [user]);

  if (loading || (token && !user)) {
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

  console.log("User data in Profile:", user);

  return (
    // Conteneur principal : Prend 100% de la largeur et applique le fond rayé
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
      {/* Conteneur intérieur : Limite la largeur du contenu et le centre */}
      <div style={{ width: '100%', maxWidth: '1200px', padding: '4rem 2rem' }}>
        
        {/* En-tête : < MON VESTIAIRE (Forcé en blanc) */}
        <button 
          onClick={() => navigate("/")} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', 
            background: 'transparent', border: 'none', 
            marginBottom: '4rem', cursor: 'pointer', padding: 0,
            fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em',
            color: '#ffffff'
          }}
        >
          <span style={{ color: '#ff0000' }}>&lt;</span> MON VESTIAIRE
        </button>

        {/* Corps de la carte */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Colonne Gauche : Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#111', border: '1px solid #333', overflow: 'hidden' }}>
              <img 
                src={getPhotoUrl(user?.photoProfil)} 
                alt="Profil" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: user?.photoProfil ? 'none' : 'grayscale(100%)' }}
              />
            </div>
            <button 
              onClick={() => navigate("/profile/edit")}
              style={{ color: '#9ca3af', fontSize: '1rem', background: 'transparent', border: 'none', textAlign: 'left', textDecoration: 'underline', textUnderlineOffset: '4px', cursor: 'pointer', padding: 0 }}
            >
              Mettre à jour mon profil
            </button>
          </div>

          {/* Colonne Droite : Textes et Statistiques */}
          <div style={{ display: 'flex', flexDirection: 'column', color: '#ffffff', paddingTop: '1rem', flex: 1, minWidth: '300px' }}>
            
            {/* Nom dynamique */}
            <h2 style={{ fontSize: '4.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1rem 0', color: '#ffffff' }}>
              {user?.pseudo || user?.username || "UTILISATEUR"}
            </h2>

            {/* Étoiles */}
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

            {/* Statistiques alignées et dynamiques */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Type de Boxe :</span> 
                <span style={{ color: '#d1d5db' }}>{user?.typeBoxe || "Non renseigné"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Poids :</span> 
                <span style={{ color: '#d1d5db' }}>{user?.poidsKg ? `${user.poidsKg} Kg` : "Non renseigné"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Taille :</span> 
                <span style={{ color: '#d1d5db' }}>{user?.tailleCm ? `${user.tailleCm} cm` : "Non renseigné"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '200px' }}>Niveau :</span> 
                <span style={{ color: '#d1d5db' }}>{user?.niveau || "Non renseigné"}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: '4rem', marginTop: '5rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
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
        </div>

        {/* Contenu de l'onglet */}
        <div style={{ marginTop: '3rem', width: '100%' }}>
          {activeTab === 'articles' ? (
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
                        {/* Statut badge */}
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
          ) : (
            /* Onglet Evaluations */
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', padding: '2rem 0' }}>
              Aucune évaluation reçue pour le moment.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}