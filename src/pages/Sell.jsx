import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function Sell() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    categorie: "",
    marque: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return <div className="p-8">Veuillez vous connecter pour vendre</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/articles", formData);
      setSuccess(true);
      setFormData({
        titre: "",
        description: "",
        prix: "",
        categorie: "",
        marque: "",
      });
    } catch (err) {
      setError("Erreur lors de la création de l'article");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Vendre un article</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
            Article créé avec succès!
          </div>
        )}

        <div className="mb-4">
          <label className="block font-bold mb-2">Titre</label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Prix</label>
          <input
            type="number"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Catégorie</label>
          <input
            type="text"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Marque</label>
          <input
            type="text"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Publication..." : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}
