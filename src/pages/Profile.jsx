import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, token } = useAuth();

  if (!token) {
    return <div className="p-8">Veuillez vous connecter</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      <div className="max-w-2xl mx-auto border border-gray-200 rounded-lg p-8">
        <p className="text-gray-600">Profil utilisateur en construction...</p>
      </div>
    </div>
  );
}
