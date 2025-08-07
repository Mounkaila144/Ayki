import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

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
  salaryNegotiable: boolean;
  positions: number;
  applicationDeadline?: Date;
  startDate?: Date;
  status: string;
  languages?: string[];
  benefits_list?: string[];
  tags?: string[];
  viewCount: number;
  applicationCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  recruiterId: string;
  companyId: string;
  company?: any;
  applications?: any[];
}

export const useJobOffers = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchMyJobs = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyJobOffers(filters);
      
      setJobs(response.data || []);
      setPagination({
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = useCallback(async (jobData: Partial<JobOffer>) => {
    try {
      setLoading(true);
      setError(null);
      const newJob = await apiClient.createJobOffer(jobData);
      
      // Recharger la liste après création
      await fetchMyJobs();
      
      return newJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyJobs]);

  const updateJob = useCallback(async (id: string, jobData: Partial<JobOffer>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedJob = await apiClient.updateJobOffer(id, jobData);
      
      // Mettre à jour localement
      setJobs(prev => prev.map(job => 
        job.id === id ? { ...job, ...updatedJob } : job
      ));
      
      return updatedJob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteJobOffer(id);
      
      // Supprimer localement
      setJobs(prev => prev.filter(job => job.id !== id));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les jobs au montage du composant
  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchMyJobs,
    createJob,
    updateJob,
    deleteJob,
  };
};