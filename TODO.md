# 🥊 Todo List - Intégration Second Round

## 1. Header & Navigation Globale (`Header.jsx`)
- [ ] **Menu Mobile** : Gérer l'état `isMenuOpen` pour afficher/masquer le menu burger sur mobile.
- [ ] **Barre de recherche** : Lier l'input de recherche du Header avec la logique de filtrage des articles (actuellement gérée localement dans `Home.jsx`).
- [ ] **Icônes Utilisateur** : Créer des menus déroulants (dropdown) au clic sur les icônes (Profil, Panier/Favoris, Paramètres).
- [ ] **État de connexion** : Afficher dynamiquement la photo de profil de l'utilisateur ou son pseudo via le `AuthContext` au lieu des icônes génériques s'il est connecté.

## 2. Page d'Accueil - Vue Connecté (`Home.jsx`)
- [ ] **Harmonisation du design** : La vue "non-connecté" a un design agressif et immersif (background complet, typographie XXL). La vue "connecté" est actuellement une simple grille. Il faut lui appliquer l'identité visuelle de la marque (Typo, couleurs, bordures).
- [ ] **Intégration du composant `ProductCard`** : Remplacer le rendu en dur de la grille d'articles par le composant `ProductCard.jsx` qui a déjà été créé.
- [ ] **Filtres et Catégories** : Ajouter des boutons ou un menu latéral pour filtrer par type (Gants, Casques, Vêtements, etc.).

## 3. Page Produit (`ProductDetail.jsx`)
- [ ] **Design de la page** : Remplacer le div gris "Image non disponible" par une vraie galerie d'images du produit.
- [ ] **Informations Vendeur** : Afficher les informations du vendeur (pseudo, note, bouton pour voir son vestiaire).
- [ ] **Boutons d'action** : Styliser les boutons "Acheter" et "Contacter le vendeur" avec le style rectangulaire/agressif (angles droits, bordures épaisses) vu sur `Login.jsx`.
- [ ] **État de l'article** : Afficher dynamiquement la taille, la marque, la catégorie et l'état d'usure de l'article.

## 4. Page Profil & Vestiaire (`Profile.jsx`)
- [ ] **Mise en page globale** : Coder l'interface (actuellement "Profil utilisateur en construction...").
- [ ] **Onglets de navigation** : Ajouter une navigation interne (Mon Vestiaire / Mes Achats / Mes Ventes / Paramètres).
- [ ] **Affichage du "Vestiaire"** : Récupérer et afficher les articles mis en vente par l'utilisateur connecté.
- [ ] **Modification du profil** : Créer un formulaire permettant à l'utilisateur de modifier sa taille, son poids et son type de boxe (pour des recommandations personnalisées).

## 5. Page de Vente (`Sell.jsx`)
- [ ] **Upload d'images** : Ajouter un système de drag & drop ou un input `type="file"` pour permettre au vendeur d'ajouter des photos de son équipement (essentiel pour une marketplace).
- [ ] **Stylisation du formulaire** : Appliquer le même style de formulaire que sur la page `Register.jsx` (fonds sombres, inputs avec `!border-slate-700`, bordures rouges au focus).
- [ ] **Bouton de validation** : Transformer le bouton "Publier l'article" avec le style imposant (hauteur 80px, typo black uppercase).

## 6. Composants Réutilisables & UI
- [ ] **Footer Global** : Le footer est actuellement codé en dur dans `Home.jsx`. Il faudrait l'extraire dans un fichier `Footer.jsx` et l'ajouter dans `App.jsx` (sous `<Routes>`) pour qu'il soit visible sur toutes les pages.
- [ ] **Composant ProductCard** : Mettre à jour `ProductCard.jsx` pour qu'il affiche la vraie image de l'article provenant du backend au lieu du rectangle gris.
- [ ] **Système de Toast / Notifications** : Remplacer les div d'erreur/succès basiques par un système de notifications global (ex: react-toastify) lors de la création d'un article ou d'une inscription.

## 7. Optimisations et Sécurité
- [ ] **Gestion des accès** : Créer des routes protégées (Protected Routes) pour bloquer l'accès manuel aux URLs `/sell` et `/profile` si le token est absent.
- [ ] **Gestion des erreurs d'images** : Ajouter un fallback (image par défaut) si `HERO_IMAGE` ou l'image d'un produit ne se charge pas.
