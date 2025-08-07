import { useState, useEffect, useCallback } from 'react';

export interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  employmentType: string;
  experienceLevel: string;
  remotePolicy: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  salaryPeriod?: string;
  positions?: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
  status: string;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
    industry?: string;
  };
  recruiter?: {
    id: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface JobFilters {
  searchTerm: string;
  employmentType: string;
  experienceLevel: string;
  remotePolicy: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
}

export interface UseJobListingsReturn {
  jobs: JobOffer[];
  filteredJobs: JobOffer[];
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  updateFilter: (key: keyof JobFilters, value: string) => void;
  clearFilters: () => void;
  refetch: () => Promise<void>;
  hasActiveFilters: boolean;
}

const initialFilters: JobFilters = {
  searchTerm: '',
  employmentType: '',
  experienceLevel: '',
  remotePolicy: '',
  location: '',
  salaryMin: '',
  salaryMax: '',
};

export const useJobListings = (): UseJobListingsReturn => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  // Fonction pour récupérer les offres d'emploi
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le token d'authentification
      const token = localStorage.getItem('auth_token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/jobs', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentification requise pour voir les offres d\'emploi');
        }
        throw new Error('Erreur lors de la récupération des offres');
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour mettre à jour un filtre
  const updateFilter = useCallback((key: keyof JobFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Fonction pour effacer tous les filtres
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Fonction pour vérifier s'il y a des filtres actifs
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Application des filtres
  useEffect(() => {
    let filtered = [...jobs];

    // Recherche par mots-clés
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.company?.name.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower) ||
        job.requirements?.toLowerCase().includes(searchLower)
      );
    }

    // Filtres spécifiques
    if (filters.employmentType) {
      filtered = filtered.filter(job => job.employmentType === filters.employmentType);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.remotePolicy) {
      filtered = filtered.filter(job => job.remotePolicy === filters.remotePolicy);
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filtres de salaire
    if (filters.salaryMin) {
      filtered = filtered.filter(job => {
        const jobSalaryMin = job.salaryMin ? parseInt(job.salaryMin) : 0;
        return jobSalaryMin >= parseInt(filters.salaryMin);
      });
    }

    if (filters.salaryMax) {
      filtered = filtered.filter(job => {
        const jobSalaryMax = job.salaryMax ? parseInt(job.salaryMax) : Infinity;
        return jobSalaryMax <= parseInt(filters.salaryMax);
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  // Récupération initiale des données
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    filteredJobs,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    refetch: fetchJobs,
    hasActiveFilters,
  };
};

// Hook pour les actions sur les offres d'emploi
export const useJobActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyToJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implémenter l'API de candidature
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la candidature');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implémenter l'API de sauvegarde
      const response = await fetch(`/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsaveJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implémenter l'API de suppression de sauvegarde
      const response = await fetch(`/api/jobs/${jobId}/save`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la sauvegarde');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applyToJob,
    saveJob,
    unsaveJob,
    loading,
    error,
  };
};
