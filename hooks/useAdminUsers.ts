import { useState, useEffect, useCallback } from 'react';
import { 
  adminApiClient, 
  AdminUser, 
  AdminUserFilter, 
  AdminPagination, 
  AdminUsersResponse,
  AdminUpdateUserStatus 
} from '@/lib/admin-api';

export function useAdminUsers(userType: 'candidate' | 'recruiter') {
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminUserFilter>({});
  const [pagination, setPagination] = useState<AdminPagination>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = userType === 'candidate' 
        ? await adminApiClient.getCandidates(filters, pagination)
        : await adminApiClient.getRecruiters(filters, pagination);
      
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, [userType, filters, pagination]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateFilters = (newFilters: Partial<AdminUserFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const updatePagination = (newPagination: Partial<AdminPagination>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  const updateUserStatus = async (userId: string, status: AdminUpdateUserStatus) => {
    try {
      await adminApiClient.updateUserStatus(userId, status);
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut');
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await adminApiClient.deleteUser(userId);
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur');
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    data,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    updateUserStatus,
    deleteUser,
    refetch: fetchUsers,
    clearError,
  };
}
