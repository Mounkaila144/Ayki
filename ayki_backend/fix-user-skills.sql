-- Script pour corriger le problème de la table user_skills
-- Ce script supprime la table user_skills pour permettre à TypeORM de la recréer avec la bonne structure

USE ayki_db;

-- Supprimer la table user_skills
DROP TABLE IF EXISTS user_skills;

-- Afficher un message de confirmation
SELECT 'Table user_skills supprimée avec succès. Redémarrez le serveur NestJS pour la recréer.' AS message;
