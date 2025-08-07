# 🚀 AYKI Backend - API de Recrutement

Backend NestJS complet pour l'application de recrutement AYKI avec authentification par téléphone, gestion des profils candidats/recruteurs, et système de matching intelligent.

## 📋 Table des Matières

- [🏗️ Architecture](#architecture)
- [📊 Base de Données](#base-de-données)
- [🚀 Installation](#installation)
- [⚙️ Configuration](#configuration)
- [🔧 Utilisation](#utilisation)
- [📚 API Documentation](#api-documentation)

## 🏗️ Architecture

### Stack Technique
- **Framework**: NestJS (Node.js)
- **Base de données**: MySQL
- **ORM**: TypeORM
- **Authentification**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Upload de fichiers**: Multer

### Structure des Modules
```
src/
├── entities/           # Entités TypeORM
├── modules/           # Modules fonctionnels
│   ├── auth/         # Authentification
│   ├── users/        # Gestion utilisateurs
│   ├── profiles/     # Profils candidats
│   ├── companies/    # Entreprises
│   ├── skills/       # Compétences
│   ├── jobs/         # Offres d'emploi
│   ├── applications/ # Candidatures
│   ├── bookmarks/    # Favoris
│   ├── interviews/   # Entretiens
│   ├── documents/    # CV et fichiers
│   ├── notifications/# Notifications
│   └── analytics/    # Statistiques
├── config/           # Configuration
└── database/         # Seeds et migrations
```

## 📊 Base de Données

### Tables Principales

#### 👤 **users** - Utilisateurs principaux
- `id` (UUID, PK)
- `phone` (VARCHAR, UNIQUE) - Numéro de téléphone français
- `password` (VARCHAR) - Mot de passe hashé
- `userType` (ENUM) - 'candidate' | 'recruiter'
- `status` (ENUM) - 'active' | 'inactive' | 'suspended' | 'pending'
- `lastLoginAt`, `createdAt`, `updatedAt`

#### 📝 **user_profiles** - Profils détaillés
- `id` (UUID, PK), `userId` (UUID, FK → users)
- `firstName`, `lastName`, `title`, `location`, `summary`
- `avatar`, `dateOfBirth`, `gender`, `nationality`
- `salaryExpectation`, `availability`, `yearsOfExperience`
- `profileCompletion`, `profileViews`, `rating`

#### 🏢 **companies** - Entreprises
- `id` (UUID, PK), `userId` (UUID, FK → users)
- `name`, `description`, `industry`, `size`, `type`
- `website`, `email`, `phone`, `address`
- `benefits`, `values`, `technologies` (ARRAY)

#### 💼 **experiences** - Expériences professionnelles
- `id` (UUID, PK), `userId` (UUID, FK → users)
- `title`, `company`, `location`, `employmentType`
- `startDate`, `endDate`, `isCurrent`
- `description`, `responsibilities`, `achievements`

#### 🎓 **educations** - Formations
- `id` (UUID, PK), `userId` (UUID, FK → users)
- `degree`, `school`, `fieldOfStudy`, `level`, `status`
- `startDate`, `endDate`, `graduationYear`

#### ⚡ **skills** - Compétences disponibles
- `id` (UUID, PK), `name` (UNIQUE), `category`, `subcategory`
- `isActive`, `isVerified`, `usageCount`, `demandScore`

#### 🔗 **user_skills** - Compétences des utilisateurs
- `id` (UUID, PK), `userId` (FK), `skillId` (FK)
- `level`, `yearsOfExperience`, `endorsementStatus`

#### 💼 **job_offers** - Offres d'emploi
- `id` (UUID, PK), `recruiterId` (FK), `companyId` (FK)
- `title`, `description`, `requirements`, `location`
- `employmentType`, `experienceLevel`, `remotePolicy`
- `salaryMin`, `salaryMax`, `status`

#### 📝 **applications** - Candidatures
- `id` (UUID, PK), `candidateId` (FK), `recruiterId` (FK), `jobOfferId` (FK)
- `status`, `source`, `coverLetter`, `matchScore`

#### ⭐ **bookmarks** - Favoris des recruteurs
- `id` (UUID, PK), `recruiterId` (FK), `candidateId` (FK)
- `type`, `notes`, `tags`, `priority`

#### 📅 **interviews** - Entretiens
- `id` (UUID, PK), `candidateId` (FK), `recruiterId` (FK), `applicationId` (FK)
- `title`, `type`, `status`, `scheduledAt`, `duration`
- `meetingLink`, `notes`, `feedback`, `rating`

#### 📄 **documents** - CV et fichiers
- `id` (UUID, PK), `userId` (FK)
- `name`, `type`, `mimeType`, `size`, `path`
- `extractedText`, `extractedSkills`

#### 🔔 **notifications** - Notifications
- `id` (UUID, PK), `userId` (FK), `senderId` (FK)
- `type`, `title`, `message`, `priority`, `channel`
- `isRead`, `actionUrl`

#### 📊 **analytics** - Métriques
- `id` (UUID, PK), `userId` (FK)
- `type`, `action`, `properties` (JSON)
- `deviceType`, `browser`, `sessionId`

## 🚀 Installation

### Prérequis
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd ayki_backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE ayki_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos paramètres
```

5. **Initialiser la base de données**
```bash
npm run db:seed
```

6. **Démarrer l'application**
```bash
npm run start:dev
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Application
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3001

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=ayki_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 🔧 Utilisation

### Démarrage du serveur
```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Gestion de la base de données
```bash
# Réinitialiser avec les données de base
npm run db:reset

# Exécuter les seeds uniquement
npm run db:seed
```

## 📚 API Documentation

### Endpoints principaux

#### 🔐 Authentification
- `POST /auth/signup` - Inscription
- `POST /auth/signin` - Connexion
- `GET /auth/profile` - Profil utilisateur
- `POST /auth/refresh` - Rafraîchir le token

#### 👤 Utilisateurs
- `GET /users` - Liste des utilisateurs
- `GET /users/:id` - Détails d'un utilisateur

#### 📝 Profils
- `GET /profiles/:id` - Profil détaillé
- `PUT /profiles/:id` - Mettre à jour le profil

#### 💼 Offres d'emploi
- `GET /jobs` - Liste des offres
- `POST /jobs` - Créer une offre
- `GET /jobs/:id` - Détails d'une offre

#### 📋 Candidatures
- `GET /applications` - Mes candidatures
- `POST /applications` - Postuler à une offre
- `PUT /applications/:id` - Mettre à jour le statut

### Documentation Swagger
Une fois l'application démarrée, accédez à :
```
http://localhost:3001/api/docs
```

---

## 🎯 Fonctionnalités Clés

✅ **Authentification par téléphone** avec validation française
✅ **Gestion complète des profils** candidats et recruteurs
✅ **Système de compétences** avec niveaux et endorsements
✅ **Matching intelligent** candidat-offre
✅ **Gestion des candidatures** avec workflow complet
✅ **Système de favoris** pour les recruteurs
✅ **Planification d'entretiens** avec notifications
✅ **Upload et analyse de CV** automatique
✅ **Analytics et métriques** détaillées
✅ **API REST complète** avec documentation Swagger
✅ **Validation des données** robuste
✅ **Sécurité JWT** avec refresh tokens

Le backend est maintenant prêt à supporter toutes les fonctionnalités de votre frontend AYKI ! 🚀
