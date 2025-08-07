"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RecruiterJobsList from "@/components/RecruiterJobsList";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Download,
  Eye,
  LogOut,
  Sparkles,
  User,
  Bell,
  Settings,
  Calendar,
  Mail,
  Phone,
  Star,
  TrendingUp,
  Users,
  Building2,
  Target,
  Clock,
  CheckCircle,
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  MoreVertical,
  Award,
  GraduationCap,
  Globe,
  Zap,
  FileText,
  Send,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/api";
import { useRecruiterDashboard, Candidate } from "@/hooks/use-recruiter-dashboard";
import { useJobOffers, JobOffer } from "@/hooks/use-job-offers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import JobModal from "@/components/JobModal";
import styles from '../dashboard.module.css';

export default function RecruiterDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('match');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);

  const router = useRouter();

  const {
    data,
    loading,
    error,
    searchCandidates,
    toggleBookmark,
    loadMoreCandidates,
    refetch
  } = useRecruiterDashboard();

  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    createJob,
    updateJob,
    deleteJob,
    fetchMyJobs
  } = useJobOffers();

  useEffect(() => {
    setMounted(true);

    // Vérifier l'authentification
    if (!authUtils.isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
  }, [router]);

  // Déclencher la recherche automatiquement quand les filtres changent
  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, locationFilter, skillFilter, experienceFilter, salaryFilter, sortBy, mounted]);

  const handleSearch = () => {
    const filters = {
      search: searchTerm,
      location: locationFilter,
      skills: skillFilter ? [skillFilter] : undefined,
      experience: experienceFilter,
      salary: salaryFilter,
      sortBy: sortBy as any,
      sortOrder: 'desc' as const,
    };

    searchCandidates(filters);
  };

  const handleBookmarkToggle = async (candidateId: string) => {
    try {
      await toggleBookmark(candidateId);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
    }
  };

  const getBookmarkedCandidates = () => {
    return data.bookmarkedCandidates;
  };

  const handleLogout = () => {
    authUtils.logout();
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobModal(true);
  };

  const handleEditJob = (job: JobOffer) => {
    setEditingJob(job);
    setShowJobModal(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await deleteJob(jobId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleSaveJob = async (jobData: any) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
      } else {
        await createJob(jobData);
      }
      setShowJobModal(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setEditingJob(null);
  };

  const getJobStatusLabel = (status: string) => {
    const labels = {
      'draft': 'Brouillon',
      'published': 'Publiée',
      'paused': 'En pause',
      'closed': 'Fermée',
      'expired': 'Expirée',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getJobStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-700',
      'published': 'bg-green-100 text-green-700',
      'paused': 'bg-yellow-100 text-yellow-700',
      'closed': 'bg-red-100 text-red-700',
      'expired': 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  // Affichage des erreurs d'authentification
  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>;
  }

  if (error && error.includes('non connecté')) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">Erreur: Utilisateur non connecté</p>
        <Button onClick={() => router.push('/auth/signin')}>Se connecter</Button>
      </div>
    </div>;
  }

  // Utiliser les données du hook au lieu des données filtrées localement
  const filteredCandidates = data.candidates || [];
  const allSkills = Array.from(new Set((data.candidates || []).flatMap(c => c.skills || [])));
  const allLocations = Array.from(new Set((data.candidates || []).map(c => c.location).filter(Boolean)));

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      {/* Enhanced Header */}
      <header className={`bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm ${styles['glass-effect']}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className={`flex items-center space-x-3 ${styles['slide-in-left']}`}>
              <div className={`w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center ${styles['pulse-animation']} shadow-lg`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  AYKI
                </h1>
                <p className="text-xs text-gray-500">Dashboard Recruteur</p>
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
                        {data.profile?.firstName || 'Recruteur'} {data.profile?.lastName || ''}
                      </p>
                      <p className="text-xs text-gray-500">{data.profile?.company || 'Entreprise'}</p>
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-md">
                      {data.profile?.avatar ? (
                        <img
                          src={data.profile.avatar.startsWith('/uploads/') ? `http://localhost:3001${data.profile.avatar}` : data.profile.avatar}
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-white">
                          {data.profile?.firstName?.[0] || 'R'}{data.profile?.lastName?.[0] || ''}
                        </span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {data.profile?.firstName || 'Recruteur'} {data.profile?.lastName || ''}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {data.profile?.email || 'Email non renseigné'}
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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                Bonjour {data.profile?.firstName || 'Recruteur'} ! 🎯
              </h2>
              <p className="text-green-100 mb-4">
                {loading ? 'Chargement des candidats...' :
                 `Découvrez ${data.totalCandidates} talents exceptionnels qui correspondent à vos critères de recherche.`}
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.stats.totalCandidates}</div>
                  <div className="text-sm text-green-100">Candidats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.stats.bookmarkedCandidates}</div>
                  <div className="text-sm text-green-100">Annonce</div>
                </div>
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
                  <p className="text-sm font-medium text-gray-600">Candidats disponibles</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{data.stats.totalCandidates}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">+5 cette semaine</p>
            </CardContent>
          </Card>

          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annonces</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{data.stats.bookmarkedCandidates}</p>
                </div>
                <Bookmark className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-blue-600 mt-2">Profils sauvegardés</p>
            </CardContent>
          </Card>

          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entretiens</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{data.stats.interviewsScheduled}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-xs text-purple-600 mt-2">3 programmés</p>
            </CardContent>
          </Card>

          <Card className={`${styles['card-hover']} ${styles['stat-card']}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recrutements</p>
                  <p className={`text-2xl font-bold ${styles['stat-number']}`}>{data.stats.hiredCandidates}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-4 ${styles['slide-in-left']}`} style={{ animationDelay: '0.2s' }}>
            <TabsTrigger value="search" className={styles['tab-hover']}>🔍 Recherche</TabsTrigger>
            <TabsTrigger value="bookmarks" className={styles['tab-hover']}>⭐ Annonces</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className={`space-y-6 ${styles['fade-in']}`}>
            {/* Enhanced Search and Filters */}
            <Card className={`${styles['card-hover']}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 mr-2 text-green-500" />
                    Recherche Avancée
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={styles['button-hover']}
                    >
                      <div className="grid grid-cols-2 gap-1 w-4 h-4">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                      </div>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={styles['button-hover']}
                    >
                      <div className="space-y-1 w-4 h-4">
                        <div className="bg-current h-0.5 rounded"></div>
                        <div className="bg-current h-0.5 rounded"></div>
                        <div className="bg-current h-0.5 rounded"></div>
                      </div>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Trouvez les meilleurs talents avec nos filtres intelligents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <Input
                        placeholder="🔍 Rechercher par nom, titre ou compétence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full ${styles['input-focus']}`}
                    />
                  </div>
                  <Select onValueChange={setLocationFilter}>
                    <SelectTrigger className={styles['input-focus']}>
                      <SelectValue placeholder="📍 Localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {allLocations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredCandidates.length} candidat{filteredCandidates.length > 1 ? 's' : ''} trouvé{filteredCandidates.length > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-gray-600">
                  Triés par {sortBy === 'match' ? 'meilleur match' : sortBy === 'rating' ? 'note' : sortBy === 'experience' ? 'expérience' : 'dernière activité'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {data.bookmarkedCandidates.length} favoris
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {filteredCandidates.filter(c => (c.matchScore || 0) > 90).length} matches parfaits
                </Badge>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Recherche en cours...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => refetch()} variant="outline">
                  Réessayer
                </Button>
              </div>
            )}

            {/* Enhanced Candidates Grid */}
            {!loading && !error && (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                {filteredCandidates.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 mb-4">Aucun candidat trouvé avec ces critères</p>
                    <Button onClick={() => {
                      setSearchTerm('');
                      setLocationFilter('');
                      setSkillFilter('');
                      setExperienceFilter('');
                      setSalaryFilter('');
                    }} variant="outline">
                      Réinitialiser les filtres
                    </Button>
                  </div>
                ) : (
                  filteredCandidates.map((candidate, index) => (
                <Card key={candidate.id} className={`${styles['card-hover']} relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 border-2 hover:border-green-200 transition-all duration-300`}>
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      variant="secondary"
                      className={`${
                        (candidate.matchScore || 0) > 90 ? 'bg-green-100 text-green-700' :
                        (candidate.matchScore || 0) > 80 ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      } font-bold`}
                    >
                      {candidate.matchScore}% match
                    </Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-14 h-14 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center ${styles['pulse-animation']} shadow-lg`}>
                          <span className="text-lg font-bold text-white">
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {candidate.firstName} {candidate.lastName}
                            {candidate.rating && (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-600 ml-1">
                                  {candidate.rating}
                                </span>
                              </div>
                            )}
                          </CardTitle>
                          <p className="text-sm text-green-600 font-medium">{candidate.title}</p>
                          <p className="text-xs text-gray-500">{candidate.company}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmarkToggle(candidate.id)}
                        className={`${styles['button-hover']} ${candidate.isBookmarked ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        <Heart className={`w-4 h-4 ${candidate.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2 text-green-500" />
                        {candidate.experience}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2 text-purple-500" />
                        {candidate.salary}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        Actif {candidate.lastActive}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {candidate.summary.length > 120
                          ? `${candidate.summary.substring(0, 120)}...`
                          : candidate.summary
                        }
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs font-medium text-gray-500 mb-2">COMPÉTENCES CLÉS</h5>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline" className={`text-xs ${styles['skill-badge']} bg-blue-50 text-blue-700 border-blue-200`}>
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                            +{candidate.skills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={`text-xs ${
                          candidate.availability === 'Immédiate' ? 'bg-green-100 text-green-700' :
                          candidate.availability?.includes('semaine') ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {candidate.availability}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {candidate.education}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Link href={`/profile/${candidate.firstName.toLowerCase()}-${candidate.lastName.toLowerCase()}`} className="flex-1">
                        <Button variant="outline" size="sm" className={`w-full ${styles['button-hover']}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Profil
                        </Button>
                      </Link>
                      <Button size="sm" className={`bg-green-600 hover:bg-green-700 ${styles['button-hover']}`}>
                        <Download className="w-4 h-4 mr-2" />
                        CV
                      </Button>
                      <Button size="sm" variant="outline" className={styles['button-hover']}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  ))
                )}
              </div>
            )}

            {/* Load More Button */}
            {!loading && !error && data.currentPage < data.totalPages && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMoreCandidates}
                  variant="outline"
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  Charger plus de candidats
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className={`space-y-6 ${styles['fade-in']}`}>
            <Card className={styles['card-hover']}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                    Mes Annonces ({jobs.length})
                  </div>
                  <Button 
                    onClick={handleCreateJob}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle annonce
                  </Button>
                </CardTitle>
                <CardDescription>
                  Gérez vos offres d&apos;emploi et suivez les candidatures
                </CardDescription>
              </CardHeader>
              <RecruiterJobsList
                jobs={jobs}
                jobsLoading={jobsLoading}
                onCreateJob={handleCreateJob}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
                getJobStatusColor={getJobStatusColor}
                getJobStatusLabel={getJobStatusLabel}
              />
            </Card>
          </TabsContent>

        </Tabs>

        {/* Empty State */}
        {activeTab === 'search' && filteredCandidates.length === 0 && (
          <Card className={`py-16 ${styles['card-hover']}`}>
            <CardContent className="text-center">
              <div className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 ${styles['pulse-animation']}`}>
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Aucun candidat trouvé
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Essayez de modifier vos critères de recherche ou d'élargir vos filtres pour découvrir plus de talents.
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('');
                    setSkillFilter('');
                    setExperienceFilter('');
                  }}
                  className={styles['button-hover']}
                >
                  Réinitialiser les filtres
                </Button>
                <Button className={styles['button-hover']}>
                  Voir tous les candidats
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Modal */}
      <JobModal
        open={showJobModal}
        onClose={handleCloseModal}
        job={editingJob}
        onSave={handleSaveJob}
        loading={jobsLoading}
      />
    </div>
  );
}