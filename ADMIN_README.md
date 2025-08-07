# 🛡️ Interface d'Administration AYKI

Interface d'administration complète pour la plateforme de recrutement AYKI avec gestion des utilisateurs, statistiques en temps réel et outils de modération.

## 🚀 Fonctionnalités

### 📊 Dashboard Admin
- **Métriques en temps réel** : Statistiques des utilisateurs, candidatures, offres d'emploi
- **Graphiques interactifs** : Répartition des utilisateurs, taux d'activation
- **Indicateurs clés** : Nouvelles inscriptions, connexions récentes, taux de complétion des profils

### 👥 Gestion des Candidats
- **Liste paginée** avec filtres avancés (statut, localisation, date d'inscription)
- **Recherche** par nom, email ou téléphone
- **Actions CRUD** : Voir profil, activer/désactiver, suspendre, supprimer
- **Modal de détails** avec informations complètes (expériences, compétences, CV)
- **Statistiques** : Profil complété, vues du profil, candidatures

### 🏢 Gestion des Recruteurs
- **Liste paginée** avec filtres par entreprise et statut
- **Informations entreprise** : Logo, secteur d'activité, site web
- **Gestion des offres** : Nombre d'offres publiées par recruteur
- **Actions de modération** : Validation des comptes entreprise

### 🔐 Sécurité et Authentification
- **Rôles admin** : ADMIN et SUPER_ADMIN
- **Protection des routes** avec AdminGuard
- **Authentification JWT** séparée pour les admins
- **Logs d'activité** (à implémenter)

## 🏗️ Architecture Technique

### Backend (NestJS)
```
src/modules/admin/
├── admin.module.ts          # Module principal
├── admin.controller.ts      # Contrôleur API
├── admin.service.ts         # Logique métier
├── guards/
│   └── admin.guard.ts       # Protection des routes admin
└── dto/
    ├── admin-dashboard-stats.dto.ts
    ├── admin-user-filter.dto.ts
    ├── admin-pagination.dto.ts
    └── admin-update-user-status.dto.ts
```

### Frontend (Next.js)
```
app/admin/
├── layout.tsx               # Layout admin avec sidebar
├── dashboard/page.tsx       # Dashboard principal
├── candidates/page.tsx      # Gestion candidats
├── recruiters/page.tsx      # Gestion recruteurs
└── settings/page.tsx        # Paramètres admin

components/admin/
├── AdminLayout.tsx          # Layout réutilisable
├── DataTable.tsx           # Table avec tri/pagination
├── UserModal.tsx           # Modal détails utilisateur
└── StatsCard.tsx           # Carte de statistiques

hooks/
├── useAdminStats.ts        # Hook pour statistiques
└── useAdminUsers.ts        # Hook pour gestion utilisateurs

lib/
└── admin-api.ts            # Client API admin
```

## 🚀 Installation et Configuration

### 1. Backend - Ajout du rôle admin à un utilisateur existant

```sql
-- Ajouter le rôle admin à un utilisateur existant
UPDATE users SET adminRole = 'super_admin' WHERE phone = 'VOTRE_NUMERO';
```

### 2. Ou créer un nouvel admin avec le script

```bash
cd ayki_backend
npm run admin:create
```

Cela créera un super admin avec :
- **Téléphone** : 90000000
- **Mot de passe** : admin123
- **Email** : admin@ayki.com

### 3. Démarrer les services

```bash
# Backend
cd ayki_backend
npm run start:dev

# Frontend
cd ../
npm run dev
```

### 4. Accéder à l'interface admin

1. Aller sur `http://localhost:3000/auth/signin`
2. Se connecter avec les identifiants admin
3. Accéder à `http://localhost:3000/admin/dashboard`

## 📋 Endpoints API Admin

### Dashboard
- `GET /admin/dashboard/stats` - Statistiques générales

### Gestion des utilisateurs
- `GET /admin/candidates` - Liste des candidats avec filtres
- `GET /admin/recruiters` - Liste des recruteurs avec filtres
- `GET /admin/users/:id` - Détails d'un utilisateur
- `PUT /admin/users/:id/status` - Modifier le statut d'un utilisateur
- `DELETE /admin/users/:id` - Supprimer un utilisateur (soft delete)

### Paramètres de requête
```typescript
// Filtres
{
  userType?: 'candidate' | 'recruiter';
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  search?: string;
  location?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

// Pagination
{
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

## 🔒 Sécurité

### Authentification
- Les routes admin sont protégées par `AdminGuard`
- Vérification du rôle admin dans le token JWT
- Accès refusé (403) si pas de rôle admin

### Rôles disponibles
- **SUPER_ADMIN** : Accès complet à toutes les fonctionnalités
- **ADMIN** : Accès limité (à définir selon les besoins)

### Protection des données
- Soft delete pour les suppressions d'utilisateurs
- Logs d'activité pour traçabilité (à implémenter)
- Validation des entrées avec class-validator

## 🎨 Interface Utilisateur

### Design System
- **Framework** : Tailwind CSS + shadcn/ui
- **Icônes** : Lucide React
- **Couleurs** : Palette cohérente avec AYKI
- **Responsive** : Mobile-first design

### Composants réutilisables
- **DataTable** : Table avec tri, filtres et pagination
- **StatsCard** : Cartes de métriques avec icônes
- **UserModal** : Modal détaillée pour les profils utilisateurs
- **AdminLayout** : Layout avec sidebar et navigation

### Fonctionnalités UX
- **Recherche en temps réel** avec debounce
- **Filtres persistants** dans l'URL
- **Confirmations** pour actions destructives
- **Notifications toast** pour feedback utilisateur
- **Loading states** et gestion d'erreurs

## 🔧 Développement

### Ajouter une nouvelle fonctionnalité admin

1. **Backend** : Ajouter l'endpoint dans `AdminController`
2. **Service** : Implémenter la logique dans `AdminService`
3. **DTO** : Créer les DTOs de validation si nécessaire
4. **Frontend** : Ajouter l'appel API dans `admin-api.ts`
5. **Hook** : Créer un hook personnalisé si nécessaire
6. **UI** : Implémenter l'interface utilisateur

### Tests
```bash
# Tests backend
cd ayki_backend
npm run test

# Tests frontend
npm run test
```

## 📈 Métriques Disponibles

### Statistiques utilisateurs
- Nombre total de candidats/recruteurs
- Utilisateurs actifs/inactifs
- Nouvelles inscriptions par période
- Connexions récentes

### Statistiques d'activité
- Offres d'emploi publiées
- Candidatures soumises
- Entretiens programmés
- Taux de complétion des profils

### Analyses avancées (à implémenter)
- Taux de conversion candidat → embauche
- Temps moyen de recrutement
- Secteurs d'activité les plus actifs
- Géolocalisation des utilisateurs

## 🚧 Roadmap

### Phase 1 ✅ (Actuel)
- Dashboard avec métriques de base
- CRUD complet candidats/recruteurs
- Authentification admin
- Interface responsive

### Phase 2 🔄 (En cours)
- Filtres avancés et recherche
- Actions en lot (sélection multiple)
- Export de données (CSV, Excel)

### Phase 3 📋 (Planifié)
- Logs d'activité admin
- Notifications système
- Gestion des rôles granulaire
- Rapports automatisés

### Phase 4 🎯 (Futur)
- Analytics avancées avec graphiques
- Modération de contenu IA
- API webhooks pour intégrations
- Tableau de bord temps réel avec WebSocket

## 🤝 Contribution

1. Créer une branche feature : `git checkout -b feature/nouvelle-fonctionnalite`
2. Développer et tester la fonctionnalité
3. Créer une pull request avec description détaillée
4. Review et merge après validation

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@ayki.com
- 📱 Téléphone : +227 XX XX XX XX
- 💬 Slack : #ayki-admin-support
