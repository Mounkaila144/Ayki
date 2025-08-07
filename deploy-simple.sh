#!/bin/bash

# Script de déploiement simplifié pour AYKI avec PM2 Ecosystem
# Auteur: Mounkaila

set -e

echo "🚀 Déploiement AYKI avec PM2 Ecosystem..."

# Variables
PROJECT_DIR=$(pwd)
BACKEND_DIR="$PROJECT_DIR/ayki_backend"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Mise à jour du code
log_info "Mise à jour du code source..."
git pull origin main

# Installation des dépendances
log_info "Installation des dépendances..."
npm install
cd $BACKEND_DIR && npm install && cd $PROJECT_DIR

# Build des applications
log_info "Build du backend..."
cd $BACKEND_DIR && npm run build && cd $PROJECT_DIR

log_info "Build du frontend..."
npm run build

# Migrations de base de données
log_info "Migrations de la base de données..."
cd $BACKEND_DIR && npm run migration:run && cd $PROJECT_DIR

# Déploiement avec PM2 Ecosystem
log_info "Déploiement avec PM2..."
pm2 reload ecosystem.config.js --env production

# Sauvegarde de la configuration PM2
pm2 save

log_success "Déploiement terminé!"
echo "📊 Status des applications:"
pm2 status