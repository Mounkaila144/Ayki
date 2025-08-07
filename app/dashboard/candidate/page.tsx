"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  Eye,
  LogOut,
  Plus,
  X,
  Sparkles,
  Bell,
  Settings,
  Search,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  Star,
  Download,
  Share2,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { useCandidateDashboard } from "@/hooks/use-candidate-dashboard";
import { authUtils } from "@/lib/api";
import { useRouter } from "next/navigation";
import styles from '../dashboard.module.css';
import JobListings from "@/components/JobListings";
import JobListingsDemo from "@/components/JobListingsDemo";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export default function CandidateDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('annonce');
  const [newSkill, setNewSkill] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: ''
  });
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [educationForm, setEducationForm] = useState({
    degree: '',
    school: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    graduationYear: '',
    grade: '',
    description: ''
  });
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 'beginner',
    yearsOfExperience: 0,
    monthsOfExperience: 0,
    description: '',
    lastUsedDate: ''
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Fonction utilitaire pour formater les dates d'expérience
  const formatExperienceDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const currentText = isCurrent ? 'Présent' : end.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const startText = start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    return `${startText} - ${currentText}`;
  };
  
  // Utiliser le hook personnalisé pour les données
  const { 
    data, 
    loading, 
    error,
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
    deleteEducation
  } = useCandidateDashboard();

  useEffect(() => {
    setMounted(true);
    
    // Vérifier l'authentification
    if (!authUtils.isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
  }, [router]);

  const handleAddSkill = async () => {
    if (newSkill.trim() && !data.skills.some(skill => skill.skill?.name === newSkill.trim())) {
      try {
        await addSkill({ name: newSkill.trim(), level: 'beginner' });
        setNewSkill('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la compétence:', error);
      }
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await removeSkill(skillId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétence:', error);
    }
  };

  // Skills modal handlers
  const handleAddSkillModal = async () => {
    try {
      const skillData = {
        name: skillForm.name,
        level: skillForm.level,
        yearsOfExperience: skillForm.yearsOfExperience,
        monthsOfExperience: skillForm.monthsOfExperience,
        description: skillForm.description,
        lastUsedDate: skillForm.lastUsedDate || undefined
      };
      
      if (editingSkill) {
        // Mode édition
        await updateSkill(editingSkill.id, skillData);
      } else {
        // Mode ajout
        await addSkill(skillData);
      }
      
      setShowSkillModal(false);
      setEditingSkill(null);
      setSkillForm({
        name: '',
        level: 'beginner',
        yearsOfExperience: 0,
        monthsOfExperience: 0,
        description: '',
        lastUsedDate: ''
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la compétence:', error);
    }
  };

  const handleEditSkill = (userSkill: any) => {
    setEditingSkill(userSkill);
    setSkillForm({
      name: userSkill.skill?.name || '',
      level: userSkill.level || 'beginner',
      yearsOfExperience: userSkill.yearsOfExperience || 0,
      monthsOfExperience: userSkill.monthsOfExperience || 0,
      description: userSkill.description || '',
      lastUsedDate: userSkill.lastUsedDate ? userSkill.lastUsedDate.split('T')[0] : ''
    });
    setShowSkillModal(true);
  };

  // Fonction pour convertir le niveau en pourcentage
  const getSkillLevelPercentage = (level: string) => {
    switch(level) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 25;
    }
  };

  // Fonction pour obtenir le label du niveau
  const getSkillLevelLabel = (level: string) => {
    switch(level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      case 'expert': return 'Expert';
      default: return 'Débutant';
    }
  };

  // Générer les activités récentes basées sur les données réelles
  const getRecentActivities = () => {
    const activities = [];

    // Vérifier s'il y a des expériences récentes
    if (data.experiences?.length > 0) {
      const latestExperience = data.experiences[0];
      activities.push({
        icon: <Briefcase className="w-5 h-5 text-blue-500" />,
        title: 'Expérience ajoutée',
        subtitle: latestExperience.title + ' chez ' + latestExperience.company,
        time: 'Récemment',
        bgColor: 'bg-blue-50'
      });
    }

    // Vérifier s'il y a des compétences récentes
    if (data.skills?.length > 0) {
      const latestSkill = data.skills[0];
      activities.push({
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        title: 'Compétence ajoutée',
        subtitle: latestSkill.skill?.name || latestSkill.name,
        time: 'Récemment',
        bgColor: 'bg-yellow-50'
      });
    }

    // Vérifier s'il y a des formations récentes
    if (data.education?.length > 0) {
      const latestEducation = data.education[0];
      activities.push({
        icon: <GraduationCap className="w-5 h-5 text-green-500" />,
        title: 'Formation ajoutée',
        subtitle: latestEducation.degree + ' - ' + latestEducation.school,
        time: 'Récemment',
        bgColor: 'bg-green-50'
      });
    }

    // Si le profil est complet
    if (data.profile) {
      activities.push({
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        title: 'Profil mis à jour',
        subtitle: `Complété à ${data.profile.profileCompletion || 0}%`,
        time: 'Récemment',
        bgColor: 'bg-green-50'
      });
    }

    // Activités par défaut si pas de données
    if (activities.length === 0) {
      activities.push({
        icon: <User className="w-5 h-5 text-blue-500" />,
        title: 'Profil créé',
        subtitle: 'Bienvenue sur la plateforme !',
        time: 'Aujourd\'hui',
        bgColor: 'bg-blue-50'
      });
    }

    return activities.slice(0, 3); // Limite à 3 activités
  };

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop volumineuse. Taille maximum : 5MB');
      return;
    }

    setUploading(true);
    try {
      // Utiliser la nouvelle fonction uploadProfilePhoto
      await uploadProfilePhoto(file);
      
      alert('Photo de profil mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileForm);
      setEditingProfile(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    }
  };

  const handleAddExperience = async () => {
    try {
      const experienceData = {
        ...experienceForm,
        endDate: experienceForm.isCurrentJob ? null : experienceForm.endDate
      };
      
      if (editingExperience) {
        // Mode édition
        await updateExperience(editingExperience.id, experienceData);
      } else {
        // Mode ajout
        await addExperience(experienceData);
      }
      
      setShowExperienceModal(false);
      setEditingExperience(null);
      setExperienceForm({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: ''
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'expérience:', error);
    }
  };

  const handleEditExperience = (experience: any) => {
    // Formatter les dates pour les inputs de type month
    const formatDateForInput = (date: string) => {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    setEditingExperience(experience);
    setExperienceForm({
      title: experience.title || '',
      company: experience.company || '',
      location: experience.location || '',
      startDate: formatDateForInput(experience.startDate),
      endDate: formatDateForInput(experience.endDate),
      isCurrentJob: experience.isCurrent || false,
      description: experience.description || ''
    });
    setShowExperienceModal(true);
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      try {
        await deleteExperience(experienceId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'expérience:', error);
      }
    }
  };

  // Education handlers
  const handleAddEducation = async () => {
    try {
      const educationData = {
        ...educationForm,
        graduationYear: educationForm.graduationYear ? parseInt(educationForm.graduationYear) : null
      };
      
      if (editingEducation) {
        // Mode édition
        await updateEducation(editingEducation.id, educationData);
      } else {
        // Mode ajout
        await addEducation(educationData);
      }
      
      setShowEducationModal(false);
      setEditingEducation(null);
      setEducationForm({
        degree: '',
        school: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        graduationYear: '',
        grade: '',
        description: ''
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la formation:', error);
    }
  };

  const handleEditEducation = (education: any) => {
    // Formatter les dates pour les inputs de type month
    const formatDateForInput = (date: string) => {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    setEditingEducation(education);
    setEducationForm({
      degree: education.degree || '',
      school: education.school || '',
      fieldOfStudy: education.fieldOfStudy || '',
      startDate: formatDateForInput(education.startDate),
      endDate: formatDateForInput(education.endDate),
      graduationYear: education.graduationYear ? education.graduationYear.toString() : '',
      grade: education.grade || '',
      description: education.description || ''
    });
    setShowEducationModal(true);
  };

  const handleDeleteEducation = async (educationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await deleteEducation(educationId);
      } catch (error) {
        console.error('Erreur lors de la suppression de la formation:', error);
      }
    }
  };

  // Initialiser le formulaire avec les données du profil
  useEffect(() => {
    if (data.profile) {
      setProfileForm(data.profile);
    }
  }, [data.profile]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className={`${styles['loading-spinner']} w-8 h-8`}></div>
        <p className="ml-3 text-gray-600">Chargement du dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <Button onClick={() => window.location.reload()}>Recharger</Button>
        </div>
      </div>
    );
  }

  const { profile, experiences, education, skills, stats } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30">
      {/* Header */}
      <header className={`bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm ${styles['glass-effect']}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className={`flex items-center space-x-3 ${styles['slide-in-left']}`}>
              <div className={`w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center ${styles['pulse-animation']} shadow-lg`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  AYKI
                </h1>
                <p className="text-xs text-gray-500">Dashboard Candidat</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className={`flex items-center space-x-2 sm:space-x-4 ${styles['slide-in-right']}`}>
              {/* Notifications */}
              <Button variant="ghost" size="sm" className={`${styles['button-hover']} relative p-2`}>
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              {/* Settings - Hidden on mobile */}
              <Button variant="ghost" size="sm" className={`${styles['button-hover']} p-2 hidden sm:flex`}>
                <Settings className="w-4 h-4" />
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    {/* Profile Info - Hidden on mobile */}
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {profile?.firstName || 'Utilisateur'} {profile?.lastName || ''}
                      </p>
                      <p className="text-xs text-gray-500">{profile?.title || 'Profil à compléter'}</p>
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-md">
                      {data.profile?.avatar ? (
                        <img
                          src={data.profile.avatar.startsWith('/uploads/') ? `http://localhost:3001${data.profile.avatar}` : data.profile.avatar}
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-white">
                          {profile?.firstName?.[0] || 'U'}{profile?.lastName?.[0] || ''}
                        </span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.firstName || 'Utilisateur'} {profile?.lastName || ''}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile?.email || 'Email non renseigné'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="sm:hidden">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className={`mb-8 ${styles['slide-in-up']}`}>
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                Bonjour {profile?.firstName || 'Utilisateur'} ! 👋
              </h2>
              <p className="text-blue-100 mb-4">
                Votre profil est complété à {profile?.profileCompletion || 30}%. Continuez à l'améliorer pour attirer plus d'opportunités !
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Progress value={profile?.profileCompletion || 30} className="h-2 bg-white/20" />
                </div>
                <span className="text-sm font-medium">{profile?.profileCompletion || 30}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ${styles['slide-in-up']}`} style={{ animationDelay: '0.1s' }}>
          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues du profil</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{stats.profileViews}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">+12% ce mois</p>
            </CardContent>
          </Card>

          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Candidatures</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{stats.applications}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">+3 cette semaine</p>
            </CardContent>
          </Card>

          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entretiens</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{stats.interviews}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-xs text-blue-600 mt-2">1 programmé</p>
            </CardContent>
          </Card>

          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offres</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{stats.offers}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">En attente</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-5 ${styles['slide-in-left']}`} style={{ animationDelay: '0.2s' }}>
                <TabsTrigger value="annonce" className={styles['tab-hover']}>Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="profile" className={styles['tab-hover']}>Profil</TabsTrigger>
                <TabsTrigger value="experience" className={styles['tab-hover']}>Expérience</TabsTrigger>
                <TabsTrigger value="education" className={styles['tab-hover']}>Formation</TabsTrigger>
                <TabsTrigger value="skills" className={styles['tab-hover']}>Compétences</TabsTrigger>
              </TabsList>

              {/* Annonces Tab */}
              <TabsContent value="annonce" className={`space-y-6 ${styles['fade-in']}`}>
                {/* Composant de liste des offres d'emploi */}
                <JobListings className="w-full" />

                {/* Recommendations */}
                <Card className={styles['card-hover']}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Recommandations pour améliorer votre profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ajoutez une photo de profil</p>
                        <p className="text-xs text-gray-600">Les profils avec photo reçoivent 40% de vues en plus</p>
                      </div>
                      {data.profile?.avatar ? (
                        <Button size="sm" className={styles['button-hover']} disabled>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Ajoutée
                        </Button>
                      ) : (
                        <label className="cursor-pointer">
                          <Button size="sm" className={styles['button-hover']} asChild>
                            <span>Ajouter</span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Complétez votre section expérience</p>
                        <p className="text-xs text-gray-600">Ajoutez plus de détails sur vos réalisations</p>
                      </div>
                      <Button size="sm" className={styles['button-hover']}>
                        Compléter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className={`space-y-6 ${styles['fade-in']}`}>
                <Card className={styles['card-hover']}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Informations personnelles
                      </div>
                      {editingProfile ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveProfile} className={styles['button-hover']}>
                            Sauvegarder
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProfile(false)} className={styles['button-hover']}>
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditingProfile(true)} className={styles['button-hover']}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Section photo de profil */}
                    <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {data.profile?.avatar ? (
                            <img
                              src={data.profile.avatar.startsWith('/uploads/') ? `http://localhost:3001${data.profile.avatar}` : data.profile.avatar}
                              alt="Photo de profil"
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        {editingProfile && (
                          <label className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePhotoUpload}
                              className="hidden"
                              disabled={uploading}
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Photo de profil</h3>
                        <p className="text-sm text-gray-500">
                          {data.profile?.avatar 
                            ? 'Cliquez sur l\'icône pour changer votre photo'
                            : 'Ajoutez une photo pour personnaliser votre profil'
                          }
                        </p>
                        {uploading && (
                          <div className="flex items-center mt-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                            <span className="text-sm text-blue-600">Upload en cours...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName || ''}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          className={styles['input-focus']}
                          disabled={!editingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName || ''}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          className={styles['input-focus']}
                          disabled={!editingProfile}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Titre professionnel
                      </Label>
                      <Input
                        id="title"
                        value={profileForm.title || ''}
                        onChange={(e) => setProfileForm({...profileForm, title: e.target.value})}
                        className={styles['input-focus']}
                        disabled={!editingProfile}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          className={styles['input-focus']}
                          disabled={!editingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          value={profileForm.phone || ''}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          className={styles['input-focus']}
                          disabled={!editingProfile}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Localisation
                      </Label>
                      <Input
                        id="location"
                        value={profileForm.location || ''}
                        onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                        className={styles['input-focus']}
                        disabled={!editingProfile}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Résumé professionnel
                      </Label>
                      <Textarea
                        id="summary"
                        value={profileForm.summary || ''}
                        onChange={(e) => setProfileForm({...profileForm, summary: e.target.value})}
                        rows={4}
                        className={styles['input-focus']}
                        placeholder="Décrivez votre parcours, vos compétences et vos objectifs professionnels..."
                        disabled={!editingProfile}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className={`space-y-6 ${styles['fade-in']}`}>
                <Card className={styles['card-hover']}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                        Expérience professionnelle
                      </div>
                      <Dialog open={showExperienceModal} onOpenChange={setShowExperienceModal}>
                        <DialogTrigger asChild>
                          <Button size="sm" className={styles['button-hover']}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une expérience
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardTitle>
                    <CardDescription>
                      Mettez en valeur votre parcours professionnel et vos réalisations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {experiences?.length > 0 ? experiences.map((exp, index) => (
                      <div key={exp.id} className={`border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 hover:shadow-md transition-all duration-300 ${styles['card-hover']}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                              {exp.isCurrent && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Actuel
                                </Badge>
                              )}
                            </div>
                            <p className="text-blue-600 font-medium mb-1">{exp.company}</p>
                            {exp.location && (
                              <p className="text-sm text-gray-500 flex items-center mb-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {exp.location}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatExperienceDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={styles['button-hover']}
                              onClick={() => handleEditExperience(exp)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={styles['button-hover']}
                              onClick={() => handleDeleteExperience(exp.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {exp.technologies.map((tech: string, techIndex: number) => (
                              <Badge key={techIndex} variant="outline" className={styles['skill-badge']}>
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune expérience professionnelle ajoutée.</p>
                        <p className="text-sm">Ajoutez vos expériences pour valoriser votre parcours !</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className={`space-y-6 ${styles['fade-in']}`}>
                <Card className={styles['card-hover']}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
                        Formation et Éducation
                      </div>
                      <Dialog open={showEducationModal} onOpenChange={setShowEducationModal}>
                        <DialogTrigger asChild>
                          <Button size="sm" className={styles['button-hover']}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une formation
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardTitle>
                    <CardDescription>
                      Votre parcours académique et vos certifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {education?.length > 0 ? education.map((edu) => (
                      <div key={edu.id} className={`border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-indigo-50/30 hover:shadow-md transition-all duration-300 ${styles['card-hover']}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{edu.degree}</h3>
                            <p className="text-indigo-600 font-medium mb-1">{edu.school}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-sm text-gray-600 mb-1">{edu.fieldOfStudy}</p>
                            )}
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {edu.graduationYear ? `Diplômé en ${edu.graduationYear}` : 
                               edu.endDate ? `Fin prévue en ${new Date(edu.endDate).getFullYear()}` : 
                               'En cours'}
                            </p>
                            {edu.grade && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Award className="w-4 h-4 mr-1" />
                                {edu.grade}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={styles['button-hover']}
                              onClick={() => handleEditEducation(edu)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={styles['button-hover']}
                              onClick={() => handleDeleteEducation(edu.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {edu.description && (
                          <div className="mt-4">
                            <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune formation ajoutée.</p>
                        <p className="text-sm">Ajoutez vos diplômes et certifications !</p>
                      </div>
                    )}

                    {/* Certifications Section */}
                    <div className="mt-8">
                      <h4 className="font-semibold text-lg mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-500" />
                        Certifications
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 bg-yellow-50/50">
                          <div className="flex items-center space-x-3">
                            <Award className="w-8 h-8 text-yellow-500" />
                            <div>
                              <h5 className="font-medium">AWS Certified Developer</h5>
                              <p className="text-sm text-gray-600">Amazon Web Services</p>
                              <p className="text-xs text-gray-500">Valide jusqu'en 2025</p>
                            </div>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4 bg-blue-50/50">
                          <div className="flex items-center space-x-3">
                            <Award className="w-8 h-8 text-blue-500" />
                            <div>
                              <h5 className="font-medium">React Developer Certification</h5>
                              <p className="text-sm text-gray-600">Meta</p>
                              <p className="text-xs text-gray-500">Obtenu en 2023</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className={`space-y-6 ${styles['fade-in']}`}>
                <Card className={styles['card-hover']}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Compétences Techniques
                    </CardTitle>
                    <CardDescription>
                      Ajoutez vos compétences et évaluez votre niveau
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Ajout rapide (ex: React, Python...)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                          className={styles['input-focus']}
                        />
                        <Button onClick={handleAddSkill} className={styles['button-hover']}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSkillModal(true)}
                          className="text-sm"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Ajouter avec détails
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Mes Compétences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills?.length > 0 ? skills.map((userSkill) => (
                          <div key={userSkill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3 flex-1">
                              <Badge variant="secondary" className={`${styles['skill-badge']} bg-blue-100 text-blue-700`}>
                                {userSkill.skill?.name || userSkill.name}
                              </Badge>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-600">
                                    {getSkillLevelLabel(userSkill.level)}
                                  </span>
                                  {userSkill.yearsOfExperience > 0 && (
                                    <span className="text-xs text-gray-500">
                                      {userSkill.yearsOfExperience} an{userSkill.yearsOfExperience > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                <Progress value={getSkillLevelPercentage(userSkill.level)} className="h-2" />
                              </div>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSkill(userSkill)}
                                className="p-1 hover:text-blue-500 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveSkill(userSkill.id)}
                                className="p-1 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )) : (
                          <div className="col-span-2 text-center py-8 text-gray-500">
                            <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Aucune compétence ajoutée pour le moment.</p>
                            <p className="text-sm">Commencez par ajouter vos compétences principales !</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skill Categories */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Catégories de Compétences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg bg-blue-50/50">
                          <h5 className="font-medium text-blue-700 mb-2">Frontend</h5>
                          <div className="flex flex-wrap gap-1">
                            {skills.filter(skill => ['React', 'TypeScript'].includes(skill)).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg bg-green-50/50">
                          <h5 className="font-medium text-green-700 mb-2">Backend</h5>
                          <div className="flex flex-wrap gap-1">
                            {skills.filter(skill => ['Node.js', 'Python', 'MongoDB'].includes(skill)).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg bg-purple-50/50">
                          <h5 className="font-medium text-purple-700 mb-2">DevOps</h5>
                          <div className="flex flex-wrap gap-1">
                            {skills.filter(skill => ['Docker', 'AWS'].includes(skill)).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Profile Preview */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className={`sticky top-8 ${styles['card-hover']} ${styles['slide-in-right']}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-500" />
                      Aperçu du profil
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {profile.profileCompletion}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 ${styles['pulse-animation']} shadow-lg overflow-hidden`}>
                      {data.profile?.avatar ? (
                        <img
                          src={data.profile.avatar.startsWith('/uploads/') ? `http://localhost:3001${data.profile.avatar}` : data.profile.avatar}
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {profile?.firstName?.[0] || 'U'}{profile?.lastName?.[0] || ''}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {profile?.firstName || 'Utilisateur'} {profile?.lastName || ''}
                    </h3>
                    <p className="text-blue-600 font-medium">{profile?.title || 'Profil à compléter'}</p>
                    <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile?.location || 'Non renseigné'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Profil complété</span>
                      <span className="font-medium">{profile?.profileCompletion || 30}%</span>
                    </div>
                    <Progress value={profile?.profileCompletion || 30} className="h-2" />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      À propos
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {profile?.summary ? (
                        profile.summary.length > 120
                          ? `${profile.summary.substring(0, 120)}...`
                          : profile.summary
                      ) : (
                        <span className="text-gray-400 italic">Ajoutez un résumé professionnel pour vous présenter aux recruteurs.</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Compétences clés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills?.length > 0 ? (
                        <>
                          {skills.slice(0, 6).map((skill) => (
                            <Badge key={skill.id} variant="outline" className={`text-xs ${styles['skill-badge']}`}>
                              {skill.name}
                            </Badge>
                          ))}
                          {skills.length > 6 && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                              +{skills.length - 6} autres
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Aucune compétence ajoutée</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {profile?.email || 'Non renseigné'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {profile?.phone || 'Non renseigné'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href={`/profile/${profile?.firstName?.toLowerCase() || 'user'}-${profile?.lastName?.toLowerCase() || ''}`}>
                      <Button className={`w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 ${styles['button-hover']}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir le profil public
                      </Button>
                    </Link>

                    <Button variant="outline" className={`w-full ${styles['button-hover']}`}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager le profil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className={`${styles['card-hover']} ${styles['slide-in-right']}`} style={{ animationDelay: '0.1s' }}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.profileViews}</p>
                      <p className="text-xs text-gray-500">Vues ce mois</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.applications}</p>
                      <p className="text-xs text-gray-500">Candidatures</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Membre depuis</p>
                    <p className="font-medium">Janvier 2024</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'expérience */}
      <Dialog open={showExperienceModal} onOpenChange={(open) => {
        setShowExperienceModal(open);
        if (!open) {
          setEditingExperience(null);
          setExperienceForm({
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrentJob: false,
            description: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Modifier l\'expérience professionnelle' : 'Ajouter une expérience professionnelle'}
            </DialogTitle>
            <DialogDescription>
              {editingExperience 
                ? 'Modifiez les détails de votre expérience professionnelle'
                : 'Ajoutez votre expérience professionnelle pour enrichir votre profil'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre du poste *</Label>
                <Input
                  id="title"
                  placeholder="ex: Développeur Full-Stack"
                  value={experienceForm.title}
                  onChange={(e) => setExperienceForm({...experienceForm, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  placeholder="ex: Google"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="ex: Paris, France"
                value={experienceForm.location}
                onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={experienceForm.startDate}
                  onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="month"
                  disabled={experienceForm.isCurrentJob}
                  value={experienceForm.endDate}
                  onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCurrentJob"
                checked={experienceForm.isCurrentJob}
                onCheckedChange={(checked) => setExperienceForm({
                  ...experienceForm, 
                  isCurrentJob: !!checked,
                  endDate: checked ? '' : experienceForm.endDate
                })}
              />
              <Label htmlFor="isCurrentJob">J&apos;occupe actuellement ce poste</Label>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez vos missions, réalisations et compétences acquises..."
                className="min-h-[100px]"
                value={experienceForm.description}
                onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowExperienceModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddExperience}
              disabled={!experienceForm.title || !experienceForm.company || !experienceForm.startDate}
            >
              {editingExperience ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier l&apos;expérience
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter l&apos;expérience
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout/modification de formation */}
      <Dialog open={showEducationModal} onOpenChange={(open) => {
        setShowEducationModal(open);
        if (!open) {
          setEditingEducation(null);
          setEducationForm({
            degree: '',
            school: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            graduationYear: '',
            grade: '',
            description: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? 'Modifier la formation' : 'Ajouter une formation'}
            </DialogTitle>
            <DialogDescription>
              {editingEducation 
                ? 'Modifiez les détails de votre formation'
                : 'Ajoutez votre formation pour enrichir votre profil'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degree">Diplôme *</Label>
                <Input
                  id="degree"
                  placeholder="ex: Master en Informatique"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="school">École/Université *</Label>
                <Input
                  id="school"
                  placeholder="ex: Université de Paris"
                  value={educationForm.school}
                  onChange={(e) => setEducationForm({...educationForm, school: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fieldOfStudy">Domaine d&apos;étude</Label>
              <Input
                id="fieldOfStudy"
                placeholder="ex: Informatique, Génie Logiciel"
                value={educationForm.fieldOfStudy}
                onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={educationForm.startDate}
                  onChange={(e) => setEducationForm({...educationForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={educationForm.endDate}
                  onChange={(e) => setEducationForm({...educationForm, endDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="graduationYear">Année de diplôme</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="ex: 2023"
                  min="1950"
                  max="2030"
                  value={educationForm.graduationYear}
                  onChange={(e) => setEducationForm({...educationForm, graduationYear: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="grade">Mention/Note</Label>
              <Input
                id="grade"
                placeholder="ex: Très Bien, 16/20, A"
                value={educationForm.grade}
                onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez vos projets, cours principaux, activités..."
                className="min-h-[100px]"
                value={educationForm.description}
                onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEducationModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddEducation}
              disabled={!educationForm.degree || !educationForm.school}
            >
              {editingEducation ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier la formation
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter la formation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'ajout/modification de compétence */}
      <Dialog open={showSkillModal} onOpenChange={(open) => {
        setShowSkillModal(open);
        if (!open) {
          setEditingSkill(null);
          setSkillForm({
            name: '',
            level: 'beginner',
            yearsOfExperience: 0,
            monthsOfExperience: 0,
            description: '',
            lastUsedDate: ''
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? 'Modifier la compétence' : 'Ajouter une compétence'}
            </DialogTitle>
            <DialogDescription>
              {editingSkill 
                ? 'Modifiez les détails de votre compétence'
                : 'Ajoutez une compétence avec votre niveau et expérience'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="skillName">Nom de la compétence *</Label>
              <Input
                id="skillName"
                placeholder="ex: React, Python, Adobe Photoshop..."
                value={skillForm.name}
                onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                disabled={!!editingSkill}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillLevel">Niveau de maîtrise *</Label>
                <select
                  id="skillLevel"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({...skillForm, level: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <Label htmlFor="yearsExp">Années d&apos;expérience</Label>
                <Input
                  id="yearsExp"
                  type="number"
                  min="0"
                  max="50"
                  value={skillForm.yearsOfExperience}
                  onChange={(e) => setSkillForm({...skillForm, yearsOfExperience: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthsExp">Mois supplémentaires</Label>
                <Input
                  id="monthsExp"
                  type="number"
                  min="0"
                  max="11"
                  value={skillForm.monthsOfExperience}
                  onChange={(e) => setSkillForm({...skillForm, monthsOfExperience: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="lastUsed">Dernière utilisation</Label>
                <Input
                  id="lastUsed"
                  type="date"
                  value={skillForm.lastUsedDate}
                  onChange={(e) => setSkillForm({...skillForm, lastUsedDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="skillDescription">Description (optionnel)</Label>
              <Textarea
                id="skillDescription"
                placeholder="Décrivez votre expérience avec cette compétence, projets réalisés..."
                className="min-h-[80px]"
                value={skillForm.description}
                onChange={(e) => setSkillForm({...skillForm, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSkillModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddSkillModal}
              disabled={!skillForm.name}
            >
              {editingSkill ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier la compétence
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Ajouter la compétence
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}