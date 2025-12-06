"use client";

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Mail,
  Phone,
  Download,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Sparkles,
  Share2,
  CheckCircle,
  Calendar,
  Award,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { usePublicProfile, copyProfileLink, shareProfile, getProfileUrl } from "@/hooks/use-public-profile";
import { authUtils } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { profile, loading, error } = usePublicProfile(slug);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleShareProfile = async () => {
    if (!profile) return;

    const fullName = `${profile.firstName} ${profile.lastName}`;
    const success = await shareProfile(slug, fullName);

    if (success) {
      toast({
        title: "Lien copié !",
        description: "Le lien du profil a été copié dans votre presse-papier",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de partager le profil",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!profile || isDownloading) return;

    setIsDownloading(true);

    try {
      // Import dynamique de html2pdf pour réduire la taille du bundle
      const html2pdf = (await import('html2pdf.js')).default;

      const element = profileRef.current;
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `CV_${profile.firstName}_${profile.lastName}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();

      toast({
        title: "PDF téléchargé !",
        description: "Le CV a été téléchargé avec succès",
      });
    } catch (err) {
      console.error('Erreur lors du téléchargement PDF:', err);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatExperienceDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const currentText = isCurrent ? 'Présent' : end.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const startText = start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    return `${startText} - ${currentText}`;
  };

  const getSkillLevelLabel = (level: string) => {
    switch(level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      case 'expert': return 'Expert';
      default: return 'Débutant';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profil non trouvé</h1>
          <p className="text-gray-600 mb-6">{error || "Ce profil n'existe pas ou n'est plus disponible"}</p>
          <Button onClick={() => router.push('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const isAuthenticated = authUtils.isAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hidden sm:block">
                  AYKI
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleShareProfile}
                className="hidden sm:flex"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              {isAuthenticated && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? 'Génération...' : 'Télécharger CV'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={profileRef}>
        {/* Profile Header */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                {profile.avatar ? (
                  <img
                    src={profile.avatar.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar}` : profile.avatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-xl text-blue-600 mb-2 font-medium">{profile.title}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-green-500" />
                    {profile.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-purple-500" />
                    {profile.phone}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {profile.summary && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Compétences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        {skill.yearsOfExperience > 0 && (
                          <span className="text-xs text-gray-500">
                            {skill.yearsOfExperience} an{skill.yearsOfExperience > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {getSkillLevelLabel(skill.level)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience Section */}
        {profile.experiences && profile.experiences.length > 0 && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                Expérience professionnelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experiences.map((exp, index) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {exp.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatExperienceDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                      </p>
                    </div>
                    {exp.isCurrent && (
                      <Badge className="bg-green-100 text-green-700">
                        Actuel
                      </Badge>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed mt-2">{exp.description}</p>
                  )}
                  {index < profile.experiences.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
                Formation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600 font-medium">{edu.school}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                  )}
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {edu.graduationYear ? `Diplômé en ${edu.graduationYear}` : 'En cours'}
                  </p>
                  {edu.grade && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Award className="w-3 h-3 mr-1" />
                      {edu.grade}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                  )}
                  {index < profile.education.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contact CTA */}
        <div className="mt-8">
          <Card className="shadow-lg border-2 border-blue-100">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-center">Intéressé par ce profil ?</h3>
              <p className="text-gray-600 mb-4 text-center">
                Contactez {profile.firstName} pour discuter d'opportunités
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = `mailto:${profile.email}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareProfile}
                  className="sm:hidden"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager le profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Propulsé par </span>
            <Link href="/" className="ml-1 text-blue-600 hover:text-blue-700 font-medium flex items-center">
              AYKI
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
