import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const getPhotoUrl = (article) => {
  if (article.photos && article.photos.length > 0) {
    return `http://localhost:8000/images/photos/${article.photos[0].nomFichier}`;
  }
  return null;
};

export default function AdminPanel() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "certified" | "uncertified"
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Signalement states
  const [activeTab, setActiveTab] = useState("articles"); // "articles" | "reports"
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportFilter, setReportFilter] = useState("all"); // "all" | "pending" | "resolved"
  // Guard — redirect non-admins
  useEffect(() => {
    if (!loading && (!token || !user?.roles?.includes("ROLE_ADMIN"))) {
      navigate("/");
    }
  }, [loading, token, user, navigate]);

  // Load all articles
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingArticles(true);
      try {
        let allArticles = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const res = await api.get(`/articles?page=${page}&itemsPerPage=30`);
          const data = res.data["hydra:member"] || res.data.member || res.data || [];
          allArticles = [...allArticles, ...data];
          const totalItems = res.data["hydra:totalItems"] ?? data.length;
          hasMore = allArticles.length < totalItems && data.length > 0;
          page++;
          if (page > 20) break; // safety
        }
        setArticles(allArticles);
      } catch (err) {
        console.error("Error loading articles", err);
      } finally {
        setLoadingArticles(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await api.get("/signalements", {
        headers: { Accept: "application/json" }
      });
      const data = res.data["hydra:member"] || res.data.member || res.data || [];
      setReports(data);
    } catch (err) {
      console.error("Error loading reports", err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === "reports") {
      fetchReports();
    }
  }, [token, activeTab]);

  const handleSanctionReport = async (report) => {
    try {
      await api.patch(
        `/signalements/${report.id}`,
        { statut: 'traite_sanctionne' },
        { headers: { "Content-Type": "application/merge-patch+json" } }
      );
      showToast("✓ Expéditeur sanctionné et banni !", true);
      fetchReports();
    } catch (err) {
      console.error("Error sanctioning", err);
      showToast("Erreur lors de la sanction", false);
    }
  };

  const handleIgnoreReport = async (report) => {
    try {
      await api.patch(
        `/signalements/${report.id}`,
        { statut: 'traite_ignore' },
        { headers: { "Content-Type": "application/merge-patch+json" } }
      );
      showToast("✓ Signalement ignoré.", true);
      fetchReports();
    } catch (err) {
      console.error("Error ignoring report", err);
      showToast("Erreur lors de la mise à jour", false);
    }
  };

  const showToast = (msg, success = true) => {
    setToast({ msg, success });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleCertification = async (article) => {
    setTogglingId(article.id);
    try {
      const res = await api.patch(
        `/articles/${article.id}/certifier`,
        { certifie: !article.certifie },
        { headers: { "Content-Type": "application/merge-patch+json" } }
      );
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, certifie: res.data.certifie } : a))
      );
      showToast(
        res.data.certifie
          ? `✓ "${article.marque} ${article.categorie}" certifié !`
          : `✗ Certification retirée de "${article.marque} ${article.categorie}"`,
        res.data.certifie
      );
    } catch (err) {
      console.error("Error toggling certification", err);
      showToast("Erreur lors de la mise à jour", false);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteArticle = async (article) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer définitivement l'article "${article.marque} ${article.categorie}" ?`)) {
      return;
    }
    setDeletingId(article.id);
    try {
      await api.delete(`/articles/${article.id}`);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
      showToast(`✓ Article "${article.marque} ${article.categorie}" supprimé avec succès !`, true);
    } catch (err) {
      console.error("Error deleting article", err);
      showToast("Erreur lors de la suppression de l'article", false);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch =
      !search ||
      a.marque?.toLowerCase().includes(search.toLowerCase()) ||
      a.categorie?.toLowerCase().includes(search.toLowerCase()) ||
      a.vendeur?.pseudo?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "certified" && a.certifie) ||
      (filter === "uncertified" && !a.certifie);
    return matchSearch && matchFilter;
  });

  const certifiedCount = articles.filter((a) => a.certifie).length;

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", borderTop: "1px solid #222" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "90px", right: "24px", zIndex: 9999,
          background: toast.success ? "rgba(16, 185, 129, 0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${toast.success ? "#10b981" : "#ef4444"}`,
          borderRadius: "10px", padding: "14px 20px",
          color: toast.success ? "#6ee7b7" : "#fca5a5",
          fontWeight: "700", fontSize: "14px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "8px",
              background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Panel Admin
            </h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.95rem", margin: 0 }}>
            Modération et certification des articles et des messages Second Round
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #222", marginBottom: "2.5rem" }}>
          {[
            { id: "articles", label: "Certification Articles" },
            { id: "reports", label: "Signalements Messages" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? "3px solid #ff0000" : "3px solid transparent",
                color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)",
                padding: "0.75rem 1.5rem",
                fontWeight: "800",
                fontSize: "15px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "articles" ? (
          <>
            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
              {[
                { label: "Total articles", value: articles.length, color: "#ffffff" },
                { label: "Certifiés", value: certifiedCount, color: "#10b981" },
                { label: "Non certifiés", value: articles.length - certifiedCount, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  background: "#0f0f0f", border: "1px solid #1a1a1a",
                  borderRadius: "12px", padding: "1.5rem 2rem",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>{label}</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "900", color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Filters Bar */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
                <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un article, marque, vendeur…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%", background: "#0f0f0f", border: "1px solid #222",
                    borderRadius: "8px", padding: "0.75rem 1rem 0.75rem 2.5rem",
                    color: "#fff", fontSize: "14px", outline: "none",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[
                  { key: "all", label: "Tous" },
                  { key: "certified", label: "✓ Certifiés" },
                  { key: "uncertified", label: "En attente" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      borderRadius: "8px",
                      border: filter === key ? "1px solid #ff0000" : "1px solid #222",
                      background: filter === key ? "rgba(255,0,0,0.1)" : "#0f0f0f",
                      color: filter === key ? "#ff6666" : "rgba(255,255,255,0.5)",
                      fontWeight: "700", fontSize: "13px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Table */}
            {loadingArticles ? (
              <div style={{ textAlign: "center", padding: "5rem", color: "rgba(255,255,255,0.3)", fontSize: "1rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Chargement des articles…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem", color: "rgba(255,255,255,0.2)" }}>
                Aucun article trouvé
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Table Header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 1fr 100px 130px 150px 140px",
                  gap: "1rem", padding: "0.75rem 1.5rem",
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em",
                  borderBottom: "1px solid #1a1a1a",
                }}>
                  <span>Photo</span>
                  <span>Article</span>
                  <span>Vendeur</span>
                  <span>Prix</span>
                  <span>Statut</span>
                  <span>Certification</span>
                  <span>Actions</span>
                </div>

                {filtered.map((article) => {
                  const photo = getPhotoUrl(article);
                  const isBusy = togglingId === article.id;

                  return (
                    <div
                      key={article.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "60px 1fr 1fr 100px 130px 150px 140px",
                        gap: "1rem", padding: "1rem 1.5rem",
                        background: "#0a0a0a",
                        border: article.certifie ? "1px solid rgba(16,185,129,0.2)" : "1px solid #141414",
                        borderRadius: "10px",
                        alignItems: "center",
                        transition: "border-color 0.2s",
                      }}
                    >
                      {/* Photo */}
                      <div style={{ width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", background: "#111", flexShrink: 0 }}>
                        {photo ? (
                          <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <path d="m21 15-5-5L5 21"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Article */}
                      <div>
                        <p style={{ margin: 0, fontWeight: "800", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {article.categorie}
                          {article.certifie && (
                            <span style={{
                              marginLeft: "8px", fontSize: "10px",
                              background: "rgba(16,185,129,0.15)", color: "#10b981",
                              border: "1px solid rgba(16,185,129,0.3)",
                              borderRadius: "4px", padding: "2px 6px", fontWeight: "700",
                            }}>CERTIFIÉ</span>
                          )}
                        </p>
                        <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{article.marque} · {article.taille}</p>
                      </div>

                      {/* Vendeur */}
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                          {article.vendeur?.pseudo || "—"}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
                          {article.etat}
                        </p>
                      </div>

                      {/* Prix */}
                      <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#ff6666" }}>
                        {parseFloat(article.prix)}€
                      </p>

                      {/* Statut */}
                      <div>
                        <span style={{
                          background: `${article.statut?.couleurBadge || "#10B981"}22`,
                          color: article.statut?.couleurBadge || "#10B981",
                          border: `1px solid ${article.statut?.couleurBadge || "#10B981"}44`,
                          borderRadius: "5px", padding: "3px 8px",
                          fontSize: "11px", fontWeight: "800", textTransform: "uppercase",
                        }}>
                          {article.statut?.libelle || "En vente"}
                        </span>
                      </div>

                      {/* Action Certifier */}
                      <button
                        onClick={() => toggleCertification(article)}
                        disabled={isBusy}
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: "8px",
                          border: article.certifie
                            ? "1px solid rgba(239,68,68,0.4)"
                            : "1px solid rgba(16,185,129,0.4)",
                          background: article.certifie
                            ? "rgba(239,68,68,0.08)"
                            : "rgba(16,185,129,0.08)",
                          color: article.certifie ? "#f87171" : "#34d399",
                          fontWeight: "800", fontSize: "12px",
                          textTransform: "uppercase", letterSpacing: "0.06em",
                          cursor: isBusy ? "not-allowed" : "pointer",
                          opacity: isBusy ? 0.5 : 1,
                          transition: "all 0.2s",
                          display: "flex", alignItems: "center", gap: "6px",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => { if (!isBusy) e.currentTarget.style.opacity = "0.8"; }}
                        onMouseLeave={(e) => { if (!isBusy) e.currentTarget.style.opacity = "1"; }}
                      >
                        {isBusy ? (
                          "…"
                        ) : article.certifie ? (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            Décertifier
                          </>
                        ) : (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                            Certifier
                          </>
                        )}
                      </button>

                      {/* Action Supprimer */}
                      <button
                        onClick={() => handleDeleteArticle(article)}
                        disabled={deletingId === article.id}
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(239,68,68,0.4)",
                          background: "rgba(239,68,68,0.15)",
                          color: "#ef4444",
                          fontWeight: "800", fontSize: "12px",
                          textTransform: "uppercase", letterSpacing: "0.06em",
                          cursor: deletingId === article.id ? "not-allowed" : "pointer",
                          opacity: deletingId === article.id ? 0.5 : 1,
                          transition: "all 0.2s",
                          display: "flex", alignItems: "center", gap: "6px",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== article.id) {
                            e.currentTarget.style.background = "#ef4444";
                            e.currentTarget.style.color = "#fff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (deletingId !== article.id) {
                            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                            e.currentTarget.style.color = "#ef4444";
                          }
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        {deletingId === article.id ? "..." : "Supprimer"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <p style={{ marginTop: "2rem", color: "rgba(255,255,255,0.15)", fontSize: "12px", textAlign: "right" }}>
              {filtered.length} article{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
            </p>
          </>
        ) : (
          <>
            {/* Reports Tab Content */}
            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
              {[
                { label: "Total signalements", value: reports.length, color: "#ffffff" },
                { label: "En attente", value: reports.filter(r => r.statut === 'en_attente').length, color: "#f59e0b" },
                { label: "Traités", value: reports.filter(r => r.statut !== 'en_attente').length, color: "#10b981" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  background: "#0f0f0f", border: "1px solid #1a1a1a",
                  borderRadius: "12px", padding: "1.5rem 2rem",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>{label}</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "900", color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Filters Bar */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[
                  { key: "all", label: "Tous" },
                  { key: "pending", label: "En attente" },
                  { key: "resolved", label: "Traités" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setReportFilter(key)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      borderRadius: "8px",
                      border: reportFilter === key ? "1px solid #ff0000" : "1px solid #222",
                      background: reportFilter === key ? "rgba(255,0,0,0.1)" : "#0f0f0f",
                      color: reportFilter === key ? "#ff6666" : "rgba(255,255,255,0.5)",
                      fontWeight: "700", fontSize: "13px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            {loadingReports ? (
              <div style={{ textAlign: "center", padding: "5rem", color: "rgba(255,255,255,0.3)", fontSize: "1rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Chargement des signalements…
              </div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem", color: "rgba(255,255,255,0.2)" }}>
                Aucun signalement trouvé
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Table Header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 150px 180px 140px 250px",
                  gap: "1rem", padding: "0.75rem 1.5rem",
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em",
                  borderBottom: "1px solid #1a1a1a",
                }}>
                  <span>Message & Date</span>
                  <span>Expéditeur</span>
                  <span>Signalé Par</span>
                  <span>Raison</span>
                  <span>Statut</span>
                  <span>Modération</span>
                </div>

                {reports
                  .filter(r => {
                    if (reportFilter === "pending") return r.statut === "en_attente";
                    if (reportFilter === "resolved") return r.statut !== "en_attente";
                    return true;
                  })
                  .map((report) => {
                    const expediteur = report.message?.expediteur;
                    const signalePar = report.signalePar;
                    const dateStr = new Date(report.dateSignalement).toLocaleString("fr-FR");
                    const isBanned = expediteur?.banni === true;

                    return (
                      <div
                        key={report.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 200px 150px 180px 140px 250px",
                          gap: "1rem", padding: "1rem 1.5rem",
                          background: "#0a0a0a",
                          border: "1px solid #141414",
                          borderRadius: "10px",
                          alignItems: "center",
                        }}
                      >
                        {/* Message & Date */}
                        <div>
                          <p style={{ margin: 0, color: "#fff", fontSize: "14px", fontStyle: "italic", lineHeight: "1.4" }}>
                            "{report.message?.contenu || "[Message supprimé]"}"
                          </p>
                          <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                            Signalé le {dateStr}
                          </p>
                        </div>

                        {/* Expéditeur */}
                        <div>
                          <p style={{ margin: 0, fontWeight: "700", fontSize: "13px" }}>
                            {expediteur?.pseudo || "—"}
                          </p>
                          <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                            {expediteur?.email || ""}
                          </p>
                          <span style={{
                            display: "inline-block", marginTop: "4px", fontSize: "10px", fontWeight: "800",
                            padding: "2px 6px", borderRadius: "4px",
                            background: isBanned ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                            color: isBanned ? "#f87171" : "#34d399",
                            border: `1px solid ${isBanned ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`
                          }}>
                            {isBanned ? "🚫 BANNI" : "✅ ACTIF"}
                          </span>
                        </div>

                        {/* Signalé Par */}
                        <div>
                          <p style={{ margin: 0, fontSize: "13px" }}>
                            {signalePar?.pseudo || "—"}
                          </p>
                        </div>

                        {/* Raison */}
                        <div>
                          <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)", whiteSpace: "normal", wordBreak: "break-word" }}>
                            {report.raison}
                          </p>
                        </div>

                        {/* Statut */}
                        <div>
                          {report.statut === "en_attente" && (
                            <span style={{
                              background: "rgba(245,158,11,0.15)", color: "#f59e0b",
                              border: "1px solid rgba(245,158,11,0.4)",
                              borderRadius: "5px", padding: "3px 8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase"
                            }}>
                              En attente
                            </span>
                          )}
                          {report.statut === "traite_sanctionne" && (
                            <span style={{
                              background: "rgba(239,68,68,0.15)", color: "#ef4444",
                              border: "1px solid rgba(239,68,68,0.4)",
                              borderRadius: "5px", padding: "3px 8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase"
                            }}>
                              Sanctionné
                            </span>
                          )}
                          {report.statut === "traite_ignore" && (
                            <span style={{
                              background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              borderRadius: "5px", padding: "3px 8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase"
                            }}>
                              Ignoré
                            </span>
                          )}
                        </div>

                        {/* Modération Actions */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          {report.statut === "en_attente" ? (
                            <>
                              <button
                                onClick={() => handleSanctionReport(report)}
                                style={{
                                  padding: "0.5rem 0.8rem", borderRadius: "8px",
                                  border: "1px solid rgba(239,68,68,0.4)",
                                  background: "rgba(239,68,68,0.08)", color: "#f87171",
                                  fontWeight: "800", fontSize: "11px", textTransform: "uppercase",
                                  cursor: "pointer", transition: "all 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                                onMouseLeave={e => e.currentTarget.style.opacity = 1}
                              >
                                Sanctionner
                              </button>
                              <button
                                onClick={() => handleIgnoreReport(report)}
                                style={{
                                  padding: "0.5rem 0.8rem", borderRadius: "8px",
                                  border: "1px solid rgba(255,255,255,0.15)",
                                  background: "transparent", color: "rgba(255,255,255,0.6)",
                                  fontWeight: "800", fontSize: "11px", textTransform: "uppercase",
                                  cursor: "pointer", transition: "all 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                              >
                                Ignorer
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
                              Aucune action
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
