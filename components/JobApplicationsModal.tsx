"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Award
} from "lucide-react";
import { apiClient } from "@/lib/api";

interface JobOffer {
  id: string;
  title: string;
  company?: {
    name: string;
  };
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  message?: string;
  coverLetter?: string;
  candidate: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
      phone?: string;
      location?: string;
      bio?: string;
      avatar?: string;
    };
  };
}

interface CandidateDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  location?: string;
  summary?: string;
  avatar?: string;
  experiences?: any[];
  education?: any[];
  skills?: any[];
  documents?: any[];
}

interface JobApplicationsModalProps {
  job: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobApplicationsModal: React.FC<JobApplicationsModalProps> = ({ 
  job, 
  isOpen, 
  onClose 
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
  const [loadingCandidateDetails, setLoadingCandidateDetails] = useState(false);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);

  // Récupérer les candidatures pour cette offre
  useEffect(() => {
    if (job && isOpen) {
      fetchApplications();
    }
  }, [job, isOpen]);

  const fetchApplications = async () => {
    if (!job) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`/api/applications/job/${job.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des candidatures');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interview_scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'interviewed': return 'bg-cyan-100 text-cyan-800';
      case 'offer_made': return 'bg-orange-100 text-orange-800';
      case 'offer_accepted': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-green-200 text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offer_declined': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'reviewed': return 'Examinée';
      case 'shortlisted': return 'Présélectionnée';
      case 'interview_scheduled': return 'Entretien programmé';
      case 'interviewed': return 'Entretien effectué';
      case 'second_interview': return '2ème entretien';
      case 'final_interview': return 'Entretien final';
      case 'reference_check': return 'Vérification références';
      case 'offer_made': return 'Offre proposée';
      case 'offer_accepted': return 'Offre acceptée';
      case 'offer_declined': return 'Offre refusée';
      case 'rejected': return 'Refusée';
      case 'withdrawn': return 'Retirée';
      case 'hired': return 'Embauché(e)';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'shortlisted': return <Users className="w-4 h-4" />;
      case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
      case 'interviewed': return <User className="w-4 h-4" />;
      case 'offer_made': return <FileText className="w-4 h-4" />;
      case 'offer_accepted': return <CheckCircle className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'offer_declined': return <XCircle className="w-4 h-4" />;
      case 'withdrawn': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicationId);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      const updatedApplication = await response.json();

      // Mettre à jour la liste des candidatures
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      // Mettre à jour la candidature sélectionnée si c'est celle-ci
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleAcceptApplication = (applicationId: string) => {
    updateApplicationStatus(applicationId, 'offer_accepted');
  };

  const handleRejectApplication = (applicationId: string) => {
    updateApplicationStatus(applicationId, 'rejected');
  };

  const fetchCandidateDetails = async (candidateId: string) => {
    try {
      setLoadingCandidateDetails(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const details = await apiClient.getCandidateProfile(candidateId);
      console.log('Candidate details received:', details); // Debug log

      // Normaliser les données pour s'assurer que les tableaux sont bien des tableaux
      const normalizedDetails = {
        ...details,
        experiences: Array.isArray(details.experiences) ? details.experiences : [],
        education: Array.isArray(details.education) ? details.education : [],
        skills: Array.isArray(details.skills) ? details.skills : []
      };

      setCandidateDetails(normalizedDetails);
      setShowCandidateDetails(true);
    } catch (err) {
      console.error('Error fetching candidate details:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des détails du candidat');
    } finally {
      setLoadingCandidateDetails(false);
    }
  };

  const handleCandidateProfileClick = (candidateId: string) => {
    fetchCandidateDetails(candidateId);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Candidatures pour : {job.title}
          </DialogTitle>
          <DialogDescription>
            {job.company && `${job.company.name} • `}
            Gérez les candidatures reçues pour cette offre d'emploi
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des candidatures...</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune candidature</h3>
            <p className="text-muted-foreground">
              Cette offre n'a pas encore reçu de candidatures.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {applications.length} candidature{applications.length > 1 ? 's' : ''}
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {applications.filter(app => app.status === 'pending').length} en attente
                </Badge>
                <Badge variant="outline">
                  {applications.filter(app => app.status === 'reviewed').length} examinées
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {applications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all relative"
                          onClick={() => handleCandidateProfileClick(application.candidate.id)}
                          title="Cliquez pour voir le profil complet"
                        >
                          {application.candidate.profile?.avatar ? (
                            <img
                              src={application.candidate.profile.avatar.startsWith('/uploads/')
                                ? `http://localhost:3001${application.candidate.profile.avatar}`
                                : application.candidate.profile.avatar}
                              alt="Photo de profil"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-blue-600">
                              {application.candidate.profile?.firstName?.[0] || 'U'}
                              {application.candidate.profile?.lastName?.[0] || ''}
                            </span>
                          )}
                          {loadingCandidateDetails && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {application.candidate.profile?.firstName} {application.candidate.profile?.lastName}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {application.candidate.email}
                            </span>
                            {application.candidate.profile?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {application.candidate.profile.phone}
                              </span>
                            )}
                            {application.candidate.profile?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {application.candidate.profile.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1">{getStatusLabel(application.status)}</span>
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          {application.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcceptApplication(application.id)}
                                disabled={updatingStatus === application.id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {updatingStatus === application.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                Accepter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectApplication(application.id)}
                                disabled={updatingStatus === application.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {updatingStatus === application.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4 mr-1" />
                                )}
                                Refuser
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {application.message && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Message de motivation :</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Candidature envoyée le {formatDate(application.createdAt)}
                        </span>
                        {application.coverLetter && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Lettre de motivation jointe
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Modal de détails de candidature */}
        {selectedApplication && (
          <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                    onClick={() => handleCandidateProfileClick(selectedApplication.candidate.id)}
                    title="Cliquez pour voir le profil complet"
                  >
                    {selectedApplication.candidate.profile?.avatar ? (
                      <img
                        src={selectedApplication.candidate.profile.avatar.startsWith('/uploads/')
                          ? `http://localhost:3001${selectedApplication.candidate.profile.avatar}`
                          : selectedApplication.candidate.profile.avatar}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-blue-600">
                        {selectedApplication.candidate.profile?.firstName?.[0] || 'U'}
                        {selectedApplication.candidate.profile?.lastName?.[0] || ''}
                      </span>
                    )}
                  </div>
                  <div>
                    Candidature de {selectedApplication.candidate.profile?.firstName} {selectedApplication.candidate.profile?.lastName}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Détails complets de la candidature - Cliquez sur la photo pour voir le profil complet
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    <span className="ml-1">{getStatusLabel(selectedApplication.status)}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedApplication.createdAt)}
                  </span>
                </div>

                <Separator />

                {selectedApplication.message && (
                  <div>
                    <h4 className="font-medium mb-2">Message de motivation :</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedApplication.message}</p>
                    </div>
                  </div>
                )}

                {selectedApplication.coverLetter && (
                  <div>
                    <h4 className="font-medium mb-2">Lettre de motivation :</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                )}

                {selectedApplication.status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRejectApplication(selectedApplication.id)}
                      disabled={updatingStatus === selectedApplication.id}
                    >
                      {updatingStatus === selectedApplication.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Refuser
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAcceptApplication(selectedApplication.id)}
                      disabled={updatingStatus === selectedApplication.id}
                    >
                      {updatingStatus === selectedApplication.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Accepter
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de profil complet du candidat */}
        {candidateDetails && (
          <Dialog open={showCandidateDetails} onOpenChange={() => setShowCandidateDetails(false)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    {candidateDetails.avatar ? (
                      <img
                        src={candidateDetails.avatar.startsWith('/uploads/')
                          ? `http://localhost:3001${candidateDetails.avatar}`
                          : candidateDetails.avatar}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-blue-600">
                        {candidateDetails.firstName?.[0] || 'U'}
                        {candidateDetails.lastName?.[0] || ''}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {candidateDetails.firstName} {candidateDetails.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {candidateDetails.title || 'Profil candidat'}
                    </p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Profil complet du candidat avec expériences, formations et compétences
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="experience">Expérience</TabsTrigger>
                  <TabsTrigger value="education">Formation</TabsTrigger>
                  <TabsTrigger value="skills">Compétences</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Informations personnelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{candidateDetails.email}</span>
                        </div>
                        {candidateDetails.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{candidateDetails.phone}</span>
                          </div>
                        )}
                        {candidateDetails.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{candidateDetails.location}</span>
                          </div>
                        )}
                      </div>
                      {candidateDetails.summary && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Résumé professionnel</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {candidateDetails.summary}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                        Expérience professionnelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {candidateDetails.experiences && Array.isArray(candidateDetails.experiences) && candidateDetails.experiences.length > 0 ? (
                        <div className="space-y-4">
                          {candidateDetails.experiences.map((exp: any, index: number) => (
                            <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                                  <p className="text-blue-600 font-medium">{exp.company}</p>
                                  {exp.location && (
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {exp.location}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} -
                                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Présent'}
                                  </p>
                                </div>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">Aucune expérience professionnelle renseignée</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
                        Formation et Éducation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {candidateDetails.education && Array.isArray(candidateDetails.education) && candidateDetails.education.length > 0 ? (
                        <div className="space-y-4">
                          {candidateDetails.education.map((edu: any, index: number) => (
                            <div key={index} className="border-l-2 border-indigo-200 pl-4 pb-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                  <p className="text-indigo-600 font-medium">{edu.school}</p>
                                  {edu.fieldOfStudy && (
                                    <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                                  )}
                                  <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {edu.graduationYear ? `Diplômé en ${edu.graduationYear}` :
                                     edu.endDate ? `Fin prévue en ${new Date(edu.endDate).getFullYear()}` :
                                     'En cours'}
                                  </p>
                                  {edu.grade && (
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                      <Award className="w-3 h-3 mr-1" />
                                      {edu.grade}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {edu.description && (
                                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                  {edu.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">Aucune formation renseignée</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        Compétences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {candidateDetails.skills && Array.isArray(candidateDetails.skills) && candidateDetails.skills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {candidateDetails.skills.map((userSkill: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3 flex-1">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  {userSkill.skill?.name || userSkill.name}
                                </Badge>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-600">
                                      {userSkill.level === 'beginner' ? 'Débutant' :
                                       userSkill.level === 'intermediate' ? 'Intermédiaire' :
                                       userSkill.level === 'advanced' ? 'Avancé' :
                                       userSkill.level === 'expert' ? 'Expert' : 'Débutant'}
                                    </span>
                                  </div>
                                  {userSkill.yearsOfExperience > 0 && (
                                    <p className="text-xs text-gray-500">
                                      {userSkill.yearsOfExperience} an{userSkill.yearsOfExperience > 1 ? 's' : ''} d'expérience
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">Aucune compétence renseignée</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationsModal;
