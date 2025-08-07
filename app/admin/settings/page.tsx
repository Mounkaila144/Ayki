'use client';

import { Settings, Shield, Database, Mail, Bell, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres Admin</h1>
        <p className="text-muted-foreground">
          Configuration et paramètres de l'interface d'administration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gestion des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des Utilisateurs
            </CardTitle>
            <CardDescription>
              Paramètres liés à la gestion des comptes utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Validation automatique</h4>
                <p className="text-sm text-gray-600">
                  Valider automatiquement les nouveaux comptes
                </p>
              </div>
              <Badge variant="outline">Désactivé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Limite de candidatures</h4>
                <p className="text-sm text-gray-600">
                  Nombre max de candidatures par candidat
                </p>
              </div>
              <Badge>50</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Limite d'offres</h4>
                <p className="text-sm text-gray-600">
                  Nombre max d'offres par recruteur
                </p>
              </div>
              <Badge>20</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Modifier les paramètres
            </Button>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et d'accès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Authentification 2FA</h4>
                <p className="text-sm text-gray-600">
                  Double authentification pour les admins
                </p>
              </div>
              <Badge variant="outline">Recommandé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Session timeout</h4>
                <p className="text-sm text-gray-600">
                  Durée de session admin
                </p>
              </div>
              <Badge>8 heures</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Logs d'activité</h4>
                <p className="text-sm text-gray-600">
                  Enregistrement des actions admin
                </p>
              </div>
              <Badge variant="default">Activé</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Configurer la sécurité
            </Button>
          </CardContent>
        </Card>

        {/* Base de données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de Données
            </CardTitle>
            <CardDescription>
              Maintenance et sauvegarde des données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dernière sauvegarde</h4>
                <p className="text-sm text-gray-600">
                  Sauvegarde automatique quotidienne
                </p>
              </div>
              <Badge variant="default">Aujourd'hui</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Taille de la DB</h4>
                <p className="text-sm text-gray-600">
                  Espace utilisé par la base de données
                </p>
              </div>
              <Badge variant="outline">2.4 GB</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Optimisation</h4>
                <p className="text-sm text-gray-600">
                  Dernière optimisation des tables
                </p>
              </div>
              <Badge variant="outline">Il y a 3 jours</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Sauvegarder
              </Button>
              <Button variant="outline" className="flex-1">
                Optimiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configuration des alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Alertes système</h4>
                <p className="text-sm text-gray-600">
                  Notifications d'erreurs et problèmes
                </p>
              </div>
              <Badge variant="default">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Rapports quotidiens</h4>
                <p className="text-sm text-gray-600">
                  Statistiques envoyées par email
                </p>
              </div>
              <Badge variant="default">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Alertes de sécurité</h4>
                <p className="text-sm text-gray-600">
                  Tentatives de connexion suspectes
                </p>
              </div>
              <Badge variant="default">Activé</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Configurer les notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions système */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Système</CardTitle>
          <CardDescription>
            Actions de maintenance et gestion avancée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Database className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Nettoyer la cache</div>
                <div className="text-xs text-gray-600">Vider le cache système</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Mail className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Test email</div>
                <div className="text-xs text-gray-600">Tester l'envoi d'emails</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Settings className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Redémarrer</div>
                <div className="text-xs text-gray-600">Redémarrer les services</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations système */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Système</CardTitle>
          <CardDescription>
            État actuel du système et de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version AYKI</span>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version Node.js</span>
                <Badge variant="outline">v18.17.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Base de données</span>
                <Badge variant="outline">MySQL 8.0</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <Badge variant="default">7 jours 14h</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Mémoire utilisée</span>
                <Badge variant="outline">245 MB</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">CPU</span>
                <Badge variant="outline">12%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
