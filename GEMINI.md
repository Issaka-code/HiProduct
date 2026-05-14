# HiProduct - E-commerce Intelligence OS 🚀

Ce fichier sert de référence centrale pour tout modèle IA travaillant sur ce projet. Il résume l'architecture, le design et les fonctionnalités de HiProduct.

---

## 📋 Description du Projet
HiProduct est une plateforme avancée de recherche de produits gagnants (Winning Products) pour l'E-commerce. Elle permet aux entrepreneurs d'espionner les publicités (Meta, TikTok), de traquer des marques, de sourcer des fournisseurs et d'utiliser l'IA pour détecter les prochaines tendances.

## 🛠 Technologies Utilisées
- **Framework** : Next.js 14 (App Router)
- **Base de données** : Supabase (@supabase/supabase-js)
- **Langage** : TypeScript
- **Stylisation** : TailwindCSS (Styles Premium / Glassmorphism)
- **Icônes** : Lucide React
- **Gestion d'État** :
  - **Zustand** : Pour le système de notifications (Toasts) global.
  - **React Hooks** : `useState`, `useEffect`, `useRef` pour l'interactivité.
  - **LocalStorage** : Pour la persistance du profil utilisateur, du Swipe File et des paramètres.
- **Animations** : Tailwind Animate, Custom CSS keyframes.

## ✨ Fonctionnalités Implémentées

### 1. Dashboard & Navigation
- **Sidebar Interactive** : Navigation fluide entre les outils.
- **Header Premium** : Barre de recherche, sélecteur de thème (Clair/Sombre) et menu profil dynamique.
- **Système de Toast** : Notifications personnalisées (Success, Error, Info) avec design glassmorphism.

### 2. Outils de Recherche
- **Ads Explorer** : Filtrage avancé des publicités par plateforme, pays, date et engagement.
- **AdCard & Modal** : Cartes publicitaires interactives avec analyse détaillée du produit.
- **Swipe File** : Système de sauvegarde locale des publicités préférées.

### 3. Intelligence & Sourcing
- **AI Winner Agent** : Interface dédiée à la détection IA de produits.
- **Speed Sourcing** : Annuaire de fournisseurs (Alibaba, CJDropshipping, Zendrop) avec recherche intégrée.
- **Brand Tracker** : Surveillance de marques spécifiques.

### 4. Gestion Utilisateur & Monétisation
- **Authentification (Supabase Auth)** : Pages de connexion et d'inscription avec gestion sécurisée des sessions.
- **Profil Dynamique** : Modification en temps réel du nom, de l'email et de la photo de profil (avec persistance DB).
- **Pricing & Subscription** : Page de tarification avec 3 plans, toggle mensuel/annuel et simulateur d'abonnement.

## 📁 Structure des Fichiers Clés
```text
/app
  /(auth)
    /login         -> Page de connexion
    /signup        -> Page d'inscription
  /(dashboard)
    /explorer      -> Ads Explorer page
    /tracker       -> Brand Tracker page
    /swipe-file    -> Saved ads page
    /pricing       -> Subscription plans page
    /settings      -> Profile & App settings page
    /sourcing      -> Supplier search page
/components
  /ads
    AdCard.tsx     -> Composant carte pub
    FilterBar.tsx  -> Barre de filtres complexe
  /shared
    Header.tsx     -> Header avec profil dynamique
    Sidebar.tsx    -> Barre de navigation
    Toast.tsx      -> Système de notifications
/lib
  supabase.ts      -> Client Supabase configuré
  store.ts         -> Store Zustand pour les Toasts
/public            -> Assets statiques
```

## 🎨 Philosophie du Design (Strict)
- **Glassmorphism** : Utilisation intensive de `backdrop-blur`, `bg-white/5` et `border-white/10`.
- **Gradients** : Couleurs primaires basées sur le violet (`#7c3aed`) et le rose (`#db2777`).
- **Typographie** : "Plus Jakarta Sans" pour le texte, "Outfit" pour les titres.
- **Effets "Glow"** : Ombres portées colorées et halos lumineux (`radial-gradient`) en arrière-plan.
- **Micro-interactions** : Transitions de 300ms, effets de survol (`scale-105`), et animations d'entrée.

## 🤖 Instructions pour le futur modèle IA
1. **Ne pas casser le design** : Si vous ajoutez un composant, utilisez obligatoirement les classes `.glass-panel` ou `.neo-card` définies dans `globals.css`.
2. **Utiliser les Toasts** : Remplacez toujours `alert()` par le hook `addToast()` du store Zustand.
3. **Persistance** : Si une donnée doit être sauvegardée (ex: nouveau réglage), utilisez `localStorage` avec une clé préfixée par `hiproduct-`.
4. **Navigation** : Utilisez `useRouter` de `next/navigation` pour les redirections internes.
5. **SEO** : Chaque nouvelle page doit utiliser les balises sémantiques HTML5 appropriées.

---
*Dernière mise à jour : 14 Mai 2026*
