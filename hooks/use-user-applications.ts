import { useState, useEffect, useCallback } from 'react';

export interface UserApplication {
  id: string;
  jobOfferId: string;
  status: string;
  createdAt: string;
  jobOffer?: {
    id: string;
    title: string;
    company?: {
      name: string;
    };
  };
}

export interface UseUserApplicationsReturn {
  applications: UserApplication[];
  loading: boolean;
  error: string | null;
  hasAppliedToJob: (jobId: string) => boolean;
  getApplicationForJob: (jobId: string) => UserApplication | undefined;
  refetch: () => Promise<void>;
}

export const useUserApplications = (): UseUserApplicationsReturn => {
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les candidatures de l'utilisateur
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        // Si pas de token, pas de candidatures
        setApplications([]);
        return;
      }

      const response = await fetch('/api/applications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalide, effacer les candidatures
          setApplications([]);
          return;
        }
        throw new Error('Erreur lors de la récupération des candidatures');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour vérifier si l'utilisateur a postulé à une offre
  const hasAppliedToJob = useCallback((jobId: string): boolean => {
    return applications.some(app => app.jobOfferId === jobId);
  }, [applications]);

  // Fonction pour récupérer la candidature pour une offre spécifique
  const getApplicationForJob = useCallback((jobId: string): UserApplication | undefined => {
    return applications.find(app => app.jobOfferId === jobId);
  }, [applications]);

  // Récupération initiale des données
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    hasAppliedToJob,
    getApplicationForJob,
    refetch: fetchApplications,
  };
};
