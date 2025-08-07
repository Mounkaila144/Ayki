import { useState, useEffect } from 'react';
import { apiClient, authUtils } from '@/lib/api';
import { useAuthToast } from './use-auth-toast';

export interface DashboardData {
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  applications: any[];
  documents: any[];
  stats: {
    profileViews: number;
    applications: number;
    interviews: number;
    offers: number;
  };
}

export const useCandidateDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    profile: null,
    experiences: [],
    education: [],
    skills: [],
    applications: [],
    documents: [],
    stats: {
      profileViews: 0,
      applications: 0,
      interviews: 0,
      offers: 0,
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useAuthToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier si l'utilisateur est connecté
      if (!authUtils.isAuthenticated()) {
        throw new Error('Utilisateur non connecté');
      }

      // Récupérer les données utilisateur stockées
      const userData = authUtils.getUser();
      
      // Récupérer le profil complet
      let profile;
      try {
        profile = await apiClient.getUserProfile();
      } catch (error) {
        // Si le profil n'existe pas encore, utiliser les données de base
        profile = {
          firstName: userData?.profile?.firstName || '',
          lastName: userData?.profile?.lastName || '',
          title: userData?.profile?.title || '',
          phone: userData?.phone || '',
          email: userData?.email || '',
          location: '',
          summary: '',
          profileCompletion: 30,
        };
      }

      // Récupérer les autres données en parallèle
      const [experiences, education, skills, applications, documents] = await Promise.allSettled([
        apiClient.getUserExperiences().catch(() => []),
        apiClient.getUserEducation().catch(() => []),
        apiClient.getUserSkills().catch(() => []),
        apiClient.getUserApplications().catch(() => []),
        apiClient.getUserDocuments().catch(() => []),
      ]);

      // Calculer les statistiques basées sur les données réelles
      const applicationsData = applications.status === 'fulfilled' ? applications.value : [];
      const stats = {
        profileViews: Math.floor(Math.random() * 200 + 50), // À remplacer par des vraies données
        applications: applicationsData.length,
        interviews: applicationsData.filter((app: any) => app.status === 'interview').length,
        offers: applicationsData.filter((app: any) => app.status === 'offer').length,
      };

      setData({
        profile,
        experiences: experiences.status === 'fulfilled' ? experiences.value : [],
        education: education.status === 'fulfilled' ? education.value : [],
        skills: skills.status === 'fulfilled' ? skills.value : [],
        applications: applicationsData,
        documents: documents.status === 'fulfilled' ? documents.value : [],
        stats,
      });
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur de chargement des données';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour mettre à jour les données
  const updateProfile = async (profileData: any) => {
    try {
      const updatedProfile = await apiClient.updateUserProfile(profileData);
      setData(prev => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil';
      showError(errorMessage);
      throw error;
    }
  };

  const addSkill = async (skillData: any) => {
    try {
      const newSkill = await apiClient.addUserSkill(skillData);
      setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      return newSkill;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la compétence';
      showError(errorMessage);
      throw error;
    }
  };

  const updateSkill = async (id: string, skillData: any) => {
    try {
      const updatedSkill = await apiClient.updateUserSkill(id, skillData);
      setData(prev => ({
        ...prev,
        skills: prev.skills.map(skill => skill.id === id ? updatedSkill : skill)
      }));
      return updatedSkill;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la compétence';
      showError(errorMessage);
      throw error;
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      await apiClient.removeUserSkill(skillId);
      setData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill.id !== skillId) }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la compétence';
      showError(errorMessage);
      throw error;
    }
  };

  const addExperience = async (experienceData: any) => {
    try {
      const newExperience = await apiClient.addUserExperience(experienceData);
      setData(prev => ({ ...prev, experiences: [...prev.experiences, newExperience] }));
      return newExperience;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'expérience';
      showError(errorMessage);
      throw error;
    }
  };

  const updateExperience = async (id: string, experienceData: any) => {
    try {
      const updatedExperience = await apiClient.updateUserExperience(id, experienceData);
      setData(prev => ({
        ...prev,
        experiences: prev.experiences.map(exp => exp.id === id ? updatedExperience : exp)
      }));
      return updatedExperience;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'expérience';
      showError(errorMessage);
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await apiClient.deleteUserExperience(id);
      setData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'expérience';
      showError(errorMessage);
      throw error;
    }
  };

  const uploadDocument = async (file: File, type: string = 'cv') => {
    try {
      const newDocument = await apiClient.uploadDocument(file, type);
      setData(prev => ({ ...prev, documents: [...prev.documents, newDocument] }));
      return newDocument;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload du document';
      showError(errorMessage);
      throw error;
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    try {
      const result = await apiClient.uploadProfilePhoto(file);
      // Rafraîchir le profil pour obtenir la nouvelle photo
      await fetchDashboardData();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload de la photo';
      showError(errorMessage);
      throw error;
    }
  };

  const addEducation = async (educationData: any) => {
    try {
      const newEducation = await apiClient.addUserEducation(educationData);
      setData(prev => ({ ...prev, education: [...prev.education, newEducation] }));
      return newEducation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la formation';
      showError(errorMessage);
      throw error;
    }
  };

  const updateEducation = async (id: string, educationData: any) => {
    try {
      const updatedEducation = await apiClient.updateUserEducation(id, educationData);
      setData(prev => ({
        ...prev,
        education: prev.education.map(edu => edu.id === id ? updatedEducation : edu)
      }));
      return updatedEducation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la formation';
      showError(errorMessage);
      throw error;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      await apiClient.deleteUserEducation(id);
      setData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la formation';
      showError(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboardData,
    updateProfile,
    addSkill,
    updateSkill,
    removeSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    uploadDocument,
    uploadProfilePhoto,
    addEducation,
    updateEducation,
    deleteEducation,
  };
};