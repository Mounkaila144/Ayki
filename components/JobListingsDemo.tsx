"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

// Données de démonstration
const mockJobs = [
  {
    id: '1',
    title: 'Développeur React Senior',
    description: 'Nous recherchons un développeur React senior pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies comme React 18, TypeScript, et Next.js.',
    requirements: 'React, TypeScript, Node.js, 5+ ans d\'expérience, Git, Jest',
    responsibilities: 'Développement de nouvelles fonctionnalités, code review, mentoring des développeurs juniors, architecture frontend',
    benefits: 'Télétravail flexible, formation continue, mutuelle premium, tickets restaurant',
    location: 'Paris, France',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    remotePolicy: 'hybrid',
    salaryMin: '55000',
    salaryMax: '75000',
    currency: 'EUR',
    positions: 2,
    isUrgent: false,
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    company: {
      id: 'comp1',
      name: 'TechCorp',
      industry: 'Technologie'
    }
  },
  {
    id: '2',
    title: 'Designer UX/UI Junior',
    description: 'Rejoignez notre équipe design pour créer des expériences utilisateur exceptionnelles. Poste idéal pour un designer junior motivé souhaitant évoluer dans une startup dynamique.',
    requirements: 'Figma, Adobe Creative Suite, portfolio requis, bases en HTML/CSS',
    responsibilities: 'Création de maquettes, tests utilisateurs, collaboration avec les développeurs, recherche UX',
    benefits: 'Formation design, équipement fourni, ambiance startup, événements équipe',
    location: 'Lyon, France',
    employmentType: 'full_time',
    experienceLevel: 'junior',
    remotePolicy: 'on_site',
    salaryMin: '35000',
    salaryMax: '45000',
    currency: 'EUR',
    positions: 1,
    isUrgent: true,
    isFeatured: false,
    status: 'active',
    createdAt: '2024-01-14T14:30:00Z',
    company: {
      id: 'comp2',
      name: 'DesignStudio',
      industry: 'Design'
    }
  },
  {
    id: '3',
    title: 'Développeur Full Stack Freelance',
    description: 'Mission freelance pour développer une application web complète. Projet passionnant avec une startup en croissance dans le domaine de la fintech.',
    requirements: 'JavaScript, Python, React, Django, bases de données, autonomie',
    responsibilities: 'Développement frontend et backend, déploiement, maintenance, documentation',
    benefits: 'Tarif attractif, flexibilité horaire, projet innovant, possibilité de prolongation',
    location: 'Remote',
    employmentType: 'freelance',
    experienceLevel: 'mid',
    remotePolicy: 'remote',
    salaryMin: '400',
    salaryMax: '600',
    currency: 'EUR',
    positions: 1,
    isUrgent: false,
    isFeatured: false,
    status: 'active',
    createdAt: '2024-01-13T09:15:00Z',
    company: {
      id: 'comp3',
      name: 'FinTech Startup',
      industry: 'Finance'
    }
  },
  {
    id: '4',
    title: 'Stage Développement Mobile',
    description: 'Stage de 6 mois dans une équipe mobile pour développer des applications iOS et Android. Excellente opportunité d\'apprentissage dans une entreprise reconnue.',
    requirements: 'React Native ou Flutter, motivation, études en informatique, bases en Git',
    responsibilities: 'Développement d\'applications mobiles, tests, documentation, participation aux réunions équipe',
    benefits: 'Encadrement personnalisé, formation, possibilité d\'embauche, tickets restaurant',
    location: 'Toulouse, France',
    employmentType: 'internship',
    experienceLevel: 'entry',
    remotePolicy: 'hybrid',
    salaryMin: '800',
    salaryMax: '1200',
    currency: 'EUR',
    positions: 2,
    isUrgent: false,
    isFeatured: false,
    status: 'active',
    createdAt: '2024-01-12T16:45:00Z',
    company: {
      id: 'comp4',
      name: 'MobileTech',
      industry: 'Mobile'
    }
  },
  {
    id: '5',
    title: 'Lead Developer',
    description: 'Poste de lead developer pour encadrer une équipe de 5 développeurs et définir l\'architecture technique de nos produits. Leadership technique et vision stratégique requis.',
    requirements: 'Leadership, architecture logicielle, 8+ ans d\'expérience, microservices, cloud',
    responsibilities: 'Management technique, architecture, code review, recrutement, formation équipe',
    benefits: 'Salaire attractif, stock-options, télétravail total, budget formation',
    location: 'Bordeaux, France',
    employmentType: 'full_time',
    experienceLevel: 'lead',
    remotePolicy: 'flexible',
    salaryMin: '70000',
    salaryMax: '90000',
    currency: 'EUR',
    positions: 1,
    isUrgent: true,
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-11T11:20:00Z',
    company: {
      id: 'comp5',
      name: 'CloudSoft',
      industry: 'Cloud Computing'
    }
  },
  {
    id: '6',
    title: 'Data Scientist',
    description: 'Rejoignez notre équipe data pour analyser et modéliser des données complexes. Vous travaillerez sur des projets d\'IA et de machine learning passionnants.',
    requirements: 'Python, R, Machine Learning, SQL, statistiques, PhD ou Master',
    responsibilities: 'Analyse de données, modélisation ML, visualisation, présentation résultats',
    benefits: 'Recherche appliquée, conférences, publications, environnement stimulant',
    location: 'Grenoble, France',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    remotePolicy: 'hybrid',
    salaryMin: '50000',
    salaryMax: '70000',
    currency: 'EUR',
    positions: 1,
    isUrgent: false,
    isFeatured: true,
    status: 'active',
    createdAt: '2024-01-10T08:30:00Z',
    company: {
      id: 'comp6',
      name: 'DataLab',
      industry: 'Intelligence Artificielle'
    }
  }
];

