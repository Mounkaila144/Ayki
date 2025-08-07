import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { Experience } from '../../entities/experience.entity';
import { Education } from '../../entities/education.entity';
import { Application } from '../../entities/application.entity';
import { Bookmark, BookmarkType } from '../../entities/bookmark.entity';

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
      console.log('=== SEARCH CANDIDATES START ===');
      console.log('Recruiter ID:', recruiterId);
      console.log('Filters received:', filters);

      const {
        search = '',
        location = '',
        skills = '',
        experience = '',
        sortBy = 'lastActive',
        sortOrder = 'desc',
        page = 1,
        limit = 12
      } = filters;

      // D'abord, comptons tous les candidats actifs
      const totalCandidates = await this.userRepository.count({
        where: { userType: UserType.CANDIDATE, status: UserStatus.ACTIVE }
      });
      console.log('Total active candidates in database:', totalCandidates);

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.skills', 'skills')
        .leftJoinAndSelect('user.experiences', 'experiences')
        .leftJoinAndSelect('user.educations', 'educations')
        .where('user.userType = :userType', { userType: UserType.CANDIDATE })
        .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

      // Filtres de recherche
      if (search) {
        queryBuilder.andWhere(
          '(profile.firstName LIKE :search OR profile.lastName LIKE :search OR profile.title LIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (location) {
        queryBuilder.andWhere('profile.location LIKE :location', { location: `%${location}%` });
      }

      if (skills) {
        const skillsArray = skills.split(',').map((s: string) => s.trim());
        queryBuilder.andWhere('skills.name IN (:...skills)', { skills: skillsArray });
      }

      // Tri
      switch (sortBy) {
        case 'name':
          queryBuilder.orderBy('profile.firstName', sortOrder.toUpperCase() as 'ASC' | 'DESC');
          break;
        case 'experience':
          queryBuilder.orderBy('profile.yearsOfExperience', sortOrder.toUpperCase() as 'ASC' | 'DESC');
          break;
        case 'lastActive':
        default:
          queryBuilder.orderBy('user.updatedAt', sortOrder.toUpperCase() as 'ASC' | 'DESC');
          break;
      }

      // Pagination
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Log de la requête générée
      console.log('Generated SQL:', queryBuilder.getSql());

      const [users, total] = await queryBuilder.getManyAndCount();
      
      console.log('Users found:', users.length);
      console.log('Total count:', total);

      if (users.length > 0) {
        console.log('First user sample:', {
          id: users[0].id,
          userType: users[0].userType,
          hasProfile: !!users[0].profile,
          profileData: users[0].profile
        });
      }

      // Transformer les données pour le frontend
      const candidates = users.map(user => this.transformUserToCandidate(user));
      console.log('Candidates after transformation:', candidates.length);

      const result = {
        data: candidates,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        limit: parseInt(limit)
      };

      console.log('=== SEARCH CANDIDATES END ===');
      console.log('Result:', result);
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
        relations: ['candidate', 'candidate.profile', 'candidate.skills']
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
    const skills = user.skills?.map(skill => skill.name).filter(Boolean) || [];
    const latestExperience = user.experiences?.[0];
    const latestEducation = user.educations?.[0];

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
    };

    if (detailed) {
      return {
        ...baseData,
        email: profile?.email || '',
        phone: user.phone || '',
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