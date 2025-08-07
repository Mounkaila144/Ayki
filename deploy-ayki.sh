#!/bin/bash

# Script de déploiement pour AYKI Recruitment Platform
# Auteur: Mounkaila
# Date: $(date)

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Démarrage du déploiement AYKI..."
echo "========================================"

# Variables
PROJECT_DIR="/var/www/Ayki"
BACKEND_DIR="$PROJECT_DIR/ayki_backend"
FRONTEND_DIR="$PROJECT_DIR"
LOG_DIR="/var/log/pm2"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si le script est exécuté en tant que root
if [[ $EUID -ne 0 ]]; then
   log_error "Ce script doit être exécuté en tant que root"
   exit 1
fi

# Créer les dossiers de logs si nécessaire
log_info "Création des dossiers de logs..."
mkdir -p $LOG_DIR
chown -R www-data:www-data $LOG_DIR

# Fonction pour vérifier les services
check_service() {
    if systemctl is-active --quiet $1; then
        log_success "$1 est actif"
        return 0
    else
        log_error "$1 n'est pas actif"
        return 1
    fi
}

# Vérifier les services requis
log_info "Vérification des services..."
check_service mysql || exit 1
check_service apache2 || exit 1

# Aller dans le répertoire du projet
cd $PROJECT_DIR

# Mise à jour du code source
log_info "Mise à jour du code source..."
git stash push -m "Auto-stash before deployment $(date)"
git pull origin main
log_success "Code source mis à jour"

# ===================================
# DÉPLOIEMENT BACKEND
# ===================================
log_info "Déploiement du backend NestJS..."
cd $BACKEND_DIR

# Installation des dépendances (incluant dev pour le build)
log_info "Installation des dépendances backend..."
npm install --silent

# Vérifier la configuration
if [[ ! -f .env ]]; then
    log_error "Fichier .env manquant dans le backend"
    exit 1
fi

# Build du backend sur le serveur
log_info "Build du backend NestJS sur le serveur..."
npm run build
log_success "Backend construit avec succès"

# Exécution des migrations si nécessaire
log_info "Vérification des migrations de base de données..."
npm run migration:run 2>/dev/null || log_warning "Aucune migration à exécuter ou erreur de migration"

# Exécution du seeding si nécessaire
log_info "Seeding de la base de données..."
npm run db:seed 2>/dev/null || log_warning "Seeding déjà effectué ou erreur de seeding"

# Arrêter l'ancien processus PM2 backend s'il existe
log_info "Arrêt de l'ancien processus backend..."
pm2 delete ayki-backend 2>/dev/null || true

# Vérifier si PM2 est installé, sinon l'installer
if ! command -v pm2 &> /dev/null; then
    log_info "Installation de PM2..."
    npm install -g pm2
fi

# Revenir au dossier principal pour utiliser ecosystem.config.js
cd $PROJECT_DIR

# Démarrer les applications avec ecosystem
log_info "Démarrage des applications avec PM2 ecosystem..."
pm2 delete ayki-backend 2>/dev/null || true
pm2 delete ayki-frontend 2>/dev/null || true

# Démarrer uniquement le backend d'abord
pm2 start ecosystem.config.js --only ayki-backend --env production
log_success "Backend démarré avec PM2"

# ===================================
# DÉPLOIEMENT FRONTEND
# ===================================
log_info "Déploiement du frontend Next.js..."

# Installation des dépendances frontend
log_info "Installation des dépendances frontend..."
npm install --silent

# Build du frontend (export statique selon la configuration Next.js)
log_info "Build du frontend Next.js..."
npm run build
log_success "Frontend construit avec succès"

# Démarrer le frontend avec PM2
log_info "Démarrage du frontend avec PM2..."
pm2 start ecosystem.config.js --only ayki-frontend --env production
log_success "Frontend démarré avec PM2"

# ===================================
# CONFIGURATION ET VÉRIFICATIONS
# ===================================

# Sauvegarder la configuration PM2
log_info "Sauvegarde de la configuration PM2..."
pm2 save

# Configurer PM2 pour le démarrage automatique
log_info "Configuration du démarrage automatique..."
pm2 startup systemd -u www-data --hp /var/www 2>/dev/null || true

# Vérifier les permissions
log_info "Vérification des permissions..."
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# Vérifier l'état des processus
log_info "Vérification de l'état des processus..."
pm2 status

# Attendre quelques secondes pour que les services démarrent
sleep 5

# Tests de connectivité
log_info "Tests de connectivité..."

# Test backend (port 3002 pour éviter les conflits)
if curl -s http://localhost:3002/api > /dev/null; then
    log_success "✅ Backend API accessible sur le port 3002"
else
    log_error "❌ Backend inaccessible sur le port 3002"
fi

# Test Swagger UI
if curl -s http://localhost:3002/api/docs > /dev/null; then
    log_success "✅ Swagger UI accessible"
else
    log_warning "⚠️ Swagger UI inaccessible"
fi

log_info "Frontend temporairement désactivé - backend seul fonctionnel"

# Redémarrer Apache pour s'assurer que la configuration est prise en compte
log_info "Redémarrage d'Apache..."
systemctl reload apache2
log_success "Apache redémarré"

# ===================================
# FINALISATION
# ===================================

log_info "Nettoyage..."
# Nettoyer les anciens logs (garder les 7 derniers jours)
find $LOG_DIR -name "*.log" -mtime +7 -delete 2>/dev/null || true

# Note: Pas de nettoyage nécessaire car on installe déjà en --production

log_success "Déploiement AYKI terminé avec succès!"
echo "========================================"
echo "📊 Résumé du déploiement:"
echo "   - Backend API: http://localhost:3002/api"
echo "   - Swagger UI: http://localhost:3002/api/docs"
if pm2 list | grep -q "ayki-frontend"; then
    echo "   - Frontend: http://localhost:3003"
else
    echo "   - Frontend: Serveur web statique configuré"
fi
echo "   - Site web: https://ayki.ptrniger.com"
echo ""
echo "📋 Commandes utiles:"
echo "   - Logs: pm2 logs"
echo "   - Status: pm2 status"
echo "   - Monitoring: pm2 monit"
echo "   - Redémarrer backend: pm2 restart ayki-backend"
if pm2 list | grep -q "ayki-frontend"; then
    echo "   - Redémarrer frontend: pm2 restart ayki-frontend"
fi
echo "   - Rebuild frontend: cd $FRONTEND_DIR && npm run build"
echo ""
echo "🔧 Administration:"
echo "   - Créer admin: cd $BACKEND_DIR && npm run admin:create"
echo "   - Tester admin: cd $BACKEND_DIR && npm run admin:test"
echo "   - Seeder DB: cd $BACKEND_DIR && npm run db:seed"
echo ""
echo "✅ Votre plateforme AYKI est maintenant en ligne!"