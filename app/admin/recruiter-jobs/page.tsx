'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye,
  Check,
  X,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Building,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  remotePolicy: string;
  status: string;
  isAdminPost: boolean;
  isUrgent: boolean;
  isFeatured: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  recruiter?: {
    id: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getAdminJobs({ isAdminPost: 'false' });
      setJobs(result.data || []);
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces des recruteurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Filtrer par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.company?.name.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      await apiClient.updateRecruiterJob(jobId, { status: newStatus });
      toast({
        title: "Succès",
        description: `Annonce ${newStatus === 'published' ? 'publiée' : 'mise à jour'} avec succès`,
      });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'annonce",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Publié' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Brouillon' },
      paused: { color: 'bg-orange-100 text-orange-800', label: 'En pause' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Fermé' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getEmploymentTypeLabel = (type: string) => {
    const types = {
      full_time: 'Temps plein',
      part_time: 'Temps partiel',
      contract: 'Contrat',
      freelance: 'Freelance',
      internship: 'Stage',
    };
    return types[type as keyof typeof types] || type;
  };

  const getExperienceLevelLabel = (level: string) => {
    const levels = {
      entry: 'Débutant',
      junior: 'Junior',
      mid: 'Intermédiaire',
      senior: 'Senior',
      lead: 'Lead',
      executive: 'Exécutif',
    };
    return levels[level as keyof typeof levels] || level;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Annonces des Recruteurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez et modérez les annonces soumises par les recruteurs
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-lg">Filtres et recherche</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par titre, entreprise, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="paused">En pause</SelectItem>
                    <SelectItem value="closed">Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publiées</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter(j => j.status === 'published').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {jobs.filter(j => j.status === 'draft').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-purple-600">
                  {jobs.reduce((acc, job) => acc + job.applicationCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des annonces */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Aucune annonce correspondante' : 'Aucune annonce de recruteur'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Les annonces créées par les recruteurs apparaîtront ici'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      {getStatusBadge(job.status)}
                      {job.isUrgent && (
                        <Badge className="bg-orange-100 text-orange-800">
                          🔥 Urgent
                        </Badge>
                      )}
                      {job.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          ⭐ En vedette
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3 space-x-4 text-sm">
                      {job.company && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {job.company.name}
                        </div>
                      )}
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location || 'Non spécifié'}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {getEmploymentTypeLabel(job.employmentType)}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {getExperienceLevelLabel(job.experienceLevel)}
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Créée le {new Date(job.createdAt).toLocaleDateString()}
                        {job.recruiter?.profile && (
                          <span className="ml-2">
                            par {job.recruiter.profile.firstName} {job.recruiter.profile.lastName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {job.viewCount} vues
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.applicationCount} candidatures
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {job.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => updateJobStatus(job.id, 'published')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Publier
                      </Button>
                    )}
                    {job.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateJobStatus(job.id, 'paused')}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Suspendre
                      </Button>
                    )}
                    {job.status === 'paused' && (
                      <Button
                        size="sm"
                        onClick={() => updateJobStatus(job.id, 'published')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Activer
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateJobStatus(job.id, 'closed')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Fermer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}