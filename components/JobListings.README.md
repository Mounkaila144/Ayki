# JobListings Component

## 📋 Description

Le composant `JobListings` est un composant React complet pour afficher, rechercher et filtrer les offres d'emploi dans le dashboard candidat. Il offre une interface utilisateur moderne et responsive avec des fonctionnalités avancées de recherche et de filtrage.

## ✨ Fonctionnalités

### 🔍 Recherche et Filtrage
- **Recherche textuelle** : Par titre, description, entreprise, localisation, compétences
- **Filtres avancés** :
  - Type de contrat (temps plein, temps partiel, freelance, stage, etc.)
  - Niveau d'expérience (débutant, junior, intermédiaire, senior, lead, exécutif)
  - Politique de télétravail (bureau, hybride, télétravail complet, flexible)
  - Localisation géographique
  - Fourchette de salaire (minimum et maximum)

### 📱 Interface Utilisateur
- **Design responsive** : S'adapte à tous les écrans (mobile, tablette, desktop)
- **Cartes d'offres** : Affichage clair avec informations essentielles
- **Modal de détails** : Vue détaillée de chaque offre avec toutes les informations
- **Badges visuels** : Indication des offres urgentes et en vedette
- **États de chargement** : Skeletons pendant le chargement des données
- **Gestion d'erreur** : Messages d'erreur clairs avec possibilité de réessayer

### 🎯 Actions Utilisateur
- **Voir les détails** : Modal complète avec toutes les informations de l'offre
- **Postuler** : Bouton de candidature (à implémenter)
- **Sauvegarder** : Marquer une offre comme favorite (à implémenter)
- **Partager** : Partager une offre (à implémenter)

## 🏗️ Architecture

### Composants Principaux

1. **JobListings** : Composant principal avec logique de recherche et filtrage
2. **JobCard** : Carte individuelle pour chaque offre
3. **JobDetailsModal** : Modal de détails complet
4. **JobListingsDemo** : Version de démonstration avec données mockées

### Hooks Personnalisés

- **useJobListings** : Gestion de l'état des offres et des filtres
- **useJobActions** : Actions sur les offres (candidature, sauvegarde)

### Utilitaires

- **job-constants.ts** : Constantes et fonctions utilitaires
- **JobListings.module.css** : Styles CSS personnalisés

## 🚀 Utilisation

### Installation

```bash
# Les dépendances sont déjà incluses dans le projet
npm install
```

### Utilisation de Base

```tsx
import JobListings from "@/components/JobListings";

function CandidateDashboard() {
  return (
    <div>
      <JobListings className="w-full" />
    </div>
  );
}
```

### Utilisation avec Démonstration

```tsx
import JobListingsDemo from "@/components/JobListingsDemo";

function TestPage() {
  return (
    <div>
      <JobListingsDemo className="w-full" />
    </div>
  );
}
```

## 🔧 Configuration

### Variables d'Environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Endpoints

- `GET /api/jobs` : Récupération des offres d'emploi
- `POST /api/jobs/:id/apply` : Candidature à une offre
- `POST /api/jobs/:id/save` : Sauvegarder une offre
- `DELETE /api/jobs/:id/save` : Supprimer une sauvegarde

## 📊 Structure des Données

### Interface JobOffer

```typescript
interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  employmentType: string;
  experienceLevel: string;
  remotePolicy: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  salaryPeriod?: string;
  positions?: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
  status: string;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
    industry?: string;
  };
  recruiter?: {
    id: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}
```

### Filtres Disponibles

```typescript
interface JobFilters {
  searchTerm: string;
  employmentType: string;
  experienceLevel: string;
  remotePolicy: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
}
```

## 🎨 Personnalisation

### Styles CSS

Le composant utilise Tailwind CSS avec des classes personnalisées définies dans `JobListings.module.css` :

- `.jobCard` : Styles pour les cartes d'offres
- `.filterSection` : Styles pour la section de filtres
- `.modalContent` : Styles pour le contenu du modal

### Thème

Le composant s'adapte automatiquement au thème de l'application (clair/sombre) grâce aux variables CSS de shadcn/ui.

## 🔒 Authentification

Le composant gère automatiquement l'authentification :

- Récupération du token depuis `localStorage`
- Transmission du token dans les headers des requêtes API
- Gestion des erreurs d'authentification (401)

## 📱 Responsive Design

### Breakpoints

- **Mobile** : < 640px - Layout en colonne unique
- **Tablette** : 640px - 1024px - Layout adaptatif
- **Desktop** : > 1024px - Layout complet avec filtres latéraux

### Adaptations Mobile

- Filtres en modal sur mobile
- Boutons d'action en pleine largeur
- Cartes optimisées pour les petits écrans

## 🧪 Tests

### Composant de Démonstration

Le composant `JobListingsDemo` permet de tester l'interface sans backend :

```bash
# Lancer le serveur de développement
npm run dev

# Aller sur /dashboard/candidate
# Cliquer sur l'onglet "Annonces"
```

### Tests avec API

```bash
# Lancer le backend
cd ayki_backend && npm run start:dev

# Lancer le frontend
npm run dev

# Tester avec authentification
```

## 🚀 Déploiement

### Production

1. Remplacer `JobListingsDemo` par `JobListings` dans le dashboard
2. Configurer les variables d'environnement
3. S'assurer que l'API backend est accessible

```tsx
// Dans app/dashboard/candidate/page.tsx
<JobListings className="w-full" />
// Au lieu de
<JobListingsDemo className="w-full" />
```

## 🔮 Fonctionnalités Futures

### À Implémenter

- [ ] **Candidature en un clic** : Système de candidature rapide
- [ ] **Sauvegarde d'offres** : Système de favoris
- [ ] **Notifications** : Alertes pour nouvelles offres
- [ ] **Recommandations** : Offres suggérées basées sur le profil
- [ ] **Historique** : Suivi des candidatures
- [ ] **Partage social** : Partage sur réseaux sociaux
- [ ] **Export PDF** : Export des offres en PDF
- [ ] **Recherche géographique** : Carte interactive
- [ ] **Filtres avancés** : Plus de critères de filtrage
- [ ] **Tri personnalisé** : Tri par pertinence, date, salaire

### Améliorations Techniques

- [ ] **Pagination** : Chargement par pages
- [ ] **Recherche en temps réel** : Debouncing des requêtes
- [ ] **Cache intelligent** : Mise en cache des résultats
- [ ] **Optimisation SEO** : Meta tags dynamiques
- [ ] **Analytics** : Suivi des interactions utilisateur

## 📞 Support

Pour toute question ou problème :

1. Vérifier la documentation
2. Consulter les logs du navigateur
3. Tester avec le composant de démonstration
4. Vérifier la connectivité API

## 📄 Licence

Ce composant fait partie du projet Ayki et suit la même licence que le projet principal.
