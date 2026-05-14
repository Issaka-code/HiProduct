---
trigger: always_on
---

HiProduct - Règles Strictes de Design & Architecture
Ce document définit les règles absolues à respecter pour tout développement futur sur la plateforme HiProduct, afin de garantir une cohérence visuelle "Premium", moderne et unifiée, basée sur l'excellente réception de la page Ads Explorer.

1. Philosophie Visuelle (Glassmorphism & Deep Tech)
Le design doit évoquer une technologie avancée, fluide et premium. L'interface n'est pas plate ; elle superpose des calques transparents sur un fond sombre dynamique.

Dark Mode natif : L'application est fondamentalement pensée pour le thème sombre (--background: 230 35% 5%). Les fonds sont profonds, jamais totalement noirs.
Glassmorphism Obligatoire : Les conteneurs flottants (menus, modales, barres de filtres) DOIVENT utiliser des effets de verre.
Classe de base : backdrop-blur-3xl bg-secondary/40 ou bg-black/40.
Utilitaire personnalisé : Utilisez la classe CSS globale .glass-panel pour les petits badges ou boutons superposés à des médias.
Bordures subtiles : Les éléments vitrés doivent toujours avoir une bordure très fine et semi-transparente (ex: border-white/5 ou border-primary/10).
2. Effets de Lumière et "Glow"
L'interface utilise la lumière pour guider l'œil et créer de la profondeur.

Halo d'interaction : Les cartes principales utilisent la classe .neo-card. Au survol, elles doivent s'élever (-translate-y-2) et émettre une lueur primaire (box-shadow lié à --glow).
Blobs dynamiques : Le fond de l'application possède des gradients radiaux animés (--blob-1, --blob-2). Ne pas couvrir l'arrière-plan avec des couleurs pleines (bg-black ou bg-white 100%) ; laissez l'arrière-plan respirer.
Boutons d'Appel à l'Action (CTA) : Les boutons principaux utilisent la couleur primaire avec une ombre portée colorée (shadow-[0_10px_30px_rgba(124,58,237,0.4)]), s'intensifiant au survol.
3. Typographie "Bold & Crisp"
La hiérarchie de l'information s'obtient par des contrastes extrêmes de taille et de graisse.

Polices : Plus Jakarta Sans (pour le texte général) et Outfit (pour les titres/chiffres).
Sur-titres & Badges : Toujours très petits, gras, espacés et en majuscules.
Règle CSS : text-[10px] font-black uppercase tracking-widest text-muted-foreground.
Titres & Valeurs : Massifs, denses.
Règle CSS : font-black text-lg ou text-xl avec leading-tight.
Gradients textuels : Utilisez la classe .gradient-text-new pour mettre en évidence certains titres clés ou métriques sans alourdir l'interface.
4. Micro-Interactions et Animations
L'interface doit sembler "vivante". Aucun changement d'état ne doit être brut.

Transitions universelles : Tout élément cliquable ou survolable DOIT avoir transition-all duration-300 (ou 500 pour les grands éléments).
Boutons : Tout bouton doit avoir un retour tactile simulé via active:scale-95.
Révélation au survol : Utilisez le motif group / group-hover pour masquer les actions secondaires (comme les boutons Share ou Bookmark sur les cartes) et les révéler (opacity-0 translate-y-4 vers opacity-100 translate-y-0) uniquement lorsque l'utilisateur se concentre sur l'élément.
Menus déroulants : Ne doivent pas apparaître d'un coup sec. Ils doivent combiner opacity, scale (ex: scale-95 vers scale-100) et blur lors de l'ouverture.
5. Règles de Code React & Tailwind
Groupement des classes : Préférez utiliser des classes personnalisées dans @layer components si la liste de classes Tailwind dépasse 2 lignes, particulièrement pour les conteneurs réutilisables (comme .neo-card).
Z-Index : Soyez discipliné.
Fonds dynamiques : -1
Cartes et contenu normal : 10
Filtres flottants : 30
Menus déroulants (Popovers/Tooltips) : 50
Icônes : Utilisez exclusivement la bibliothèque lucide-react. La taille standard des icônes est w-4 h-4 ou w-5 h-5. Elles accompagnent presque toujours le texte.
IMPORTANT

RÈGLE D'OR : Si un composant semble "plat", statique (sans hover/active), utilise des couleurs pleines sans transparence, ou a un texte générique sans traitement de graisse/espacement, il est refusé. Le design doit être premium.