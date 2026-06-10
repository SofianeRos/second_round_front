import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

// ─── constantes filtres ───────────────────────────────────────────────────────
const CATEGORIES = ["Gants", "Casques", "Sacs de frappe", "Bandes", "Cordes à sauter", "Paos", "Mitaines", "Shorts"];
const TAILLES    = ["XS", "S", "M", "L", "XL", "Adulte", "Enfant", "8 oz", "10 oz", "12 oz", "14 oz", "16 oz", "100 cm", "120 cm"];
const MARQUES    = ["Venum", "Everlast", "Fairtex", "Ringside", "Adidas", "Cleto Reyes", "Twins", "RDX", "Kwon", "Hayabusa"];
const ETATS      = ["Neuf", "Excellent état", "Très bon état", "Bon état", "État correct", "État Usé"];
const PRIX_OPTIONS = ["< 20€", "20€ – 50€", "50€ – 100€", "> 100€"];

const ITEMS_PER_PAGE = 8;

// ─── composant DropdownFilter ─────────────────────────────────────────────────
function DropdownFilter({ label, options, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = selected.length;

  return (
    <div className="catalogue-filter-wrapper" ref={ref}>
      <button
        className={`catalogue-filter-btn${activeCount > 0 ? " active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {label}
        {activeCount > 0 && <span className="catalogue-filter-badge">{activeCount}</span>}
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ marginLeft: 6, transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="catalogue-dropdown">
          {options.map((opt) => (
            <label key={opt} className="catalogue-dropdown-item">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
          {activeCount > 0 && (
            <button className="catalogue-dropdown-clear" onClick={onClear}>
              Tout effacer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── composant ProductCard catalogue ─────────────────────────────────────────
function CatalogueCard({ article, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const imageUrl = article.imageUrl
    ? `http://localhost:8000${article.imageUrl}`
    : null;

  return (
    <div
      className="catalogue-card"
      onClick={() => navigate(`/articles/${article.id}`)}
    >
      {/* Image */}
      <div className="catalogue-card-img-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={`${article.marque} ${article.categorie}`} className="catalogue-card-img" />
        ) : (
          <div className="catalogue-card-img-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Badge check — top right (visible si certifié) */}
        {article.certifie && (
          <div className="catalogue-card-badge-check" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M7 12l3.5 3.5 6.5-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Heart — bottom right */}
        <button
          className={`catalogue-card-heart${isFavorite ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(article.id); }}
          aria-label="Ajouter aux favoris"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorite ? "#ff0000" : "black"} stroke={isFavorite ? "#ff0000" : "white"} strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Infos */}
      <div className="catalogue-card-info">
        <p className="catalogue-card-cat">{article.categorie} <span>{article.marque}</span></p>
        <p className="catalogue-card-detail">{article.taille} · {article.etat}</p>
        <p className="catalogue-card-price">{parseFloat(article.prix)}€</p>
      </div>
    </div>
  );
}

// ─── page Catalogue ───────────────────────────────────────────────────────────
export default function Catalogue() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [articles, setArticles]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [favorites, setFavorites]       = useState([]);
  const [page, setPage]                 = useState(1);

  // filtres
  const [selCategorie, setSelCategorie] = useState([]);
  const [selTaille, setSelTaille]       = useState([]);
  const [selMarque, setSelMarque]       = useState([]);
  const [selEtat, setSelEtat]           = useState([]);
  const [selPrix, setSelPrix]           = useState([]);

  // récupération articles
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/articles?pagination=false");
        setArticles(res.data.member || res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // appliquer la recherche du header
  const searchTerm = searchParams.get("search") || "";

  // filtrage
  const filtered = articles.filter((a) => {
    if (searchTerm && !["marque","categorie","description","etat"].some(k => (a[k]||"").toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    if (selCategorie.length && !selCategorie.includes(a.categorie)) return false;
    if (selTaille.length    && !selTaille.includes(a.taille))       return false;
    if (selMarque.length    && !selMarque.includes(a.marque))       return false;
    if (selEtat.length      && !selEtat.includes(a.etat))           return false;
    if (selPrix.length) {
      const prix = parseFloat(a.prix);
      const match = selPrix.some((p) => {
        if (p === "< 20€")     return prix < 20;
        if (p === "20€ – 50€") return prix >= 20 && prix <= 50;
        if (p === "50€ – 100€")return prix >= 50 && prix <= 100;
        if (p === "> 100€")    return prix > 100;
        return false;
      });
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // reset page quand filtres changent
  useEffect(() => { setPage(1); }, [selCategorie, selTaille, selMarque, selEtat, selPrix, searchTerm]);

  const hasActiveFilters = selCategorie.length + selTaille.length + selMarque.length + selEtat.length + selPrix.length > 0;

  const clearAll = () => {
    setSelCategorie([]); setSelTaille([]); setSelMarque([]); setSelEtat([]); setSelPrix([]);
  };

  const toggle = (setter) => (val) =>
    setter((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);

  const toggleFavorite = (id) =>
    setFavorites((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);

  // pagination pages array
  const buildPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="catalogue-root">
      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="catalogue-hero">
        <div className="catalogue-hero-inner">
          <button className="catalogue-back-btn" onClick={() => navigate(-1)} aria-label="Retour">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="catalogue-title">CATALOGUE</h1>
        </div>
      </section>

      {/* ── FILTERS BAR ──────────────────────────────────────────────────── */}
      <section className="catalogue-filters-section">
        <div className="catalogue-filters-bar">
          <DropdownFilter label="CATÉGORIE" options={CATEGORIES} selected={selCategorie} onToggle={toggle(setSelCategorie)} onClear={() => setSelCategorie([])} />
          <DropdownFilter label="TAILLE"    options={TAILLES}    selected={selTaille}    onToggle={toggle(setSelTaille)}    onClear={() => setSelTaille([])} />
          <DropdownFilter label="MARQUE"    options={MARQUES}    selected={selMarque}    onToggle={toggle(setSelMarque)}    onClear={() => setSelMarque([])} />
          <DropdownFilter label="ÉTAT"      options={ETATS}      selected={selEtat}      onToggle={toggle(setSelEtat)}      onClear={() => setSelEtat([])} />
          <DropdownFilter label="PRIX"      options={PRIX_OPTIONS} selected={selPrix}    onToggle={toggle(setSelPrix)}      onClear={() => setSelPrix([])} />
        </div>

        {/* Effacer les filtres */}
        {hasActiveFilters && (
          <button className="catalogue-clear-all" onClick={clearAll}>
            Effacer les filtres
          </button>
        )}
      </section>

      {/* ── RESULTS + GRID ───────────────────────────────────────────────── */}
      <section className="catalogue-content">
        <p className="catalogue-results-count">
          {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="catalogue-loading">
            <div className="catalogue-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="catalogue-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p>Aucun article ne correspond à vos filtres.</p>
            {hasActiveFilters && <button onClick={clearAll} className="catalogue-empty-reset">Réinitialiser les filtres</button>}
          </div>
        ) : (
          <div className="catalogue-grid">
            {paginated.map((article) => (
              <CatalogueCard
                key={article.id}
                article={article}
                isFavorite={favorites.includes(article.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {/* ── PAGINATION ──────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="catalogue-pagination">
            <button
              className="catalogue-page-btn nav"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Page précédente"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {buildPages().map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="catalogue-page-dots">…</span>
              ) : (
                <button
                  key={p}
                  className={`catalogue-page-btn${p === page ? " current" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="catalogue-page-btn nav"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Page suivante"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
