import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Second Round
        </Link>

        <div className="flex gap-4">
          <Link to="/" className="hover:text-purple-600">
            Articles
          </Link>

          {token ? (
            <>
              <Link to="/sell" className="hover:text-purple-600">
                Vendre
              </Link>
              <Link to="/profile" className="hover:text-purple-600">
                Profil
              </Link>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Connexion
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
