'use client';

import { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/admin/DataTable';
import { UserModal } from '@/components/admin/UserModal';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminUser } from '@/lib/admin-api';
import { toast } from 'sonner';

export default function AdminCandidates() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    updateUserStatus,
    deleteUser,
    clearError,
  } = useAdminUsers('candidate');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value || undefined });
  };

  const handleStatusFilter = (status: string) => {
    updateFilters({ 
      status: status === 'all' ? undefined : status as any 
    });
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserModal(true);
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    const success = await updateUserStatus(userId, { status: status as any });
    if (success) {
      toast.success('Statut mis à jour avec succès');
    } else {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      const success = await deleteUser(userId);
      if (success) {
        toast.success('Utilisateur supprimé avec succès');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, icon: XCircle, color: 'text-gray-600' },
      suspended: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
    };
    
    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'profile.firstName',
      label: 'Nom',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            {user.profile?.avatar ? (
              <img 
                src={user.profile.avatar} 
                alt="Avatar" 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-white">
                {user.profile?.firstName?.[0] || 'U'}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">
              {user.profile?.firstName} {user.profile?.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'profile.email',
      label: 'Email',
      render: (_, user) => (
        <div>
          <div>{user.profile?.email || 'Non renseigné'}</div>
          {user.emailVerifiedAt && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              Vérifié
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'profile.location',
      label: 'Localisation',
      render: (_, user) => user.profile?.location || 'Non renseigné',
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (status) => getStatusBadge(status),
    },
    {
      key: 'profile.profileCompletion',
      label: 'Profil',
      render: (_, user) => (
        <div className="text-center">
          <div className="text-sm font-medium">
            {user.profile?.profileCompletion || 0}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${user.profile?.profileCompletion || 0}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Inscription',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir le profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleUpdateStatus(user.id, 'active')}
              disabled={user.status === 'active'}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activer
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleUpdateStatus(user.id, 'inactive')}
              disabled={user.status === 'inactive'}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Désactiver
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleUpdateStatus(user.id, 'suspended')}
              disabled={user.status === 'suspended'}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Suspendre
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Candidats</h1>
          <p className="text-muted-foreground">
            Gérez les comptes candidats de la plateforme
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError}>
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      {data && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {data.data.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {data.data.filter(u => u.status === 'inactive').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {data.data.filter(u => u.status === 'suspended').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table des candidats */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Candidats</CardTitle>
          <CardDescription>
            {data ? `${data.total} candidat(s) trouvé(s)` : 'Chargement...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data?.data || []}
            columns={columns}
            loading={loading}
            pagination={data ? {
              page: data.page,
              limit: data.limit,
              total: data.total,
              totalPages: data.totalPages,
            } : undefined}
            sortBy={pagination.sortBy}
            sortOrder={pagination.sortOrder}
            onSort={(sortBy, sortOrder) => updatePagination({ sortBy, sortOrder })}
            onPageChange={(page) => updatePagination({ page })}
            onLimitChange={(limit) => updatePagination({ limit, page: 1 })}
            emptyMessage="Aucun candidat trouvé"
          />
        </CardContent>
      </Card>

      {/* Modal de détails utilisateur */}
      <UserModal
        userId={selectedUserId}
        open={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}