interface JobListingsDemoProps {
  className?: string;
}

const JobListingsDemo: React.FC<JobListingsDemoProps> = ({ className = "" }) => {
  const [jobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
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
    if (min && max) return `${parseInt(min).toLocaleString()} - ${parseInt(max).toLocaleString()} ${currency}`;
    if (min) return `À partir de ${parseInt(min).toLocaleString()} ${currency}`;
    if (max) return `Jusqu'à ${parseInt(max).toLocaleString()} ${currency}`;
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
    <div className={`space-y-6 ${className}`}>
      {/* Bannière de démonstration */}
      <Alert>
        <AlertDescription>
          🎯 <strong>Mode Démonstration</strong> - Ceci est un aperçu du composant JobListings avec des données de test. 
          En production, les données seront récupérées depuis l'API backend.
        </AlertDescription>
      </Alert>

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
                  <Select value={employmentTypeFilter} onValueChange={setEmploymentTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les types</SelectItem>
                      {employmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Niveau d'expérience</label>
                  <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les niveaux</SelectItem>
                      {experienceLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Télétravail</label>
                  <Select value={remotePolicyFilter} onValueChange={setRemotePolicyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les politiques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les politiques</SelectItem>
                      {remotePolicies.map(policy => (
                        <SelectItem key={policy.value} value={policy.value}>
                          {policy.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Localisation</label>
                  <Input
                    placeholder="Ville, région..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Salaire minimum</label>
                  <Input
                    type="number"
                    placeholder="Ex: 35000"
                    value={salaryMinFilter}
                    onChange={(e) => setSalaryMinFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Salaire maximum</label>
                  <Input
                    type="number"
                    placeholder="Ex: 60000"
                    value={salaryMaxFilter}
                    onChange={(e) => setSalaryMaxFilter(e.target.value)}
                  />
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
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)}>
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
                  <Button onClick={() => setSelectedJob(job)} size="sm">
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de détails */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-2">
                      {selectedJob.company && (
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {selectedJob.company.name}
                        </span>
                      )}
                      {selectedJob.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedJob.location}
                        </span>
                      )}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button>
                      Postuler
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {selectedJob.isFeatured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      ⭐ En vedette
                    </Badge>
                  )}
                  {selectedJob.isUrgent && (
                    <Badge variant="destructive">
                      🔥 Urgent
                    </Badge>
                  )}
                  <Badge variant="outline">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {getEmploymentTypeLabel(selectedJob.employmentType)}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {getExperienceLevelLabel(selectedJob.experienceLevel)}
                  </Badge>
                  <Badge variant="outline">
                    {getRemotePolicyLabel(selectedJob.remotePolicy)}
                  </Badge>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Informations générales</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4" />
                        <span>{formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.currency)}</span>
                      </div>
                      {selectedJob.positions && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{selectedJob.positions} poste{selectedJob.positions > 1 ? 's' : ''} à pourvoir</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Publié le {new Date(selectedJob.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  {selectedJob.company && (
                    <div>
                      <h3 className="font-semibold mb-2">À propos de l'entreprise</h3>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">{selectedJob.company.name}</div>
                        {selectedJob.company.industry && (
                          <div className="text-muted-foreground">{selectedJob.company.industry}</div>
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
                    <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                </div>

                {/* Responsabilités */}
                {selectedJob.responsibilities && (
                  <div>
                    <h3 className="font-semibold mb-3">Responsabilités</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{selectedJob.responsibilities}</p>
                    </div>
                  </div>
                )}

                {/* Exigences */}
                {selectedJob.requirements && (
                  <div>
                    <h3 className="font-semibold mb-3">Exigences</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{selectedJob.requirements}</p>
                    </div>
                  </div>
                )}

                {/* Avantages */}
                {selectedJob.benefits && (
                  <div>
                    <h3 className="font-semibold mb-3">Avantages</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{selectedJob.benefits}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">
                    Postuler maintenant
                  </Button>
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobListingsDemo;
