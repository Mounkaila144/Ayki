#!/bin/bash

# Script de déploiement pour AYKI Recruitment Platform
# Auteur: Mounkaila
# Date: $(date)

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Démarrage du déploiement AYKI..."
echo "========================================"

# Variables
PROJECT_DIR="/var/www/ayki"
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

# Installation des dépendances
log_info "Installation des dépendances backend..."
npm install --production --silent

# Vérifier la configuration
if [[ ! -f .env ]]; then
    log_error "Fichier .env manquant dans le backend"
    exit 1
fi

# Build du backend
log_info "Build du backend NestJS..."
npm run build
log_success "Backend construit avec succès"

# Exécution des migrations si nécessaire
log_info "Vérification des migrations de base de données..."
npm run migration:run || log_warning "Aucune migration à exécuter"

# Exécution du seeding si nécessaire
log_info "Seeding de la base de données..."
npm run db:seed || log_warning "Seeding déjà effectué"

# Arrêter l'ancien processus PM2 backend s'il existe
log_info "Arrêt de l'ancien processus backend..."
pm2 delete ayki-backend 2>/dev/null || true

# Démarrer le nouveau processus backend
log_info "Démarrage du nouveau processus backend..."
pm2 start npm --name "ayki-backend" -- run start:prod
log_success "Backend démarré avec PM2"

# ===================================
# DÉPLOIEMENT FRONTEND
# ===================================
log_info "Déploiement du frontend Next.js..."
cd $FRONTEND_DIR

# Installation des dépendances
log_info "Installation des dépendances frontend..."
npm install --silent

# Vérifier la configuration
if [[ ! -f .env.local ]] && [[ ! -f .env.production ]]; then
    log_warning "Aucun fichier d'environnement trouvé (.env.local ou .env.production)"
fi

# Build du frontend (export statique selon la configuration Next.js)
log_info "Build du frontend Next.js..."
npm run build
log_success "Frontend construit avec succès"

# Pour l'export statique, pas besoin de PM2, juste servir les fichiers statiques
log_info "Configuration du frontend statique..."
if [[ -d "out" ]]; then
    # Export statique activé
    log_info "Export statique détecté, copie des fichiers vers le serveur web..."
    rm -rf /var/www/html/ayki 2>/dev/null || true
    mkdir -p /var/www/html/ayki
    cp -r out/* /var/www/html/ayki/
    chown -R www-data:www-data /var/www/html/ayki
    log_success "Fichiers statiques copiés"
else
    # Mode serveur Next.js
    log_info "Mode serveur Next.js détecté..."
    # Arrêter l'ancien processus PM2 frontend s'il existe
    pm2 delete ayki-frontend 2>/dev/null || true
    
    # Démarrer le nouveau processus frontend
    pm2 start npm --name "ayki-frontend" -- run start
    log_success "Frontend démarré avec PM2"
fi

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
    log_success "Backend accessible sur le port 3002"
else
    log_warning "Backend inaccessible sur le port 3002"
fi

# Test frontend (si mode serveur)
if pm2 list | grep -q "ayki-frontend"; then
    if curl -s http://localhost:3003 > /dev/null; then
        log_success "Frontend accessible sur le port 3003"
    else
        log_warning "Frontend inaccessible sur le port 3003"
    fi
else
    log_info "Frontend en mode export statique - serveur web configuré"
fi

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

# Nettoyer les node_modules de dev si en production
if [[ "$NODE_ENV" == "production" ]]; then
    log_info "Nettoyage des dépendances de développement..."
    cd $BACKEND_DIR && npm prune --production
    cd $FRONTEND_DIR && npm prune --production
fi

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