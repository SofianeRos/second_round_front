import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  const diffW = Math.floor(diffD / 7);
  const diffM = Math.floor(diffD / 30);

  if (diffMin < 2) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD === 0) return "Auj.";
  if (diffD === 1) return "Hier";
  if (diffW < 2) return `Il y a ${diffD}j`;
  if (diffM < 2) return `Il y a ${diffW} sem`;
  return `Il y a ${diffM} mois`;
}

function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatDay(dateStr) {
  const date = new Date(dateStr);
  if (isToday(dateStr)) return "Aujourd'hui";
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function conversationKey(msg, currentUserId) {
  const otherId =
    msg.expediteur?.id === currentUserId
      ? msg.destinataire?.id
      : msg.expediteur?.id;
  const articleId = msg.article?.id ?? "no-article";
  return `${otherId}_${articleId}`;
}

function getOtherUser(msg, currentUserId) {
  return msg.expediteur?.id === currentUserId
    ? msg.destinataire
    : msg.expediteur;
}

function buildConversations(messages, currentUserId) {
  const map = new Map();
  // messages are sorted DESC by date, so first occurrence is newest
  for (const msg of messages) {
    const key = conversationKey(msg, currentUserId);
    if (!map.has(key)) {
      map.set(key, {
        key,
        otherUser: getOtherUser(msg, currentUserId),
        article: msg.article,
        lastMessage: msg,
      });
    }
  }
  return Array.from(map.values());
}

function groupByDay(messages) {
  const groups = [];
  let lastDay = null;
  for (const msg of messages) {
    const day = new Date(msg.dateEnvoie).toDateString();
    if (day !== lastDay) {
      groups.push({ type: "separator", label: formatDay(msg.dateEnvoie) });
      lastDay = day;
    }
    groups.push({ type: "message", data: msg });
  }
  return groups;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ user, size = 40 }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const initials = (user?.pseudo || "?")[0].toUpperCase();

  if (user?.photoProfil) {
    return (
      <img
        src={`${API_URL}${user.photoProfil}`}
        alt={user.pseudo}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ff0000, #8b0000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 900,
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function OfferBubble({ msg, currentUserId, onAccept, onRefuse }) {
  const isOwn = msg.expediteur?.id === currentUserId;
  const isPending = msg.statutOffre === "en attente";
  const isAccepted = msg.statutOffre === "accepte";
  const isRefused = msg.statutOffre === "refuse";

  const statusColors = {
    "en attente": "#f59e0b",
    accepte: "#22c55e",
    refuse: "#ef4444",
  };
  const statusLabels = {
    "en attente": "En attente",
    accepte: "Acceptée ✓",
    refuse: "Refusée ✗",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginBottom: 6,
      }}
    >
      <div
        style={{
          background: isOwn ? "#1c1c1c" : "#141414",
          border: `1.5px solid ${statusColors[msg.statutOffre] || "#444"}`,
          borderRadius: 12,
          padding: "14px 18px",
          maxWidth: 300,
          position: "relative",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 11,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          {isOwn ? "Vous avez fait une offre" : `Offre de ${msg.expediteur?.pseudo}`}
        </div>

        {/* Prices */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span
            style={{
              fontSize: 15,
              color: "#666",
              textDecoration: "line-through",
              fontWeight: 600,
            }}
          >
            {parseFloat(msg.article?.prix || 0)} €
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
            {parseFloat(msg.montantOffre)} €
          </span>
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 700,
            color: statusColors[msg.statutOffre] || "#888",
            background: `${statusColors[msg.statutOffre]}18` || "#33333318",
            borderRadius: 6,
            padding: "3px 8px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {statusLabels[msg.statutOffre] || msg.statutOffre}
        </div>

        {/* Accept / Refuse buttons — only for the destinataire when pending */}
        {!isOwn && isPending && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              id={`accept-offer-${msg.id}`}
              onClick={() => onAccept(msg)}
              style={{
                flex: 1,
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 0",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.target.style.opacity = 0.8)}
              onMouseLeave={e => (e.target.style.opacity = 1)}
            >
              Accepter
            </button>
            <button
              id={`refuse-offer-${msg.id}`}
              onClick={() => onRefuse(msg)}
              style={{
                flex: 1,
                background: "transparent",
                color: "#ef4444",
                border: "1.5px solid #ef4444",
                borderRadius: 8,
                padding: "8px 0",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.target.style.opacity = 0.7)}
              onMouseLeave={e => (e.target.style.opacity = 1)}
            >
              Refuser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TextBubble({ msg, currentUserId, onReport }) {
  const isOwn = msg.expediteur?.id === currentUserId;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginBottom: 4,
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {!isOwn && (
        <Avatar user={msg.expediteur} size={28} />
      )}
      <div
        style={{
          background: isOwn ? "#ff0000" : "#1e1e1e",
          color: "#fff",
          borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "10px 16px",
          maxWidth: "65%",
          fontSize: 14,
          lineHeight: 1.5,
          wordBreak: "break-word",
          boxShadow: isOwn ? "0 2px 12px rgba(255,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {msg.contenu}
      </div>
      {!isOwn && onReport && (
        <button
          onClick={() => onReport(msg)}
          title="Signaler ce message"
          style={{
            background: "transparent",
            border: "none",
            color: "#444",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.2s",
            alignSelf: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
          onMouseLeave={e => e.currentTarget.style.color = "#444"}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </button>
      )}
      {isOwn && (
        <Avatar user={msg.expediteur} size={28} />
      )}
    </div>
  );
}

// ─── Offer Modal ─────────────────────────────────────────────────────────────

function OfferModal({ article, onClose, onSubmit, loading }) {
  const [amount, setAmount] = useState("");
  const originalPrice = parseFloat(article?.prix || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      onSubmit(val);
    }
  };

  return (
    <div
      id="offer-modal-overlay"
      onClick={e => { if (e.target.id === "offer-modal-overlay") onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease",
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
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Faire une offre
        </h2>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
          Prix original :{" "}
          <span style={{ color: "#fff", fontWeight: 700 }}>{originalPrice} €</span>
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: "#aaa", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Votre offre (€)
          </label>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input
              id="offer-amount-input"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
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
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "#ff0000")}
              onBlur={e => (e.target.style.borderColor = "#333")}
            />
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#666", fontWeight: 700 }}>
              €
            </span>
          </div>

          {amount && !isNaN(parseFloat(amount)) && originalPrice > 0 && (
            <div style={{
              background: "#1a1a1a",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 13,
              color: "#aaa",
            }}>
              Réduction :{" "}
              <span style={{ color: parseFloat(amount) < originalPrice ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
                {originalPrice > 0 ? Math.round((1 - parseFloat(amount) / originalPrice) * 100) : 0}%
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
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
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => (e.target.style.borderColor = "#666")}
              onMouseLeave={e => (e.target.style.borderColor = "#333")}
            >
              Annuler
            </button>
            <button
              id="offer-submit-btn"
              type="submit"
              disabled={loading || !amount}
              style={{
                flex: 2,
                background: loading || !amount ? "#333" : "#ff0000",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                color: "#fff",
                fontWeight: 900,
                fontSize: 14,
                cursor: loading || !amount ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "background 0.2s, opacity 0.2s",
              }}
            >
              {loading ? "Envoi…" : "Envoyer l'offre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────

function ReportModal({ message, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason.trim());
    }
  };

  return (
    <div
      id="report-modal-overlay"
      onClick={e => { if (e.target.id === "report-modal-overlay") onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        style={{
          background: "#111",
          border: "1.5px solid #2a2a2a",
          borderRadius: 16,
          padding: "32px",
          width: "100%",
          maxWidth: 450,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ff4444", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          Signaler un message
        </h2>
        
        <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "14px 18px", marginBottom: 20, border: "1px solid #222" }}>
          <p style={{ color: "#888", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Message de {message.expediteur?.pseudo}
          </p>
          <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
            "{message.contenu}"
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: "#aaa", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Raison du signalement
          </label>
          <textarea
            id="report-reason-input"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Pourquoi signalez-vous ce message ? (ex: harcèlement, propos injurieux, spam...)"
            required
            rows={3}
            autoFocus
            style={{
              width: "100%",
              background: "#1a1a1a",
              border: "1.5px solid #333",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14,
              color: "#fff",
              outline: "none",
              resize: "none",
              transition: "border-color 0.2s",
              marginBottom: 24,
            }}
            onFocus={e => (e.target.style.borderColor = "#ff4444")}
            onBlur={e => (e.target.style.borderColor = "#333")}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
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
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => (e.target.style.borderColor = "#666")}
              onMouseLeave={e => (e.target.style.borderColor = "#333")}
            >
              Annuler
            </button>
            <button
              id="report-submit-btn"
              type="submit"
              disabled={loading || !reason.trim()}
              style={{
                flex: 2,
                background: loading || !reason.trim() ? "#333" : "#ff4444",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                color: "#fff",
                fontWeight: 900,
                fontSize: 14,
                cursor: loading || !reason.trim() ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "background 0.2s, opacity 0.2s",
              }}
            >
              {loading ? "Envoi…" : "Envoyer le signalement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Messagerie() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // All messages
  const [allMessages, setAllMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Active conversation
  const [activeConvKey, setActiveConvKey] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Input
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  // Offer modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingMessage, setReportingMessage] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Stripe Payment loading
  const [paymentLoading, setPaymentLoading] = useState(false);

  const bottomRef = useRef(null);
  const pollingRef = useRef(null);

  // ── Fetch all messages ──────────────────────────────────────────────────────

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const config = { headers: { Accept: "application/json" } };
      const [sent, received] = await Promise.all([
        api.get(`/messageries?expediteur.id=${user.id}&order[dateEnvoie]=DESC&itemsPerPage=100`, config),
        api.get(`/messageries?destinataire.id=${user.id}&order[dateEnvoie]=DESC&itemsPerPage=100`, config),
      ]);

      // application/json retourne un tableau direct, application/ld+json retourne { member: [] }
      const toArray = (data) => {
        if (Array.isArray(data)) return data;
        if (data?.member) return data.member;
        return [];
      };

      const sentList = toArray(sent.data);
      const receivedList = toArray(received.data);

      // Merge + deduplicate by id
      const merged = [...sentList, ...receivedList];
      const unique = Array.from(new Map(merged.map(m => [m.id, m])).values());
      // Sort DESC by date
      unique.sort((a, b) => new Date(b.dateEnvoie) - new Date(a.dateEnvoie));

      setAllMessages(unique);

      const convs = buildConversations(unique, user.id);
      setConversations(convs);

      // If URL has ?user=X&article=Y, auto-open that conversation
      if (!activeConvKey && convs.length > 0) {
        const targetUserId = searchParams.get("user");
        const targetArticleId = searchParams.get("article");

        if (targetUserId && targetArticleId) {
          const key = `${targetUserId}_${targetArticleId}`;
          const found = convs.find(c => c.key === key);
          if (found) setActiveConvKey(key);
          else setActiveConvKey(convs[0].key);
        } else {
          setActiveConvKey(convs[0].key);
        }
      }
    } catch (err) {
      console.error("Erreur fetchMessages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, searchParams, activeConvKey]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchMessages();
      // Polling toutes les 10s
      pollingRef.current = setInterval(fetchMessages, 10000);
    }
    return () => clearInterval(pollingRef.current);
  }, [user, token]);

  // Scroll to bottom when conversation changes or new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvKey, allMessages.length]);

  // ── Derived data for active conversation ─────────────────────────────────

  const activeConv = conversations.find(c => c.key === activeConvKey);

  const activeMessages = allMessages
    .filter(m => activeConvKey && conversationKey(m, user?.id) === activeConvKey)
    .sort((a, b) => new Date(a.dateEnvoie) - new Date(b.dateEnvoie));

  const groupedMessages = groupByDay(activeMessages);

  // ── Send message ────────────────────────────────────────────────────────────

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || sending) return;
    setSending(true);
    try {
      await api.post("/messageries", {
        contenu: inputText.trim(),
        estOffre: false,
        destinataire: `/api/users/${activeConv.otherUser?.id}`,
        article: activeConv.article ? `/api/articles/${activeConv.article.id}` : null,
      });
      setInputText("");
      await fetchMessages();
    } catch (err) {
      console.error("Erreur envoi message:", err);
    } finally {
      setSending(false);
    }
  };

  // ── Send offer ──────────────────────────────────────────────────────────────

  const handleSendOffer = async (amount) => {
    if (!activeConv) return;
    setOfferLoading(true);
    try {
      await api.post("/messageries", {
        contenu: `Offre de ${amount} € pour ${activeConv.article?.marque || "cet article"}`,
        estOffre: true,
        montantOffre: amount.toString(),
        destinataire: `/api/users/${activeConv.otherUser?.id}`,
        article: activeConv.article ? `/api/articles/${activeConv.article.id}` : null,
      });
      setShowOfferModal(false);
      await fetchMessages();
    } catch (err) {
      console.error("Erreur envoi offre:", err);
    } finally {
      setOfferLoading(false);
    }
  };

  const handleSendReport = async (reason) => {
    if (!reportingMessage) return;
    setReportLoading(true);
    try {
      await api.post("/signalements", {
        message: `/api/messageries/${reportingMessage.id}`,
        raison: reason,
      });
      setShowReportModal(false);
      setReportingMessage(null);
      setToastMessage("✓ Signalement envoyé avec succès !");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Erreur envoi signalement:", err);
      alert("Erreur lors de l'envoi du signalement.");
    } finally {
      setReportLoading(false);
    }
  };

  const handlePayArticle = async (articleId, price) => {
    setPaymentLoading(true);
    try {
      const response = await api.post("/create-checkout-session", {
        articleId,
        prix: price,
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Erreur de redirection de paiement.");
      }
    } catch (err) {
      console.error("Error creating checkout session", err);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // ── Accept / Refuse offer ────────────────────────────────────────────────────

  const handleAcceptOffer = async (msg) => {
    try {
      await api.patch(`/messageries/${msg.id}`, { statutOffre: "accepte" }, {
        headers: { "Content-Type": "application/merge-patch+json" },
      });
      await fetchMessages();
    } catch (err) {
      console.error("Erreur acceptation:", err);
    }
  };

  const handleRefuseOffer = async (msg) => {
    try {
      await api.patch(`/messageries/${msg.id}`, { statutOffre: "refuse" }, {
        headers: { "Content-Type": "application/merge-patch+json" },
      });
      await fetchMessages();
    } catch (err) {
      console.error("Erreur refus:", err);
    }
  };

  // ── Redirect if not logged in ────────────────────────────────────────────────

  if (!token) return null;

  // ── Render ───────────────────────────────────────────────────────────────────

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <>
      {/* Global styles for this page */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .msg-bubble { animation: slideUp 0.2s ease; }
        .conv-item { transition: background 0.15s ease; }
        .conv-item:hover { background: #161616 !important; }
        .conv-item.active { background: #1a1a1a !important; border-left: 3px solid #ff0000 !important; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 73px)",
          background: "#000",
          overflow: "hidden",
        }}
      >
        {/* ── Header barre ── */}
        <div
          style={{
            padding: "18px 28px",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#050505",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1a1a1a")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Messagerie
          </h1>
          {conversations.length > 0 && (
            <span
              style={{
                background: "#ff0000",
                color: "#fff",
                borderRadius: 20,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {conversations.length}
            </span>
          )}
        </div>

        {/* ── Main layout ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ══ LEFT PANEL — Conversations ══════════════════════════════════════ */}
          <div
            style={{
              width: 300,
              minWidth: 260,
              borderRight: "1px solid #1a1a1a",
              overflowY: "auto",
              background: "#050505",
              flexShrink: 0,
            }}
          >
            {loadingMessages ? (
              <div style={{ padding: 24, color: "#555", textAlign: "center", fontSize: 14 }}>
                Chargement…
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
                <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>
                  Aucun message pour l'instant.<br />
                  Contactez un vendeur depuis une fiche produit !
                </p>
              </div>
            ) : (
              conversations.map(conv => {
                const isActive = conv.key === activeConvKey;
                const lastMsg = conv.lastMessage;
                const isLastMine = lastMsg?.expediteur?.id === user?.id;

                return (
                  <div
                    key={conv.key}
                    className={`conv-item${isActive ? " active" : ""}`}
                    id={`conv-${conv.key}`}
                    onClick={() => setActiveConvKey(conv.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      borderLeft: isActive ? "3px solid #ff0000" : "3px solid transparent",
                      background: isActive ? "#1a1a1a" : "transparent",
                      borderBottom: "1px solid #0f0f0f",
                    }}
                  >
                    <Avatar user={conv.otherUser} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: isActive ? "#fff" : "#ddd" }}>
                          {conv.otherUser?.pseudo || "Utilisateur"}
                        </span>
                        <span style={{ fontSize: 11, color: "#555", flexShrink: 0, marginLeft: 6 }}>
                          {timeAgo(lastMsg?.dateEnvoie)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {conv.article?.marque || "Article"}
                        {conv.article?.taille ? ` · ${conv.article.taille}` : ""}
                        {lastMsg?.estOffre && (
                          <span style={{ marginLeft: 4, color: "#f59e0b", fontSize: 11 }}>
                            💰 Offre
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ══ RIGHT PANEL — Chat ══════════════════════════════════════════════ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {!activeConv ? (
              /* Empty state */
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#333" }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p style={{ fontSize: 15, color: "#444" }}>Sélectionnez une conversation</p>
              </div>
            ) : (
              <>
                {/* ── Product header ── */}
                <div
                  style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid #1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: "#080808",
                  }}
                >
                  {/* Product thumbnail */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      background: "#1a1a1a",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid #222",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {activeConv.article?.photos?.length > 0 ? (
                      <img
                        src={`${API_URL}${activeConv.article.photos[0].cheminFichier || activeConv.article.photos[0].url}`}
                        alt={activeConv.article.marque}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    )}
                  </div>

                  {/* Article info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <Avatar user={activeConv.otherUser} size={26} />
                      <span style={{ fontWeight: 800, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {activeConv.otherUser?.pseudo}
                      </span>
                    </div>
                    <p style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>
                      {[activeConv.article?.marque, activeConv.article?.taille, activeConv.article?.etat].filter(Boolean).join(" · ")}
                    </p>
                    {activeConv.article?.prix && (
                      <p style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>
                        {parseFloat(activeConv.article.prix)} €
                      </p>
                    )}
                  </div>

                  {/* View article button */}
                  {activeConv.article && (
                    <button
                      id="view-article-btn"
                      onClick={() => navigate(`/articles/${activeConv.article.id}`)}
                      style={{
                        background: "transparent",
                        border: "1.5px solid #333",
                        borderRadius: 8,
                        padding: "8px 14px",
                        color: "#aaa",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "border-color 0.2s, color 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff0000"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa"; }}
                    >
                      Voir l'annonce
                    </button>
                  )}

                  {/* Stripe Payment Button for Buyer — visible only when an offer is accepted */}
                  {activeConv.article && 
                   activeConv.article.vendeur?.id !== user?.id && 
                   activeConv.article.statut?.libelle === 'En vente' && 
                   activeMessages.some(m => m.estOffre && m.statutOffre === 'accepte') && (
                    <button
                      id="pay-article-btn"
                      disabled={paymentLoading}
                      onClick={() => {
                        const acceptedOffer = activeMessages.find(m => m.estOffre && m.statutOffre === 'accepte');
                        const priceToPay = acceptedOffer ? parseFloat(acceptedOffer.montantOffre) : parseFloat(activeConv.article.prix);
                        handlePayArticle(activeConv.article.id, priceToPay);
                      }}
                      style={{
                        background: "#ff0000",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 16px",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        cursor: paymentLoading ? "not-allowed" : "pointer",
                        opacity: paymentLoading ? 0.6 : 1,
                        flexShrink: 0,
                        transition: "opacity 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                      onMouseEnter={e => { if (!paymentLoading) e.currentTarget.style.opacity = 0.8; }}
                      onMouseLeave={e => { if (!paymentLoading) e.currentTarget.style.opacity = 1; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      {paymentLoading ? "Redirection..." : `Payer ${activeMessages.find(m => m.estOffre && m.statutOffre === 'accepte') ? parseFloat(activeMessages.find(m => m.estOffre && m.statutOffre === 'accepte').montantOffre) : parseFloat(activeConv.article.prix)} €`}
                    </button>
                  )}
                </div>

                {/* ── Messages zone ── */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {activeMessages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#444", fontSize: 14, marginTop: 40 }}>
                      Commencez la conversation…
                    </div>
                  ) : (
                    groupedMessages.map((item, idx) => {
                      if (item.type === "separator") {
                        return (
                          <div
                            key={`sep-${idx}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              margin: "12px 0",
                            }}
                          >
                            <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
                            <span style={{ fontSize: 11, color: "#555", textTransform: "capitalize", letterSpacing: "0.06em" }}>
                              {item.label}
                            </span>
                            <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
                          </div>
                        );
                      }
                      const msg = item.data;
                      return (
                        <div key={msg.id} className="msg-bubble">
                          {msg.estOffre ? (
                            <OfferBubble
                              msg={msg}
                              currentUserId={user?.id}
                              onAccept={handleAcceptOffer}
                              onRefuse={handleRefuseOffer}
                            />
                          ) : (
                            <TextBubble msg={msg} currentUserId={user?.id} onReport={(m) => { setReportingMessage(m); setShowReportModal(true); }} />
                          )}
                          {/* Timestamp under bubble */}
                          <div style={{
                            textAlign: msg.expediteur?.id === user?.id ? "right" : "left",
                            fontSize: 11,
                            color: "#444",
                            marginBottom: 6,
                            paddingRight: msg.expediteur?.id === user?.id ? 6 : 0,
                            paddingLeft: msg.expediteur?.id !== user?.id ? 36 : 0,
                          }}>
                            {new Date(msg.dateEnvoie).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* ── Input bar ── */}
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #1a1a1a",
                    background: "#080808",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <form
                    onSubmit={handleSendMessage}
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <input
                      id="message-input"
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Écrivez un message…"
                      style={{
                        flex: 1,
                        background: "#111",
                        border: "1.5px solid #222",
                        borderRadius: 12,
                        padding: "12px 18px",
                        fontSize: 14,
                        color: "#fff",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#ff0000")}
                      onBlur={e => (e.target.style.borderColor = "#222")}
                    />
                    <button
                      id="send-message-btn"
                      type="submit"
                      disabled={!inputText.trim() || sending}
                      style={{
                        background: inputText.trim() && !sending ? "#ff0000" : "#1a1a1a",
                        border: "none",
                        borderRadius: 12,
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: inputText.trim() && !sending ? "pointer" : "not-allowed",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-45deg)" }}>
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </form>

                  {/* Offer button */}
                  <button
                    id="make-offer-btn"
                    onClick={() => setShowOfferModal(true)}
                    style={{
                      background: "transparent",
                      border: "1.5px solid #2a2a2a",
                      borderRadius: 10,
                      padding: "10px 16px",
                      color: "#aaa",
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff0000"; e.currentTarget.style.color = "#ff0000"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#aaa"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Faire une offre
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Offer Modal ── */}
      {showOfferModal && activeConv && (
        <OfferModal
          article={activeConv.article}
          onClose={() => setShowOfferModal(false)}
          onSubmit={handleSendOffer}
          loading={offerLoading}
        />
      )}

      {/* ── Report Modal ── */}
      {showReportModal && reportingMessage && (
        <ReportModal
          message={reportingMessage}
          onClose={() => { setShowReportModal(false); setReportingMessage(null); }}
          onSubmit={handleSendReport}
          loading={reportLoading}
        />
      )}

      {/* ── Toast ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: "90px", right: "24px", zIndex: 9999,
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid #10b981",
          borderRadius: "10px", padding: "14px 20px",
          color: "#6ee7b7",
          fontWeight: "700", fontSize: "14px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toastMessage}
        </div>
      )}
    </>
  );
}
