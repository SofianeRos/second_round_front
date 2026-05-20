import { Link } from "react-router-dom";

export default function ProductCard({ article }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
        <span className="text-gray-400">Image</span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.titre}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-purple-600">
            {article.prix}€
          </span>
          <Link
            to={`/articles/${article.id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
          >
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
}
