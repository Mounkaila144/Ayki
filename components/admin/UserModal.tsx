'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Briefcase,
  GraduationCap,
  FileText,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApiClient, AdminUser } from '@/lib/admin-api';

interface UserModalProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

export function UserModal({ userId, open, onClose }: UserModalProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && open) {
      fetchUser();
    }
  }, [userId, open]);

  const fetchUser = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userData = await adminApiClient.getUserById(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Fermer</Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              {user.profile?.avatar ? (
                <img 
                  src={user.profile.avatar} 
                  alt="Avatar" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {user.profile?.firstName} {user.profile?.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusBadge(user.status)}>
                  {user.status}
                </Badge>
                <Badge variant="outline">
                  {user.userType === 'candidate' ? 'Candidat' : 'Recruteur'}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            {user.userType === 'candidate' && (
              <TabsTrigger value="experience">Expérience</TabsTrigger>
            )}
            {user.userType === 'recruiter' && (
              <TabsTrigger value="company">Entreprise</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{user.phone}</span>
                    {user.phoneVerifiedAt && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {user.profile?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{user.profile.email}</span>
                      {user.emailVerifiedAt && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  )}
                  {user.profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{user.profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Inscrit le {formatDate(user.createdAt)}</span>
                  </div>
                </div>
                
                {user.profile?.title && (
                  <div>
                    <h4 className="font-medium mb-1">Titre</h4>
                    <p className="text-gray-600">{user.profile.title}</p>
                  </div>
                )}
                
                {user.profile?.summary && (
                  <div>
                    <h4 className="font-medium mb-1">Résumé</h4>
                    <p className="text-gray-600">{user.profile.summary}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.profile?.profileCompletion || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Profil complété</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {user.profile?.profileViews || 0}
                    </div>
                    <div className="text-sm text-gray-500">Vues du profil</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold">
                        {user.profile?.rating || 0}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">Note moyenne</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Dernière connexion</span>
                    <span className="text-gray-600">
                      {user.lastLoginAt 
                        ? formatDate(user.lastLoginAt)
                        : 'Jamais connecté'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date d'inscription</span>
                    <span className="text-gray-600">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dernière mise à jour</span>
                    <span className="text-gray-600">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.userType === 'candidate' && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Candidatures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {user.applications?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500">Total des candidatures</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {user.documents?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500">CV et documents</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {user.userType === 'recruiter' && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Offres d'emploi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {user.jobOffers?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500">Offres publiées</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Candidatures reçues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {user.applications?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500">Total reçues</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {user.userType === 'candidate' && (
            <TabsContent value="experience" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Expériences ({user.experiences?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.experiences?.length ? (
                      <div className="space-y-2">
                        {user.experiences.slice(0, 3).map((exp: any, index: number) => (
                          <div key={index} className="border-l-2 border-blue-200 pl-3">
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucune expérience renseignée</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Formation ({user.educations?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.educations?.length ? (
                      <div className="space-y-2">
                        {user.educations.slice(0, 3).map((edu: any, index: number) => (
                          <div key={index} className="border-l-2 border-green-200 pl-3">
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucune formation renseignée</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Compétences ({user.skills?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.slice(0, 10).map((skill: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune compétence renseignée</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {user.userType === 'recruiter' && user.company && (
            <TabsContent value="company" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {user.company.logo && (
                      <img 
                        src={user.company.logo} 
                        alt="Logo" 
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{user.company.name}</h3>
                      {user.company.industry && (
                        <p className="text-gray-600">{user.company.industry}</p>
                      )}
                    </div>
                  </div>

                  {user.company.description && (
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-gray-600">{user.company.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {user.company.size && (
                      <div>
                        <h4 className="font-medium">Taille</h4>
                        <p className="text-gray-600">{user.company.size} employés</p>
                      </div>
                    )}
                    {user.company.website && (
                      <div>
                        <h4 className="font-medium">Site web</h4>
                        <a 
                          href={user.company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.company.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
