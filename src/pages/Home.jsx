import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        // API Platform retourne les données dans la propriété 'member'
        setArticles(response.data.member || response.data);
      } catch (err) {
        setError("Erreur lors du chargement des articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Articles disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg"
          >
            <h2 className="font-bold text-lg mb-2">{article.titre}</h2>
            <p className="text-gray-600 mb-4">{article.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-purple-600">
                {article.prix}€
              </span>
              <a
                href={`/articles/${article.id}`}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Voir
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
