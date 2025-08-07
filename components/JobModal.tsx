'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  Zap,
  X,
  Plus
} from 'lucide-react';
import { JobOffer } from '@/hooks/use-job-offers';

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  job: JobOffer | null;
  onSave: (jobData: any) => Promise<void>;
  loading?: boolean;
}

export default function JobModal({ open, onClose, job, onSave, loading = false }: JobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    employmentType: 'full_time',
    experienceLevel: 'mid',
    salaryMin: '',
    salaryMax: '',
    currency: 'EUR',
    remotePolicy: 'on_site',
    isUrgent: false,
    isFeatured: false,
    skills: [] as string[],
    companyId: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // Réinitialiser le formulaire quand la modal s'ouvre/ferme
  useEffect(() => {
    if (open) {
      if (job) {
        // Mode édition
        setFormData({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          benefits: job.benefits || '',
          location: job.location || '',
          employmentType: job.employmentType || 'full_time',
          experienceLevel: job.experienceLevel || 'mid',
          salaryMin: job.salaryMin?.toString() || '',
          salaryMax: job.salaryMax?.toString() || '',
          currency: job.currency || 'EUR',
          remotePolicy: job.remotePolicy || 'on_site',
          isUrgent: job.isUrgent || false,
          isFeatured: job.isFeatured || false,
          skills: job.skills?.map(s => s.name) || [],
          companyId: job.companyId || '',
        });
      } else {
        // Mode création - réinitialiser
        setFormData({
          title: '',
          description: '',
          requirements: '',
          benefits: '',
          location: '',
          employmentType: 'full_time',
          experienceLevel: 'mid',
          salaryMin: '',
          salaryMax: '',
          currency: 'EUR',
          remotePolicy: 'on_site',
          isUrgent: false,
          isFeatured: false,
          skills: [],
          companyId: '',
        });
      }
      setActiveTab('basic');
    }
  }, [open, job]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Exclure skills temporairement (nécessite une implémentation backend complexe)
      const { skills, ...formDataWithoutSkills } = formData;

      const jobData = {
        ...formDataWithoutSkills,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
      };

      await onSave(jobData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            {job ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce'}
          </DialogTitle>
          <DialogDescription>
            {job ? 'Modifiez les détails de votre offre d\'emploi' : 'Créez une nouvelle offre d\'emploi pour attirer les meilleurs talents'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="details">Détails & Exigences</TabsTrigger>
              <TabsTrigger value="options">Options avancées</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations principales</CardTitle>
                  <CardDescription>Les informations essentielles de votre offre</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Titre du poste *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex: Développeur Full Stack Senior"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Localisation *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Ex: Paris, France"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="employmentType">Type de contrat</Label>
                      <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experienceLevel">Niveau d'expérience</Label>
                      <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="remotePolicy">Politique de télétravail</Label>
                      <Select value={formData.remotePolicy} onValueChange={(value) => handleInputChange('remotePolicy', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {remotePolicies.map(policy => (
                            <SelectItem key={policy.value} value={policy.value}>
                              {policy.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description du poste *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez le poste, les responsabilités principales..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exigences et avantages</CardTitle>
                  <CardDescription>Détaillez les compétences requises et les avantages offerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="requirements">Exigences et qualifications</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="Listez les compétences techniques, l'expérience requise, les diplômes..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Avantages et bénéfices</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      placeholder="Décrivez les avantages : salaire, télétravail, formation, etc."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Compétences requises</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Ajouter une compétence"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <Button type="button" onClick={handleAddSkill} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-500" 
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Salaire minimum</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="salaryMin"
                          type="number"
                          value={formData.salaryMin}
                          onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                          placeholder="40000"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="salaryMax">Salaire maximum</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="salaryMax"
                          type="number"
                          value={formData.salaryMax}
                          onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                          placeholder="60000"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currency">Devise</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="options" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Options de publication</CardTitle>
                  <CardDescription>Configurez la visibilité et les options spéciales de votre annonce</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Annonce urgente</h4>
                        <p className="text-sm text-gray-600">Marquer cette offre comme urgente pour attirer l'attention</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) => handleInputChange('isUrgent', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <h4 className="font-medium">Mettre en vedette</h4>
                        <p className="text-sm text-gray-600">Afficher cette offre en priorité dans les résultats</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.location}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </div>
              ) : (
                job ? 'Mettre à jour' : 'Créer l\'annonce'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
