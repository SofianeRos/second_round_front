import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const CATEGORIES = ["Gants", "Casques", "Sacs de frappe", "Bandes", "Cordes à sauter", "Paos", "Mitaines", "Shorts"];
const ETATS      = ["Neuf", "Excellent état", "Très bon état", "Bon état", "État correct", "État Usé"];
const TAILLES    = ["XS", "S", "M", "L", "XL", "Adulte", "Enfant", "8 oz", "10 oz", "12 oz", "14 oz", "16 oz", "100 cm", "120 cm"];

export default function SellForm() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [formData, setFormData] = useState({
    categorie:   "",
    marque:      "",
    taille:      "",
    etat:        "",
    description: "",
    prix:        "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="sell-form-root">
        <div className="sell-form-gate">
          <p>Tu dois être connecté pour publier une annonce.</p>
          <button className="sell-cta-btn small" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/articles", formData);
      setSuccess(true);
      setFormData({ categorie: "", marque: "", taille: "", etat: "", description: "", prix: "" });
    } catch (err) {
      setError("Erreur lors de la publication. Vérifie les champs et réessaie.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-form-root">
      {/* Header de page */}
      <section className="sell-hero sell-hero--small">
        <div className="sell-hero-inner">
          <button className="sell-back-btn" onClick={() => navigate("/sell")} aria-label="Retour">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="catalogue-title">PUBLIER UNE ANNONCE</h1>
        </div>
      </section>

      {/* Formulaire */}
      <section className="sell-form-section">
        <form className="sell-form" onSubmit={handleSubmit}>

          {/* Feedback */}
          {error && (
            <div className="sell-form-alert error">{error}</div>
          )}
          {success && (
            <div className="sell-form-alert success">
              ✅ Annonce publiée avec succès !{" "}
              <button type="button" onClick={() => navigate("/catalogue")} className="sell-form-link">
                Voir le catalogue
              </button>
            </div>
          )}

          {/* Étape 1 – Catégorie */}
          <div className="sell-form-step">
            <div className="sell-form-step-label">
              <span className="sell-form-step-num">01</span>
              CATÉGORIE
            </div>
            <div className="sell-form-chips">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`sell-form-chip${formData.categorie === cat ? " selected" : ""}`}
                  onClick={() => setFormData((p) => ({ ...p, categorie: cat }))}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Étape 2 – Marque + Taille + État */}
          <div className="sell-form-step">
            <div className="sell-form-step-label">
              <span className="sell-form-step-num">02</span>
              DÉTAILS
            </div>
            <div className="sell-form-row">
              <div className="sell-form-field">
                <label>Marque</label>
                <input
                  type="text"
                  name="marque"
                  value={formData.marque}
                  onChange={handleChange}
                  placeholder="ex: Venum, Everlast..."
                  required
                />
              </div>
              <div className="sell-form-field">
                <label>Taille</label>
                <select name="taille" value={formData.taille} onChange={handleChange} required>
                  <option value="">Choisir</option>
                  {TAILLES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sell-form-field">
                <label>État</label>
                <select name="etat" value={formData.etat} onChange={handleChange} required>
                  <option value="">Choisir</option>
                  {ETATS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Étape 3 – Description */}
          <div className="sell-form-step">
            <div className="sell-form-step-label">
              <span className="sell-form-step-num">03</span>
              DESCRIPTION
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décris l'état, l'usage, les défauts éventuels..."
              required
            />
          </div>

          {/* Étape 4 – Prix */}
          <div className="sell-form-step">
            <div className="sell-form-step-label">
              <span className="sell-form-step-num">04</span>
              PRIX
            </div>
            <div className="sell-form-price-wrap">
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                placeholder="0"
                min="1"
                step="0.01"
                required
                className="sell-form-price-input"
              />
              <span className="sell-form-price-currency">€</span>
            </div>
          </div>

          {/* Submit */}
          <div className="sell-form-submit-wrap">
            <button
              type="submit"
              disabled={loading}
              className="sell-cta-btn"
            >
              {loading ? "Publication en cours..." : (
                <>
                  METTRE EN LIGNE
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 10 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </form>
      </section>
    </div>
  );
}
