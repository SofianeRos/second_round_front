import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const HERO_IMAGE = "http://localhost:8000/images/background.png";
const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
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
    const filtered = articles.filter((article) =>
      (article.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.marque || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.categorie || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  if (!token) {
    return (
      <div className="w-full flex-grow flex flex-col bg-black">
        <section
          className="w-full flex-grow min-h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%), url('${HERO_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 flex flex-col items-center gap-12 pr-8 md:pr-16 lg:pr-[10%]">
            <img src={LOGO_URL} alt="2ROUND Logo" className="w-[500px] md:w-[700px] lg:w-[850px] xl:w-[950px] h-auto object-contain" />
            
            <div className="flex flex-col gap-8 w-full max-w-[550px]">
              <button
                onClick={() => navigate("/login")}
                className="w-full h-[80px] flex items-center justify-center text-[#ffffff] uppercase bg-transparent border-[4px] border-[#ffffff] font-extrabold text-2xl md:text-3xl hover:bg-[#ff0000] hover:border-[#ff0000] transition-all duration-300 tracking-wider shadow-2xl cursor-pointer"
              >
                Créer mon profil
              </button>
              <button
                onClick={() => navigate("/sell")}
                className="w-full h-[80px] flex items-center justify-center text-[#ffffff] uppercase bg-transparent border-[4px] border-[#ffffff] font-extrabold text-2xl md:text-3xl hover:bg-[#ff0000] hover:border-[#ff0000] transition-all duration-300 tracking-wider shadow-2xl cursor-pointer"
              >
                Commencer à vendre
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="w-full bg-black px-4 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Les articles disponibles</h2>
        <div className="mb-12">
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 text-white focus:border-[#ff0000] focus:outline-none transition"
          />
        </div>

        {loading ? (
          <div className="text-white text-center py-12">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#ff0000] transition group">
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-600">{article.categorie}</div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{article.marque} - {article.taille}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-[#ff0000]">{article.prix}€</span>
                    <Link to={`/articles/${article.id}`} className="bg-[#ff0000] text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition text-sm">Voir</Link>
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