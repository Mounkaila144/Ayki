"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Sparkles
} from "lucide-react";
import Link from "next/link";

// Mock data - In a real app, this would come from an API based on the ID
const candidateProfile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  title: 'Développeur Full Stack',
  location: 'Paris, France',
  email: 'jean.dupont@email.com',
  phone: '+33 1 23 45 67 89',
  summary: 'Développeur passionné avec 5 ans d\'expérience en développement web. Spécialisé dans les technologies React, Node.js et les architectures modernes. Fort d\'une expérience variée allant des startups aux grandes entreprises, je suis toujours à la recherche de nouveaux défis techniques et d\'opportunités d\'apprentissage.',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'],
  experiences: [
    {
      title: 'Développeur Senior Full Stack',
      company: 'TechCorp',
      duration: '2022 - Présent',
      description: 'Lead technique sur plusieurs projets web, encadrement d\'une équipe de 4 développeurs junior, migration d\'applications legacy vers des architectures modernes.'
    },
    {
      title: 'Développeur Full Stack',
      company: 'StartupInnovante',
      duration: '2020 - 2022',
      description: 'Développement from scratch d\'une plateforme SaaS, intégration d\'APIs tierces, optimisation des performances et mise en place de tests automatisés.'
    },
    {
      title: 'Développeur Frontend',
      company: 'AgenceWeb',
      duration: '2019 - 2020',
      description: 'Création d\'interfaces utilisateur responsives, collaboration étroite avec les designers, intégration de solutions e-commerce.'
    }
  ],
  education: [
    {
      degree: 'Master en Sciences Informatiques',
      school: 'Université Paris-Sorbonne',
      year: '2019'
    },
    {
      degree: 'Licence en Informatique',
      school: 'Université Paris-Sorbonne',
      year: '2017'
    }
  ]
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/recruiter">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  AYKI
                </h1>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Télécharger CV
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {candidateProfile.firstName[0]}{candidateProfile.lastName[0]}
                </span>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {candidateProfile.firstName} {candidateProfile.lastName}
                </h1>
                <p className="text-xl text-gray-600 mb-2">{candidateProfile.title}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {candidateProfile.location}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {candidateProfile.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {candidateProfile.phone}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>À propos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{candidateProfile.summary}</p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {candidateProfile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Expérience professionnelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {candidateProfile.experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                {index < candidateProfile.experiences.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Formation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidateProfile.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
                {index < candidateProfile.education.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Intéressé par ce profil ?</h3>
              <p className="text-gray-600 mb-4">
                Contactez {candidateProfile.firstName} pour discuter d'opportunités
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Programmer un appel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}