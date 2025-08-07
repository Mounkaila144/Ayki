'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Briefcase,
  Clock,
  Users,
  AlertCircle,
  Star,
  Zap
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
  createdAt: string;
  updatedAt: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    employmentType: 'full_time',
    experienceLevel: 'mid',
    remotePolicy: 'on_site',
    salaryMin: '',
    salaryMax: '',
    currency: 'EUR',
    isUrgent: false,
    isFeatured: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getAdminJobs({ isAdminPost: 'true' });
      setJobs(result.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      employmentType: 'full_time',
      experienceLevel: 'mid',
      remotePolicy: 'on_site',
      salaryMin: '',
      salaryMax: '',
      currency: 'EUR',
      isUrgent: false,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const handleEditJob = (job: JobOffer) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: '',
      location: job.location,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      remotePolicy: job.remotePolicy,
      salaryMin: '',
      salaryMax: '',
      currency: 'EUR',
      isUrgent: job.isUrgent,
      isFeatured: job.isFeatured,
    });
    setShowModal(true);
  };

  const handleSaveJob = async () => {
    try {
      if (editingJob) {
        await apiClient.updateAdminJob(editingJob.id, formData);
      } else {
        await apiClient.createAdminJob(formData);
      }
      
      toast({
        title: "Succès",
        description: `Annonce ${editingJob ? 'mise à jour' : 'créée'} avec succès`,
      });
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'annonce",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await apiClient.deleteAdminJob(jobId);
      toast({
        title: "Succès",
        description: "Annonce supprimée avec succès",
      });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-orange-100 text-orange-800',
      closed: 'bg-red-100 text-red-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Annonces Administratives</h1>
          <p className="text-gray-600 mt-2">
            Gérez les annonces visibles par les candidats mais sans possibilité de candidature
          </p>
        </div>
        <Button onClick={handleCreateJob} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle annonce
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune annonce administrative</h3>
                <p className="text-gray-600 mb-4">
                  Créez votre première annonce administrative
                </p>
                <Button onClick={handleCreateJob}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une annonce
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge className={getStatusBadge(job.status)}>
                          {job.status}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                        {job.isUrgent && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        {job.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Vedette
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location || 'Non spécifié'}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.employmentType}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.experienceLevel}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {job.viewCount} vues
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-3">
                        {job.description}
                      </p>

                      <div className="text-sm text-gray-500">
                        Créée le {new Date(job.createdAt).toLocaleDateString()}
                        {job.updatedAt !== job.createdAt && 
                          ` • Mise à jour le ${new Date(job.updatedAt).toLocaleDateString()}`
                        }
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditJob(job)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal de création/édition */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce administrative'}
            </DialogTitle>
            <DialogDescription>
              Les annonces administratives sont visibles par tous les candidats mais n'acceptent pas de candidatures.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre du poste *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Développeur Full Stack Senior"
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Paris, France"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type de contrat</Label>
                <Select 
                  value={formData.employmentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employmentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Temps plein</SelectItem>
                    <SelectItem value="part_time">Temps partiel</SelectItem>
                    <SelectItem value="contract">Contrat</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Niveau d'expérience</Label>
                <Select 
                  value={formData.experienceLevel}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Débutant (0-2 ans)</SelectItem>
                    <SelectItem value="mid">Intermédiaire (2-5 ans)</SelectItem>
                    <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                    <SelectItem value="lead">Lead/Manager</SelectItem>
                    <SelectItem value="executive">Exécutif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description du poste *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez le poste, les responsabilités..."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Annonce urgente</h4>
                <p className="text-sm text-gray-600">Marquer comme urgent</p>
              </div>
              <Switch
                checked={formData.isUrgent}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUrgent: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Mettre en vedette</h4>
                <p className="text-sm text-gray-600">Afficher en priorité</p>
              </div>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveJob}
              disabled={!formData.title || !formData.location}
            >
              {editingJob ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}