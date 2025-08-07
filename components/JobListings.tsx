"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import JobApplicationModal from "./JobApplicationModal";
import { useUserApplications } from "@/hooks/use-user-applications";
import { 
  Search, 
  MapPin, 
  Clock, 
  Euro, 
  Briefcase, 
  Users, 
  Calendar,
  Filter,
  X,
  Eye,
  Heart,
  ExternalLink,
  Building
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobOffer {
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
  isAdminPost?: boolean;
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

interface JobListingsProps {
  className?: string;
}

const JobListings: React.FC<JobListingsProps> = ({ className = "" }) => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [applicationJob, setApplicationJob] = useState<JobOffer | null>(null);

  // Hook pour gérer les candidatures de l'utilisateur
  const {
    applications,
    loading: applicationsLoading,
    hasAppliedToJob,
    getApplicationForJob,
    refetch: refetchApplications
  } = useUserApplications();
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");
  const [remotePolicyFilter, setRemotePolicyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryMinFilter, setSalaryMinFilter] = useState("");
  const [salaryMaxFilter, setSalaryMaxFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Options pour les filtres
  const employmentTypes = [
    { value: 'full_time', label: 'Temps plein' },
    { value: 'part_time', label: 'Temps partiel' },
    { value: 'contract', label: 'Contrat' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Stage' },
    { value: 'apprenticeship', label: 'Apprentissage' },
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Débutant (0-2 ans)' },
    { value: 'junior', label: 'Junior (1-3 ans)' },
    { value: 'mid', label: 'Intermédiaire (2-5 ans)' },
    { value: 'senior', label: 'Senior (5+ ans)' },
    { value: 'lead', label: 'Lead/Manager' },
    { value: 'executive', label: 'Exécutif' },
  ];

  const remotePolicies = [
    { value: 'on_site', label: 'Bureau uniquement' },
    { value: 'hybrid', label: 'Hybride' },
    { value: 'remote', label: 'Télétravail complet' },
    { value: 'flexible', label: 'Flexible' },
  ];

  // Récupération des offres d'emploi
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des offres');
      }

      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Application des filtres
  useEffect(() => {
    let filtered = [...jobs];

    // Recherche par mots-clés
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.company?.name.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower) ||
        job.requirements?.toLowerCase().includes(searchLower)
      );
    }

    // Filtres spécifiques
    if (employmentTypeFilter) {
      filtered = filtered.filter(job => job.employmentType === employmentTypeFilter);
    }

    if (experienceLevelFilter) {
      filtered = filtered.filter(job => job.experienceLevel === experienceLevelFilter);
    }

    if (remotePolicyFilter) {
      filtered = filtered.filter(job => job.remotePolicy === remotePolicyFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filtres de salaire
    if (salaryMinFilter) {
      filtered = filtered.filter(job => {
        const jobSalaryMin = job.salaryMin ? parseInt(job.salaryMin) : 0;
        return jobSalaryMin >= parseInt(salaryMinFilter);
      });
    }

    if (salaryMaxFilter) {
      filtered = filtered.filter(job => {
        const jobSalaryMax = job.salaryMax ? parseInt(job.salaryMax) : Infinity;
        return jobSalaryMax <= parseInt(salaryMaxFilter);
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, employmentTypeFilter, experienceLevelFilter, remotePolicyFilter, locationFilter, salaryMinFilter, salaryMaxFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setEmploymentTypeFilter("");
    setExperienceLevelFilter("");
    setRemotePolicyFilter("");
    setLocationFilter("");
    setSalaryMinFilter("");
    setSalaryMaxFilter("");
  };

  const formatSalary = (min?: string, max?: string, currency = 'EUR') => {
    if (!min && !max) return 'Salaire non spécifié';
    if (min && max) return `${min} - ${max} ${currency}`;
    if (min) return `À partir de ${min} ${currency}`;
    if (max) return `Jusqu'à ${max} ${currency}`;
    return '';
  };

  const getEmploymentTypeLabel = (type: string) => {
    return employmentTypes.find(t => t.value === type)?.label || type;
  };

  const getExperienceLevelLabel = (level: string) => {
    return experienceLevels.find(l => l.value === level)?.label || level;
  };

  const getRemotePolicyLabel = (policy: string) => {
    return remotePolicies.find(p => p.value === policy)?.label || policy;
  };

  const handleApplicationSuccess = (application: any) => {
    // Afficher un message de succès et rafraîchir les candidatures
    console.log('Candidature envoyée avec succès:', application);
    // Rafraîchir la liste des candidatures pour mettre à jour l'état
    refetchApplications();
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className={className}>
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchJobs}
            className="ml-2"
          >
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec recherche */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Offres d'emploi</h2>
            <p className="text-muted-foreground">
              {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par titre, entreprise, compétences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtres</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Effacer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type de contrat</label>
                  <div className="flex gap-2">
                    <Select value={employmentTypeFilter || undefined} onValueChange={(value) => setEmploymentTypeFilter(value || "")}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {employmentTypeFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEmploymentTypeFilter("")}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Niveau d'expérience</label>
                  <div className="flex gap-2">
                    <Select value={experienceLevelFilter || undefined} onValueChange={(value) => setExperienceLevelFilter(value || "")}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Tous les niveaux" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {experienceLevelFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExperienceLevelFilter("")}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Télétravail</label>
                  <div className="flex gap-2">
                    <Select value={remotePolicyFilter || undefined} onValueChange={(value) => setRemotePolicyFilter(value || "")}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Toutes les politiques" />
                      </SelectTrigger>
                      <SelectContent>
                        {remotePolicies.map(policy => (
                          <SelectItem key={policy.value} value={policy.value}>
                            {policy.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {remotePolicyFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRemotePolicyFilter("")}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Localisation</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ville, région..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="flex-1"
                    />
                    {locationFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocationFilter("")}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Salaire minimum</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Ex: 35000"
                      value={salaryMinFilter}
                      onChange={(e) => setSalaryMinFilter(e.target.value)}
                      className="flex-1"
                    />
                    {salaryMinFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSalaryMinFilter("")}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Salaire maximum</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Ex: 60000"
                      value={salaryMaxFilter}
                      onChange={(e) => setSalaryMaxFilter(e.target.value)}
                      className="flex-1"
                    />
                    {salaryMaxFilter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSalaryMaxFilter("")}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Liste des offres */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
              <p className="text-muted-foreground text-center">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
              {(searchTerm || employmentTypeFilter || experienceLevelFilter || remotePolicyFilter || locationFilter || salaryMinFilter || salaryMaxFilter) && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Effacer tous les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => {
            const hasApplied = hasAppliedToJob(job.id);
            const application = getApplicationForJob(job.id);

            return (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={() => setSelectedJob(job)}
                onApply={() => setApplicationJob(job)}
                hasApplied={hasApplied}
                applicationStatus={application?.status}
                getEmploymentTypeLabel={getEmploymentTypeLabel}
                getExperienceLevelLabel={getExperienceLevelLabel}
                getRemotePolicyLabel={getRemotePolicyLabel}
                formatSalary={formatSalary}
              />
            );
          })
        )}
      </div>

      {/* Modal de détails */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={(job) => {
          setSelectedJob(null);
          setApplicationJob(job);
        }}
        hasApplied={selectedJob ? hasAppliedToJob(selectedJob.id) : false}
        applicationStatus={selectedJob ? getApplicationForJob(selectedJob.id)?.status : undefined}
        getEmploymentTypeLabel={getEmploymentTypeLabel}
        getExperienceLevelLabel={getExperienceLevelLabel}
        getRemotePolicyLabel={getRemotePolicyLabel}
        formatSalary={formatSalary}
      />

      {/* Modal de candidature */}
      <JobApplicationModal
        job={applicationJob}
        isOpen={!!applicationJob}
        onClose={() => setApplicationJob(null)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

// Composant JobCard
interface JobCardProps {
  job: JobOffer;
  onViewDetails: () => void;
  onApply: () => void;
  hasApplied: boolean;
  applicationStatus?: string;
  getEmploymentTypeLabel: (type: string) => string;
  getExperienceLevelLabel: (level: string) => string;
  getRemotePolicyLabel: (policy: string) => string;
  formatSalary: (min?: string, max?: string, currency?: string) => string;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onApply,
  hasApplied,
  applicationStatus,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  getRemotePolicyLabel,
  formatSalary
}) => {
  const timeAgo = (date: string) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {hasApplied && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓ Candidature envoyée
                </Badge>
              )}
              {job.isAdminPost && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  👁️ Info uniquement
                </Badge>
              )}
              {job.isFeatured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  ⭐ En vedette
                </Badge>
              )}
              {job.isUrgent && (
                <Badge variant="destructive">
                  🔥 Urgent
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              {job.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {job.company.name}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeAgo(job.createdAt)}
              </span>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">
            <Briefcase className="w-3 h-3 mr-1" />
            {getEmploymentTypeLabel(job.employmentType)}
          </Badge>
          <Badge variant="outline">
            <Users className="w-3 h-3 mr-1" />
            {getExperienceLevelLabel(job.experienceLevel)}
          </Badge>
          <Badge variant="outline">
            {getRemotePolicyLabel(job.remotePolicy)}
          </Badge>
          {job.positions && job.positions > 1 && (
            <Badge variant="outline">
              {job.positions} postes
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Euro className="w-4 h-4" />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </div>
          <div className="flex gap-2">
            <Button onClick={onViewDetails} size="sm" variant="outline">
              Voir les détails
            </Button>
            {job.isAdminPost ? (
              <Button size="sm" disabled variant="outline" className="opacity-50">
                Candidature non disponible
              </Button>
            ) : hasApplied ? (
              <Button size="sm" disabled variant="secondary">
                ✓ Déjà postulé
              </Button>
            ) : (
              <Button onClick={onApply} size="sm">
                Postuler
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant JobDetailsModal
interface JobDetailsModalProps {
  job: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: JobOffer) => void;
  hasApplied: boolean;
  applicationStatus?: string;
  getEmploymentTypeLabel: (type: string) => string;
  getExperienceLevelLabel: (level: string) => string;
  getRemotePolicyLabel: (policy: string) => string;
  formatSalary: (min?: string, max?: string, currency?: string) => string;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  hasApplied,
  applicationStatus,
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  getRemotePolicyLabel,
  formatSalary
}) => {
  if (!job) return null;

  const handleApply = () => {
    if (job) {
      onApply(job);
    }
  };

  const handleSave = () => {
    // TODO: Implémenter la logique de sauvegarde
    console.log('Sauvegarder:', job.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-2">
                {job.company && (
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {job.company.name}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Heart className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              {job.isAdminPost ? (
                <Button disabled variant="outline" className="opacity-50">
                  Candidature non disponible
                </Button>
              ) : (
                <Button onClick={handleApply}>
                  Postuler
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {job.isAdminPost && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                📋 Annonce informative
              </Badge>
            )}
            {job.isFeatured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                ⭐ En vedette
              </Badge>
            )}
            {job.isUrgent && (
              <Badge variant="destructive">
                🔥 Urgent
              </Badge>
            )}
            <Badge variant="outline">
              <Briefcase className="w-3 h-3 mr-1" />
              {getEmploymentTypeLabel(job.employmentType)}
            </Badge>
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {getExperienceLevelLabel(job.experienceLevel)}
            </Badge>
            <Badge variant="outline">
              {getRemotePolicyLabel(job.remotePolicy)}
            </Badge>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                </div>
                {job.positions && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{job.positions} poste{job.positions > 1 ? 's' : ''} à pourvoir</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {job.company && (
              <div>
                <h3 className="font-semibold mb-2">À propos de l'entreprise</h3>
                <div className="space-y-2 text-sm">
                  <div className="font-medium">{job.company.name}</div>
                  {job.company.industry && (
                    <div className="text-muted-foreground">{job.company.industry}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3">Description du poste</h3>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Responsabilités */}
          {job.responsibilities && (
            <div>
              <h3 className="font-semibold mb-3">Responsabilités</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.responsibilities}</p>
              </div>
            </div>
          )}

          {/* Exigences */}
          {job.requirements && (
            <div>
              <h3 className="font-semibold mb-3">Exigences</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </div>
          )}

          {/* Avantages */}
          {job.benefits && (
            <div>
              <h3 className="font-semibold mb-3">Avantages</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.benefits}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {job.isAdminPost ? (
              <div className="flex-1 text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-purple-800 font-medium">📋 Annonce informative</p>
                <p className="text-sm text-purple-600 mt-1">Cette offre est uniquement à titre informatif</p>
              </div>
            ) : hasApplied ? (
              <Button disabled variant="secondary" className="flex-1">
                ✓ Candidature envoyée
                {applicationStatus && (
                  <span className="ml-2 text-xs">
                    ({applicationStatus === 'pending' ? 'En attente' : applicationStatus})
                  </span>
                )}
              </Button>
            ) : (
              <Button onClick={handleApply} className="flex-1">
                Postuler maintenant
              </Button>
            )}
            <Button variant="outline" onClick={handleSave}>
              <Heart className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobListings;
