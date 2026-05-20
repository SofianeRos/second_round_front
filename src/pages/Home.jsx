import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

// Images du backend
const HERO_IMAGE = "http://localhost:8000/images/background.png";
const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Home() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        setArticles(response.data.member || response.data);
        setFilteredArticles(response.data.member || response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.categorie.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  if (!token) {
    return (
      <div className="w-full flex-grow flex flex-col">
        {/* Hero Section - Image du backend */}
        <section
          className="w-full flex-grow min-h-[calc(100vh-60px)] bg-black relative flex items-center justify-end overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%), url('${HERO_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Contenu - Aligné à droite */}
          <div className="relative z-10 pr-6 md:pr-12 lg:pr-20 flex items-center justify-end w-full h-full">
            {/* Groupe logo + boutons */}
            <div className="flex flex-col items-end gap-6">
              {/* Logo Image - Aligné à droite */}
              <img
                src={LOGO_URL}
                alt="2ROUND Logo"
                className="w-[400px] md:w-[600px] lg:w-[800px] xl:w-[950px] h-auto object-contain drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.8))" }}
              />

              {/* Boutons d'action - Alignés à droite */}
              <div className="flex flex-col gap-4 w-[400px] md:w-[600px] lg:w-[800px] xl:w-[950px]">
                <Link
                  to="/login"
                  className="w-full text-center px-8 py-4 md:py-5 lg:py-6 border-2 border-white text-white font-bold text-base md:text-lg lg:text-xl xl:text-2xl hover:bg-white hover:text-black transition duration-300 uppercase tracking-wide"
                >
                  Créer mon profil
                </Link>
                <Link
                  to="/sell"
                  className="w-full text-center px-8 py-4 md:py-5 lg:py-6 border-2 border-white text-white font-bold text-base md:text-lg lg:text-xl xl:text-2xl hover:bg-white hover:text-black transition duration-300 uppercase tracking-wide"
                >
                  Commencer à vendre
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Page pour les utilisateurs connectés
  return (
    <section className="w-full bg-black px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8">
          Les articles disponibles
        </h2>

        {/* Search Bar */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
          />
        </div>

        {loading ? (
          <div className="text-white text-center py-12">Chargement...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            Aucun article trouvé
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-600 transition group"
              >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition">
                  <span className="text-gray-600">{article.categorie}</span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 line-clamp-2">
                    {article.marque} - {article.taille}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {article.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-600">
                      {article.prix}€
                    </span>
                    <Link
                      to={`/articles/${article.id}`}
                      className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition text-sm"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
