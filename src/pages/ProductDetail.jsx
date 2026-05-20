import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError("Article non trouvé");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!article) return <div className="p-8">Article non trouvé</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{article.titre}</h1>

        <div className="bg-gray-100 w-full h-96 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-gray-400">Image non disponible</span>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">{article.description}</p>
          <div className="text-3xl font-bold text-purple-600 mb-4">
            {article.prix}€
          </div>
        </div>

        <div className="flex gap-4">
          <button className="bg-purple-600 text-white px-8 py-3 rounded font-bold hover:bg-purple-700">
            Acheter
          </button>
          <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded font-bold hover:bg-purple-50">
            Contacter le vendeur
          </button>
        </div>
      </div>
    </div>
  );
}
