"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Euro, 
  Briefcase, 
  Users, 
  Send,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  location?: string;
  employmentType: string;
  experienceLevel: string;
  remotePolicy: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  company?: {
    id: string;
    name: string;
    industry?: string;
  };
}

interface JobApplicationModalProps {
  job: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (application: any) => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ 
  job, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    message: '',
    source: 'direct'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer le token d'authentification
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Vous devez être connecté pour postuler à une offre d\'emploi');
        return;
      }

      const response = await fetch(`/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la candidature');
      }

      const application = await response.json();
      
      setSuccess(true);
      
      // Appeler le callback de succès après un délai
      setTimeout(() => {
        onSuccess?.(application);
        handleClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      coverLetter: '',
      message: '',
      source: 'direct'
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  const formatSalary = (min?: string, max?: string, currency = 'EUR') => {
    if (!min && !max) return 'Salaire non spécifié';
    if (min && max) return `${parseInt(min).toLocaleString()} - ${parseInt(max).toLocaleString()} ${currency}`;
    if (min) return `À partir de ${parseInt(min).toLocaleString()} ${currency}`;
    if (max) return `Jusqu'à ${parseInt(max).toLocaleString()} ${currency}`;
    return '';
  };

  const getEmploymentTypeLabel = (type: string) => {
    const types = {
      'full_time': 'Temps plein',
      'part_time': 'Temps partiel',
      'contract': 'Contrat',
      'freelance': 'Freelance',
      'internship': 'Stage',
      'apprenticeship': 'Apprentissage',
    };
    return types[type as keyof typeof types] || type;
  };

  const getExperienceLevelLabel = (level: string) => {
    const levels = {
      'entry': 'Débutant (0-2 ans)',
      'junior': 'Junior (1-3 ans)',
      'mid': 'Intermédiaire (2-5 ans)',
      'senior': 'Senior (5+ ans)',
      'lead': 'Lead/Manager',
      'executive': 'Exécutif',
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getRemotePolicyLabel = (policy: string) => {
    const policies = {
      'on_site': 'Bureau uniquement',
      'hybrid': 'Hybride',
      'remote': 'Télétravail complet',
      'flexible': 'Flexible',
    };
    return policies[policy as keyof typeof policies] || policy;
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Postuler à cette offre
          </DialogTitle>
          <DialogDescription>
            Complétez votre candidature pour cette offre d'emploi
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Candidature envoyée !</h3>
            <p className="text-muted-foreground text-center">
              Votre candidature a été envoyée avec succès. Le recruteur sera notifié et vous contactera si votre profil correspond.
            </p>
          </div>
        ) : (
          <>
            {/* Résumé de l'offre */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
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
                  <Euro className="w-4 h-4" />
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
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
            </div>

            <Separator />

            {/* Formulaire de candidature */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Message de motivation *</Label>
                <Textarea
                  id="message"
                  placeholder="Expliquez brièvement pourquoi vous êtes intéressé par ce poste et ce que vous pouvez apporter à l'entreprise..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  required
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Ce message sera visible par le recruteur
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Lettre de motivation (optionnel)</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Rédigez une lettre de motivation plus détaillée si vous le souhaitez..."
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Lettre de motivation complète (optionnel)
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important :</strong> Assurez-vous que votre profil est à jour avec vos expériences, formations et compétences avant de postuler.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.message.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer ma candidature
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
