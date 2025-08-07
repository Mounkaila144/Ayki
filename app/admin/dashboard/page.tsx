'use client';

import { 
  Users, 
  Building2, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Calendar,
  Briefcase,
  FileText,
  Clock,
  Target
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme AYKI
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme AYKI
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de la plateforme AYKI
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Candidats"
          value={stats.totalCandidates}
          description="Candidats inscrits"
          icon={Users}
        />
        <StatsCard
          title="Total Recruteurs"
          value={stats.totalRecruiters}
          description="Recruteurs actifs"
          icon={Building2}
        />
        <StatsCard
          title="Utilisateurs Actifs"
          value={stats.activeUsers}
          description="Comptes actifs"
          icon={UserCheck}
        />
        <StatsCard
          title="Utilisateurs Inactifs"
          value={stats.inactiveUsers}
          description="Comptes inactifs"
          icon={UserX}
        />
      </div>

      {/* Statistiques d'activité */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Nouvelles Inscriptions"
          value={stats.newUsersThisMonth}
          description="Ce mois-ci"
          icon={TrendingUp}
        />
        <StatsCard
          title="Connexions Récentes"
          value={stats.recentLogins}
          description="7 derniers jours"
          icon={Calendar}
        />
        <StatsCard
          title="Offres d'Emploi"
          value={stats.totalJobOffers}
          description="Total des offres"
          icon={Briefcase}
        />
        <StatsCard
          title="Candidatures"
          value={stats.totalApplications}
          description="Total des candidatures"
          icon={FileText}
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Candidatures ce Mois"
          value={stats.applicationsThisMonth}
          description="Nouvelles candidatures"
          icon={TrendingUp}
        />
        <StatsCard
          title="Entretiens Programmés"
          value={stats.scheduledInterviews}
          description="À venir"
          icon={Clock}
        />
        <StatsCard
          title="Profils Candidats"
          value={`${stats.candidateProfileCompletion}%`}
          description="Taux de complétion"
          icon={Target}
        />
        <StatsCard
          title="Profils Recruteurs"
          value={`${stats.recruiterProfileCompletion}%`}
          description="Taux de complétion"
          icon={Target}
        />
      </div>

      {/* Graphiques et analyses */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Utilisateurs</CardTitle>
            <CardDescription>
              Distribution entre candidats et recruteurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Candidats</span>
                </div>
                <span className="font-medium">{stats.totalCandidates}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Recruteurs</span>
                </div>
                <span className="font-medium">{stats.totalRecruiters}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{stats.totalCandidates + stats.totalRecruiters}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des Comptes</CardTitle>
            <CardDescription>
              Répartition par statut d'activation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Actifs</span>
                </div>
                <span className="font-medium">{stats.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Inactifs</span>
                </div>
                <span className="font-medium">{stats.inactiveUsers}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-gray-600">
                  Taux d'activation: {' '}
                  <span className="font-medium">
                    {Math.round((stats.activeUsers / (stats.activeUsers + stats.inactiveUsers)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
