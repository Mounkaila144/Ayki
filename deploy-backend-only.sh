#!/bin/bash

# Script de déploiement backend AYKI uniquement
# Auteur: Mounkaila

set -e

echo "🚀 Déploiement AYKI Backend uniquement..."
echo "========================================"

# Variables
PROJECT_DIR="/var/www/Ayki"
BACKEND_DIR="$PROJECT_DIR/ayki_backend"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Vérifier MySQL
if ! systemctl is-active --quiet mysql; then
    log_error "MySQL n'est pas actif"
    exit 1
fi

# Mise à jour du code
log_info "Mise à jour du code source..."
cd $PROJECT_DIR
git pull origin main

# Déploiement backend
log_info "Déploiement du backend NestJS..."
cd $BACKEND_DIR

# Installation des dépendances production
log_info "Installation des dépendances backend..."
npm install --production --silent

# Vérifier le build
if [[ ! -d "dist" ]]; then
    log_error "Dossier dist manquant - veuillez faire 'npm run build' en local"
    exit 1
fi

# Vérifier le .env
if [[ ! -f .env ]]; then
    log_error "Fichier .env manquant dans le backend"
    exit 1
fi

# Redémarrer le service
log_info "Redémarrage du service backend..."
pm2 restart ayki-backend 2>/dev/null || {
    log_info "Création du processus backend..."
    pm2 start npm --name "ayki-backend" -- run start:prod
}

# Sauvegarder la configuration PM2
pm2 save

# Tests
log_info "Tests de connectivité..."
sleep 3

if curl -s http://localhost:3002/api > /dev/null; then
    log_success "✅ Backend API accessible"
else
    log_error "❌ Backend inaccessible"
fi

if curl -s http://localhost:3002/api/docs > /dev/null; then
    log_success "✅ Swagger UI accessible"
else
    log_warning "⚠️ Swagger UI inaccessible"
fi

log_success "Déploiement backend terminé!"
echo "📊 Accès:"
echo "   - API Backend: http://localhost:3002/api"
echo "   - Swagger UI: http://localhost:3002/api/docs"
echo "   - Via Apache: https://ayki.ptrniger.com/api"

pm2 status