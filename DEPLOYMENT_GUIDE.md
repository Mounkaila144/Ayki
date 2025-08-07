# 🚀 Guide de Déploiement AYKI

## Configuration des Ports (sans conflits)

- **Backend NestJS** : Port `3002` (au lieu de 3001 pour éviter les conflits)
- **Frontend Next.js** : Port `3003` (au lieu de 3000 pour éviter les conflits)
- **Apache** : Ports `80` et `443`
- **MySQL** : Port `3306`

## 📋 Prérequis

```bash
# Services requis
sudo systemctl status mysql
sudo systemctl status apache2

# Modules Apache requis
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod headers
```

## 🔧 Installation et Configuration

### 1. Copier le projet
```bash
cd /var/www
git clone [votre-repo] Ayki
cd Ayki
```

### 2. Configuration Apache
```bash
# Copier la configuration
sudo cp apache-config-example.conf /etc/apache2/sites-available/ayki.votre-domaine.com.conf

# Modifier le fichier avec vos paramètres
sudo nano /etc/apache2/sites-available/ayki.votre-domaine.com.conf

# Activer le site
sudo a2ensite ayki.votre-domaine.com.conf
sudo systemctl reload apache2
```

### 3. Configuration de la base de données
```bash
cd ayki_backend

# Créer le fichier .env
cp .env.example .env
nano .env

# Contenu minimal du .env :
NODE_ENV=production
PORT=3002
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ayki_user
DB_PASSWORD=votre_mot_de_passe
DB_NAME=ayki_db
JWT_SECRET=votre_jwt_secret_tres_long_et_securise
JWT_EXPIRES_IN=7d
```

### 4. Déploiement
```bash
# Rendre le script exécutable
chmod +x deploy-ayki.sh

# Lancer le déploiement
sudo ./deploy-ayki.sh
```

## 🔍 Vérifications Post-Déploiement

### Services PM2
```bash
pm2 status
pm2 logs ayki-backend
pm2 logs ayki-frontend
```

### Tests de connectivité
```bash
# Backend API
curl http://localhost:3002/api

# Swagger UI
curl http://localhost:3002/api/docs

# Site web
curl https://ayki.votre-domaine.com
```

## 🛠 Commandes de Maintenance

### Redémarrage des services
```bash
# Redémarrer les applications
pm2 restart ayki-backend
pm2 restart ayki-frontend

# Redémarrer Apache
sudo systemctl reload apache2
```

### Mise à jour du code
```bash
cd /var/www/Ayki

# Déploiement rapide
./deploy-simple.sh

# Déploiement complet
sudo ./deploy-ayki.sh
```

### Administration
```bash
cd /var/www/Ayki/ayki_backend

# Créer un administrateur
npm run admin:create

# Seeder la base de données
npm run db:seed

# Générer des migrations
npm run migration:generate -- NomDeLaMigration
```

## 🚨 Dépannage

### Erreurs courantes
1. **Port déjà utilisé** : Vérifier avec `netstat -tlnp | grep :3002`
2. **Permissions** : `sudo chown -R www-data:www-data /var/www/Ayki`
3. **Base de données** : Vérifier la connexion MySQL
4. **SSL** : Vérifier les certificats Let's Encrypt

### Logs utiles
```bash
# Logs PM2
pm2 logs

# Logs Apache
sudo tail -f /var/log/apache2/ayki-error.log
sudo tail -f /var/log/apache2/ayki-access.log

# Logs système
journalctl -u apache2 -f
```

## 📊 URLs de Production

- **Site web** : https://ayki.votre-domaine.com
- **API Backend** : https://ayki.votre-domaine.com/api
- **Swagger UI** : https://ayki.votre-domaine.com/api/docs
- **Health Check** : https://ayki.votre-domaine.com/health

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- JWT avec expiration configurable
- Headers de sécurité configurés dans Apache
- Upload limité à 50MB pour les CV
- HTTPS obligatoire avec redirection automatique