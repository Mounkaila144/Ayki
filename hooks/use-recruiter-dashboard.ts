import { useState, useEffect, useCallback } from 'react';
import { apiClient, authUtils } from '@/lib/api';
// import { useAuthToast } from './use-auth-toast'; // Commenté temporairement

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  summary: string;
  skills: string[];
  experience: string;
  avatar?: string;
  salary?: string;
  availability?: string;
  rating?: number;
  lastActive?: string;
  education?: string;
  company?: string;
  isBookmarked?: boolean;
  matchScore?: number;
  email?: string;
  phone?: string;
  profileCompletion?: number;
}

export interface RecruiterProfile {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface RecruiterStats {
  totalCandidates: number;
  bookmarkedCandidates: number;
  activeJobOffers: number;
  totalApplications: number;
  interviewsScheduled: number;
  hiredCandidates: number;
}

export interface SearchFilters {
  search?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  salary?: string;
  availability?: string;
  sortBy?: 'match' | 'name' | 'experience' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RecruiterDashboardData {
  profile: RecruiterProfile | null;
  candidates: Candidate[];
  bookmarkedCandidates: Candidate[];
  stats: RecruiterStats;
  totalCandidates: number;
  currentPage: number;
  totalPages: number;
}

export const useRecruiterDashboard = () => {
  const [data, setData] = useState<RecruiterDashboardData>({
    profile: null,
    candidates: [],
    bookmarkedCandidates: [],
    stats: {
      totalCandidates: 0,
      bookmarkedCandidates: 0,
      activeJobOffers: 0,
      totalApplications: 0,
      interviewsScheduled: 0,
      hiredCandidates: 0,
    },
    totalCandidates: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    page: 1,
    limit: 12,
    sortBy: 'match',
    sortOrder: 'desc',
  });

  // const { showAuthError } = useAuthToast(); // Commenté temporairement

  const fetchRecruiterProfile = async () => {
    try {
      const profile = await apiClient.getUserProfile();
      return profile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil recruteur:', error);
      // Si le profil n'existe pas encore, utiliser les données utilisateur de base
      const userData = authUtils.getUser();
      return {
        firstName: userData?.profile?.firstName || 'Recruteur',
        lastName: userData?.profile?.lastName || '',
        company: userData?.company?.name || 'Entreprise',
        position: 'Recruteur',
        email: userData?.profile?.email || '',
        phone: userData?.phone || '',
      };
    }
  };

  const fetchCandidates = async (filters: SearchFilters = {}) => {
    try {
      const response = await apiClient.searchCandidates(filters);
      console.log('API Response for candidates:', response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats:', error);
      // Ne plus masquer les erreurs pour voir le vrai problème
      throw error;
    }
  };

  const fetchBookmarkedCandidates = async () => {
    try {
      const bookmarked = await apiClient.getBookmarkedCandidates();
      return bookmarked;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats favoris:', error);
      return [];
    }
  };

  const fetchRecruiterStats = async () => {
    try {
      const stats = await apiClient.getRecruiterStats();
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalCandidates: 0,
        bookmarkedCandidates: 0,
        activeJobOffers: 0,
        totalApplications: 0,
        interviewsScheduled: 0,
        hiredCandidates: 0,
      };
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier si l'utilisateur est connecté
      if (!authUtils.isAuthenticated()) {
        throw new Error('Utilisateur non connecté');
      }

      // Récupérer toutes les données en parallèle
      const [profile, candidatesResponse, bookmarked, stats] = await Promise.allSettled([
        fetchRecruiterProfile(),
        fetchCandidates(searchFilters),
        fetchBookmarkedCandidates(),
        fetchRecruiterStats(),
      ]);

      setData({
        profile: profile.status === 'fulfilled' ? profile.value : null,
        candidates: candidatesResponse.status === 'fulfilled' ? candidatesResponse.value.data : [],
        bookmarkedCandidates: bookmarked.status === 'fulfilled' ? bookmarked.value : [],
        stats: stats.status === 'fulfilled' ? stats.value : {
          totalCandidates: 0,
          bookmarkedCandidates: 0,
          activeJobOffers: 0,
          totalApplications: 0,
          interviewsScheduled: 0,
          hiredCandidates: 0,
        },
        totalCandidates: candidatesResponse.status === 'fulfilled' ? candidatesResponse.value.total : 0,
        currentPage: candidatesResponse.status === 'fulfilled' ? candidatesResponse.value.page : 1,
        totalPages: candidatesResponse.status === 'fulfilled' ? candidatesResponse.value.totalPages : 1,
      });

    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des données');

      if (error instanceof Error && error.message.includes('non connecté')) {
        // showAuthError(); // Commenté temporairement
        console.log('Utilisateur non connecté');
      }
    } finally {
      setLoading(false);
    }
  }, [searchFilters]);

  const searchCandidates = useCallback(async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setSearchFilters(prev => ({ ...prev, ...filters, page: 1 }));
      
      const response = await fetchCandidates({ ...searchFilters, ...filters, page: 1 });
      
      setData(prev => ({
        ...prev,
        candidates: response.data,
        totalCandidates: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, [searchFilters]);

  const toggleBookmark = async (candidateId: string) => {
    try {
      await apiClient.toggleCandidateBookmark(candidateId);
      
      // Mettre à jour l'état local
      setData(prev => ({
        ...prev,
        candidates: prev.candidates.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, isBookmarked: !candidate.isBookmarked }
            : candidate
        ),
      }));
      
      // Recharger les favoris
      const bookmarked = await fetchBookmarkedCandidates();
      setData(prev => ({ ...prev, bookmarkedCandidates: bookmarked }));
      
    } catch (error) {
      setError('Erreur lors de la mise à jour des favoris');
    }
  };

  const loadMoreCandidates = async () => {
    if (data.currentPage >= data.totalPages) return;
    
    try {
      setLoading(true);
      const nextPage = data.currentPage + 1;
      const response = await fetchCandidates({ ...searchFilters, page: nextPage });
      
      setData(prev => ({
        ...prev,
        candidates: [...prev.candidates, ...response.data],
        currentPage: response.page,
      }));
    } catch (error) {
      setError('Erreur lors du chargement des candidats supplémentaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    searchFilters,
    searchCandidates,
    toggleBookmark,
    loadMoreCandidates,
    refetch: fetchDashboardData,
  };
};
