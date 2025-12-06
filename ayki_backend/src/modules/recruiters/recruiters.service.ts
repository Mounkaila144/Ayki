import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { Experience } from '../../entities/experience.entity';
import { Education } from '../../entities/education.entity';
import { Application } from '../../entities/application.entity';
import { Bookmark, BookmarkType } from '../../entities/bookmark.entity';
import * as Fuse from 'fuse.js';

@Injectable()
export class RecruitersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(UserSkill)
    private userSkillRepository: Repository<UserSkill>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async getRecruiterStats(recruiterId: string) {
    try {
      // Compter le nombre total de candidats
      const totalCandidates = await this.userRepository.count({
        where: { userType: UserType.CANDIDATE, status: UserStatus.ACTIVE }
      });

      // Compter les candidats mis en favoris par ce recruteur
      const bookmarkedCandidates = await this.bookmarkRepository.count({
        where: { recruiterId: recruiterId }
      });

      // Pour l'instant, retournons des données de base avec ce qu'on peut calculer
      return {
        totalCandidates,
        bookmarkedCandidates,
        activeJobOffers: 0, // À implémenter quand on aura les job offers
        totalApplications: 0, // À implémenter quand on aura les applications
        interviewsScheduled: 0, // À implémenter quand on aura les interviews
        hiredCandidates: 0, // À implémenter plus tard
      };
    } catch (error) {
      console.error('Error getting recruiter stats:', error);
      return {
        totalCandidates: 0,
        bookmarkedCandidates: 0,
        activeJobOffers: 0,
        totalApplications: 0,
        interviewsScheduled: 0,
        hiredCandidates: 0,
      };
    }
  }

  async searchCandidates(recruiterId: string, filters: any) {
    try {
      console.log('=== ADVANCED SEARCH CANDIDATES START ===');
      console.log('Recruiter ID:', recruiterId);
      console.log('Filters received:', filters);

      const {
        search = '',
        location = '',
        skills = '',
        experience = '',
        sortBy = 'relevance',
        sortOrder = 'desc',
        page = 1,
        limit = 12
      } = filters;

      // Construire la requête de base avec toutes les relations nécessaires
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.skills', 'userSkills')
        .leftJoinAndSelect('userSkills.skill', 'skill')
        .leftJoinAndSelect('user.experiences', 'experiences')
        .leftJoinAndSelect('user.educations', 'educations')
        .leftJoinAndSelect('user.documents', 'documents')
        .where('user.userType = :userType', { userType: UserType.CANDIDATE })
        .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

      // Si il y a une recherche textuelle, on fait une recherche avancée multi-champs
      if (search && search.trim() !== '') {
        const searchTerm = `%${search.trim()}%`;

        queryBuilder.andWhere(
          new Brackets((qb) => {
            // Recherche dans le profil
            qb.where('profile.firstName LIKE :search', { search: searchTerm })
              .orWhere('profile.lastName LIKE :search', { search: searchTerm })
              .orWhere('profile.title LIKE :search', { search: searchTerm })
              .orWhere('profile.summary LIKE :search', { search: searchTerm })
              .orWhere('profile.bio LIKE :search', { search: searchTerm })
              // Recherche dans les compétences
              .orWhere('skill.name LIKE :search', { search: searchTerm })
              // Recherche dans les expériences
              .orWhere('experiences.title LIKE :search', { search: searchTerm })
              .orWhere('experiences.company LIKE :search', { search: searchTerm })
              .orWhere('experiences.description LIKE :search', { search: searchTerm })
              .orWhere('experiences.industry LIKE :search', { search: searchTerm })
              // Recherche dans les formations
              .orWhere('educations.degree LIKE :search', { search: searchTerm })
              .orWhere('educations.school LIKE :search', { search: searchTerm })
              .orWhere('educations.fieldOfStudy LIKE :search', { search: searchTerm })
              .orWhere('educations.description LIKE :search', { search: searchTerm });
          })
        );
      }

      // Filtre de localisation
      if (location && location.trim() !== '') {
        queryBuilder.andWhere('profile.location LIKE :location', {
          location: `%${location.trim()}%`
        });
      }

      // Filtre de compétences spécifiques
      if (skills && skills.trim() !== '') {
        const skillsArray = skills.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (skillsArray.length > 0) {
          queryBuilder.andWhere('skill.name IN (:...skillsList)', {
            skillsList: skillsArray
          });
        }
      }

      // Récupérer tous les candidats matchant (sans pagination d'abord pour le fuzzy search)
      const users = await queryBuilder.getMany();

      console.log('Initial SQL results:', users.length);

      // Si on a un terme de recherche, on applique le fuzzy matching avec Fuse.js
      let scoredCandidates = users.map(user => ({
        user,
        score: 0,
        matchDetails: []
      }));

      if (search && search.trim() !== '') {
        // Préparer les données pour Fuse.js
        const searchableData = users.map(user => {
          const profile = user.profile || {};
          const userSkills = user.skills?.map(us => us.skill?.name).filter(Boolean) || [];
          const experiences = user.experiences || [];
          const educations = user.educations || [];

          return {
            user,
            searchableText: [
              profile.firstName,
              profile.lastName,
              profile.title,
              profile.summary,
              profile.bio,
              ...userSkills,
              ...(profile.languages || []),
              ...(profile.interests || []),
              ...experiences.map(exp => [
                exp.title,
                exp.company,
                exp.description,
                ...(exp.technologies || []),
                ...(exp.skills || []),
                exp.industry
              ]).flat(),
              ...educations.map(edu => [
                edu.degree,
                edu.school,
                edu.fieldOfStudy,
                edu.description,
                ...(edu.coursework || [])
              ]).flat()
            ].filter(Boolean).join(' ')
          };
        });

        // Configuration de Fuse.js pour le fuzzy search
        const FuseClass = (Fuse as any).default || Fuse;
        const fuse = new FuseClass(searchableData, {
          keys: ['searchableText'],
          threshold: 0.4, // Tolérance aux erreurs (0 = exact, 1 = tout accepter)
          distance: 100, // Distance maximale pour considérer un match
          minMatchCharLength: 2,
          includeScore: true,
          ignoreLocation: true, // Chercher partout dans le texte
          useExtendedSearch: true
        });

        // Effectuer la recherche fuzzy
        const fuseResults = fuse.search(search.trim());

        console.log('Fuse.js results:', fuseResults.length);

        // Créer un map des scores
        const scoreMap = new Map();
        fuseResults.forEach((result, index) => {
          // Score inversé : plus le score Fuse est proche de 0, mieux c'est
          // On transforme en score de pertinence de 0 à 100
          const relevanceScore = Math.round((1 - (result.score || 0)) * 100);
          scoreMap.set(result.item.user.id, {
            score: relevanceScore,
            position: index
          });
        });

        // Appliquer les scores
        scoredCandidates = users
          .map(user => {
            const scoreData = scoreMap.get(user.id);
            return {
              user,
              score: scoreData?.score || 0,
              matchDetails: []
            };
          })
          .filter(item => item.score > 0); // Garder seulement ceux qui matchent
      }

      // Tri des résultats
      if (sortBy === 'relevance' && search && search.trim() !== '') {
        // Tri par pertinence (score décroissant)
        scoredCandidates.sort((a, b) => b.score - a.score);
      } else {
        // Tris traditionnels
        scoredCandidates.sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case 'name':
              const nameA = a.user.profile?.firstName || '';
              const nameB = b.user.profile?.firstName || '';
              comparison = nameA.localeCompare(nameB);
              break;
            case 'experience':
              const expA = a.user.profile?.yearsOfExperience || 0;
              const expB = b.user.profile?.yearsOfExperience || 0;
              comparison = expA - expB;
              break;
            case 'lastActive':
            default:
              const dateA = new Date(a.user.updatedAt).getTime();
              const dateB = new Date(b.user.updatedAt).getTime();
              comparison = dateA - dateB;
              break;
          }
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // Pagination après le tri
      const total = scoredCandidates.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginatedResults = scoredCandidates.slice(offset, offset + parseInt(limit));

      // Transformation pour le frontend
      const candidates = paginatedResults.map(item => {
        const candidate = this.transformUserToCandidate(item.user);
        return {
          ...candidate,
          matchScore: item.score || candidate.matchScore
        };
      });

      const result = {
        data: candidates,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      };

      console.log('=== ADVANCED SEARCH CANDIDATES END ===');
      console.log('Results:', {
        totalFound: total,
        page: result.page,
        returned: candidates.length
      });

      return result;
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  }

  async getBookmarkedCandidates(recruiterId: string) {
    try {
      const bookmarks = await this.bookmarkRepository.find({
        where: { recruiterId: recruiterId },
        relations: ['candidate', 'candidate.profile', 'candidate.skills', 'candidate.skills.skill']
      });

      return bookmarks.map(bookmark =>
        this.transformUserToCandidate(bookmark.candidate)
      );
    } catch (error) {
      console.error('Error getting bookmarked candidates:', error);
      return [];
    }
  }

  async toggleCandidateBookmark(recruiterId: string, candidateId: string) {
    try {
      // Vérifier si le candidat existe
      const candidate = await this.userRepository.findOne({
        where: { id: candidateId, userType: UserType.CANDIDATE }
      });

      if (!candidate) {
        throw new NotFoundException('Candidat non trouvé');
      }

      // Chercher si le bookmark existe déjà
      const existingBookmark = await this.bookmarkRepository.findOne({
        where: { recruiterId: recruiterId, candidateId: candidateId }
      });

      if (existingBookmark) {
        // Supprimer le bookmark
        await this.bookmarkRepository.remove(existingBookmark);
        return { bookmarked: false, message: 'Candidat retiré des favoris' };
      } else {
        // Créer le bookmark
        const bookmark = this.bookmarkRepository.create({
          recruiterId: recruiterId,
          candidateId: candidateId,
          type: BookmarkType.CANDIDATE
        });
        await this.bookmarkRepository.save(bookmark);
        return { bookmarked: true, message: 'Candidat ajouté aux favoris' };
      }
    } catch (error) {
      console.error('Error toggling candidate bookmark:', error);
      throw error;
    }
  }

  async getCandidateProfile(recruiterId: string, candidateId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: candidateId, userType: UserType.CANDIDATE },
        relations: [
          'profile',
          'skills',
          'skills.skill',
          'experiences',
          'educations',
          'documents'
        ]
      });

      if (!user) {
        throw new NotFoundException('Candidat non trouvé');
      }

      return this.transformUserToCandidate(user, true); // true pour profil détaillé
    } catch (error) {
      console.error('Error getting candidate profile:', error);
      throw error;
    }
  }

  private transformUserToCandidate(user: User, detailed = false) {
    const profile = user.profile;
    const skills = user.skills?.map(userSkill => userSkill.skill?.name).filter(Boolean) || [];
    const latestExperience = user.experiences?.[0];
    const latestEducation = user.educations?.[0];

    // Trouver le CV principal
    const mainCV = user.documents?.find(doc => doc.type === 'cv' && doc.isMain);
    const cvUrl = mainCV?.url || mainCV?.path || null;

    const baseData = {
      id: user.id,
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      title: profile?.title || 'Non spécifié',
      location: profile?.location || 'Non spécifié',
      summary: profile?.summary || profile?.bio || 'Aucune description disponible',
      skills,
      experience: profile?.yearsOfExperience ? `${profile.yearsOfExperience} ans` : 'Non spécifié',
      avatar: profile?.avatar || null,
      salary: profile?.salaryExpectation || 'Non spécifié',
      availability: this.getAvailabilityLabel(profile?.availability),
      rating: profile?.rating || null,
      lastActive: this.getLastActiveLabel(user.updatedAt),
      education: latestEducation?.degree || 'Non spécifié',
      company: latestExperience?.company || 'Non spécifié',
      isBookmarked: false, // À calculer si nécessaire
      matchScore: Math.floor(Math.random() * 30) + 70, // Score aléatoire pour l'instant
      profileCompletion: profile?.profileCompletion || 0,
      cvUrl: cvUrl,
      phone: user.phone || null,
      email: profile?.email || null,
    };

    if (detailed) {
      return {
        ...baseData,
        experiences: user.experiences || [],
        educations: user.educations || [],
        documents: user.documents || [],
      };
    }

    return baseData;
  }

  private getAvailabilityLabel(availability: string | undefined): string {
    const labels = {
      'immediate': 'Immédiate',
      'one_week': '1 semaine',
      'two_weeks': '2 semaines',
      'one_month': '1 mois',
      'two_months': '2 mois',
      'three_months': '3 mois',
      'not_available': 'Non disponible'
    };
    return labels[availability as keyof typeof labels] || 'Non spécifié';
  }

  private getLastActiveLabel(updatedAt: Date): string {
    const now = new Date();
    const diff = now.getTime() - updatedAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'maintenant';
    if (hours < 24) return `${hours}h`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}j`;
    
    const months = Math.floor(days / 30);
    return `${months}m`;
  }
}