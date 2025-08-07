"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Briefcase, 
  Plus, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Star, 
  Zap,
  Users,
  FileText
} from "lucide-react";
import JobApplicationsModal from "./JobApplicationsModal";
import { JobOffer } from '@/hooks/use-job-offers';

interface RecruiterJobsListProps {
  jobs: JobOffer[];
  jobsLoading: boolean;
  onCreateJob: () => void;
  onEditJob: (job: JobOffer) => void;
  onDeleteJob: (jobId: string) => void;
  getJobStatusColor: (status: string) => string;
  getJobStatusLabel: (status: string) => string;
}

const RecruiterJobsList: React.FC<RecruiterJobsListProps> = ({
  jobs,
  jobsLoading,
  onCreateJob,
  onEditJob,
  onDeleteJob,
  getJobStatusColor,
  getJobStatusLabel
}) => {
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<JobOffer | null>(null);

  const handleViewApplications = (job: JobOffer) => {
    setSelectedJobForApplications(job);
  };

  if (jobsLoading) {
    return (
      <CardContent>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des annonces...</p>
          </div>
        </div>
      </CardContent>
    );
  }

  if (jobs.length === 0) {
    return (
      <CardContent>
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune annonce</h3>
          <p className="text-gray-600 mb-4">Créez votre première offre d&apos;emploi pour commencer à recruter</p>
          <Button onClick={onCreateJob} className="bg-gradient-to-r from-green-600 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Créer une annonce
          </Button>
        </div>
      </CardContent>
    );
  }

  return (
    <>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.location || 'Localisation non spécifiée'}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{job.employmentType}</span>
                      <span>•</span>
                      <span>{job.experienceLevel}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicationCount || job.applications?.length || 0} candidature(s)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getJobStatusColor(job.status)}`}>
                      {getJobStatusLabel(job.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditJob(job)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir/Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewApplications(job)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Voir les candidatures ({job.applicationCount || job.applications?.length || 0})
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteJob(job.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {job.description && (
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {job.description.length > 150 
                      ? `${job.description.substring(0, 150)}...`
                      : job.description
                    }
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>Créée le {new Date(job.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-4">
                    <span>{job.viewCount || 0} vues</span>
                    {job.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        En vedette
                      </Badge>
                    )}
                    {job.isUrgent && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        <Zap className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Boutons d'action rapide */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditJob(job)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewApplications(job)}
                    className="flex-1"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Candidatures ({job.applicationCount || job.applications?.length || 0})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Modal des candidatures */}
      <JobApplicationsModal
        job={selectedJobForApplications}
        isOpen={!!selectedJobForApplications}
        onClose={() => setSelectedJobForApplications(null)}
      />
    </>
  );
};

export default RecruiterJobsList;
