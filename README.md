# 🥊 Second Round — Frontend Application

L'interface client de **Second Round**, la plateforme communautaire haut de gamme de vente et d'achat d'équipements de boxe d'occasion.

Cette application est construite avec **Vite**, **React 18**, **React Router 6**, **Tailwind CSS** (pour le layout global) et du **CSS Vanilla** personnalisé pour un rendu esthétique et premium en mode sombre. Elle communique avec le backend d'API Platform.

---

## 🌟 Fonctionnalités majeures

### 🔑 Authentification & Sécurité
- **Inscription & Connexion** : Formulaires optimisés avec gestion dynamique des erreurs serveur (ex: affichage des comptes bannis).
- **Contexte d'authentification** : Gestion persistante du JWT via LocalStorage avec déconnexion automatique en cas de token expiré ou de compte suspendu.

### 👕 Catalogue & Recherche
- **Recherche globale** : Barre de recherche instantanée avec redirection vers le catalogue.
- **Filtres multicritères** : Filtrage dynamique des produits par Catégorie, Taille, Marque, État et Prix.
- **Badges de Certification** : Intégration du badge circulaire de certification vert émeraude (`✓`) en haut à droite des articles certifiés.

### 🔎 Fiche Produit
- **Détails de l'article** : Affichage complet des photos, état, description et caractéristiques.
- **Ajout aux Favoris** : Système de coup de cœur (`♥`) persistant.
- **CTAs interactifs** : 
  - Bouton **"Envoyer un message"** : Initie une discussion en envoyant un message automatique de disponibilité.
  - Bouton **"Faire une offre"** : Ouvre une modale de saisie de prix pour faire une proposition financière.

### 💬 Messagerie & Offres
- **Messagerie temps réel (Polling)** : Système de chat bidirectionnel.
- **Négociation** : Bulles d'offre interactives permettant à l'autre participant d'accepter ou refuser directement les offres.
- **Signalement (Modération)** : Icône drapeau `🚩` à côté des messages reçus pour signaler tout comportement inapproprié.

### 👤 Vestiaire (Profil)
- **Mon Vestiaire** : Visualisation du profil, des articles mis en vente, de la section **Mes Favoris** (visible uniquement par le propriétaire du compte) et de l'historique des évaluations.
- **Édition de Profil** : Modification du pseudo, taille, poids, niveau, type de boxe et upload d'avatar personnalisé.

### 🛡️ Panel Administration (`/admin`)
- **Certification manuelle** : Tableau de bord pour certifier/décertifier manuellement les articles avec un badge.
- **Gestion des signalements** : Interface dédiée listant les messages signalés avec la raison et l'auteur.
- **Sanction immédiate** : Possibilité de sanctionner (bannir définitivement) l'auteur du message signalé ou d'ignorer le signalement.

---

## 📂 Structure du Projet

```text
second_round_front/
├── public/                # Assets publics du navigateur
├── src/
│   ├── assets/            # Images et logos locaux
│   ├── components/        # Composants réutilisables (Header, Footer, etc.)
│   ├── context/           # Contexte global (AuthContext)
│   ├── hooks/             # Hooks React personnalisés (useAuth)
│   ├── pages/             # Pages et vues de l'application
│   │   ├── Home.jsx       # Accueil
│   │   ├── Catalogue.jsx  # Grille produits et filtres
│   │   ├── ProductDetail.jsx # Détail article
│   │   ├── Messagerie.jsx # Système de chat et d'offres
│   │   ├── AdminPanel.jsx # Espace de modération et certification
│   │   ├── Login.jsx / Register.jsx # Identification
│   │   ├── Profile.jsx / ProfileEdit.jsx # Gestion vestiaire
│   │   └── SellLanding.jsx / SellForm.jsx # Publication d'articles
│   ├── services/          # Client API HTTP (Axios)
│   ├── App.jsx            # Configuration des routes
│   ├── index.css          # Design system, variables CSS et styles globaux
│   └── main.jsx           # Point d'entrée React
└── vite.config.js         # Configuration du bundler Vite
```

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** (v18 ou supérieure)
- **npm** (v9 ou supérieure)
- Le serveur Backend (API Platform) lancé sur `http://localhost:8000`

### 1. Installation
Installez les dépendances du projet :
```bash
npm install
```

### 2. Configuration (.env)
Créez un fichier `.env.local` à la racine du dossier front-end et renseignez l'URL de votre API :
```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Lancement du serveur de développement
Démarrez l'application localement :
```bash
npm run dev
```
L'application s'ouvrira par défaut à l'adresse suivante : [http://localhost:5173](http://localhost:5173)

### 4. Build de Production
Pour compiler l'application en vue d'un déploiement :
```bash
npm run build
```

---

## 🗺️ Cartographie des Routes

L'application utilise `react-router-dom` pour le routage :

| Route | Description | Accès |
| :--- | :--- | :--- |
| `/` | Page d'accueil | Public |
| `/catalogue` | Catalogue d'articles avec filtres | Public |
| `/articles/:id` | Fiche produit détaillée | Public |
| `/login` | Page de connexion | Public |
| `/register` | Page de création de compte | Public |
| `/profile` | Espace Vestiaire (articles, favoris, avis) | Public / Privé |
| `/profile/edit` | Modification des infos et avatar | Connecté |
| `/sell` | Page de préparation de vente | Connecté |
| `/sell/form` | Formulaire d'ajout d'article | Connecté |
| `/messages` | Messagerie & Offres d'achat | Connecté |
| `/admin` | Panel de certification et modération | Administrateur |
