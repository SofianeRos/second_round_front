# Second Round Front

Application front-end React pour le projet Second Round. L'interface est construite avec Vite, React Router et Tailwind CSS, et communique avec une API locale.

## Fonctionnalités

- Page d'accueil avec fond plein écran et boutons d'accès
- Connexion utilisateur
- Inscription utilisateur
- Détail d'article
- Profil utilisateur
- Page de vente

## Prérequis

- Node.js 18 ou supérieur
- npm
- Backend accessible sur `http://localhost:8000`

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

L'application démarre généralement sur `http://localhost:5173` ou le port disponible proposé par Vite.

## Scripts disponibles

- `npm run dev` : lance le serveur de développement
- `npm run build` : génère la version de production
- `npm run preview` : prévisualise la build locale
- `npm run lint` : lance ESLint sur le projet

## Routes

- `/` : accueil
- `/login` : connexion
- `/register` : inscription
- `/articles/:id` : détail d'un article
- `/profile` : profil utilisateur
- `/sell` : page de vente

## API

Le front consomme principalement les endpoints suivants :

- `POST /login_check`
- `POST /register`
- `GET /articles`
- `GET /profile`
- `POST /logout`

## Structure du projet

- `src/pages` : pages principales
- `src/components` : composants réutilisables
- `src/context` : contexte d'authentification
- `src/hooks` : hooks personnalisés
- `src/services` : configuration et appels API

## Remarques

Les images utilisées dans l'interface sont servies depuis le backend local, notamment le fond principal et le logo de la page d'accueil.
