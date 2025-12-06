import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../../entities/user-profile.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: string): Promise<any> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profil non trouvé');
    }

    // Retourner le profil avec le numéro de téléphone de l'utilisateur
    return {
      ...profile,
      phone: profile.user?.phone || null,
    };
  }

  async updateByUserId(userId: string, updateData: Partial<UserProfile>): Promise<UserProfile> {
    // Chercher le profil existant
    let profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      // Créer un nouveau profil s'il n'existe pas
      profile = this.profileRepository.create({
        userId,
        ...updateData,
      });
    } else {
      // Mettre à jour le profil existant
      Object.assign(profile, updateData);
    }

    return await this.profileRepository.save(profile);
  }

  /**
   * Récupère un profil public par son slug
   * Le slug est au format: prenom-nom-userId (8 premiers caractères)
   * Exemple: jean-dupont-a1b2c3d4
   */
  async findBySlug(slug: string): Promise<any> {
    // Extraire l'ID du slug (les 8 derniers caractères après le dernier tiret)
    const slugParts = slug.split('-');
    if (slugParts.length < 3) {
      throw new NotFoundException('Format de slug invalide');
    }

    const userIdPart = slugParts[slugParts.length - 1]; // Les 8 derniers caractères de l'ID

    // Chercher l'utilisateur dont l'ID commence par cette partie
    const users = await this.userRepository.find({
      where: { userType: 'candidate' as any },
      relations: [
        'profile',
        'experiences',
        'educations',
        'skills',
        'skills.skill', // Charger la relation Skill dans UserSkill
      ],
    });

    const user = users.find(u => u.id.startsWith(userIdPart));

    if (!user || !user.profile) {
      throw new NotFoundException('Profil non trouvé');
    }

    // Vérifier que le slug correspond au nom complet
    const expectedSlug = this.generateSlug(
      user.profile.firstName,
      user.profile.lastName,
      user.id,
    );

    if (expectedSlug !== slug) {
      throw new NotFoundException('Profil non trouvé');
    }

    // Incrémenter le compteur de vues du profil
    user.profile.profileViews += 1;
    await this.profileRepository.save(user.profile);

    // Formater la réponse
    return {
      id: user.id,
      slug: expectedSlug,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      title: user.profile.title,
      location: user.profile.location,
      email: user.profile.email,
      phone: user.phone,
      summary: user.profile.summary,
      avatar: user.profile.avatar,
      skills: (user.skills || []).map((userSkill: any) => ({
        id: userSkill.id,
        name: userSkill.skill?.name || 'Compétence inconnue',
        level: userSkill.level,
        yearsOfExperience: userSkill.yearsOfExperience || 0,
      })),
      experiences: (user.experiences || []).map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent || false,
        description: exp.description,
      })),
      education: (user.educations || []).map((edu: any) => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.school,
        fieldOfStudy: edu.fieldOfStudy,
        graduationYear: edu.graduationYear,
        grade: edu.grade,
        description: edu.description,
      })),
    };
  }

  /**
   * Génère un slug unique pour un profil
   */
  private generateSlug(firstName: string, lastName: string, userId: string): string {
    const cleanText = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const firstSlug = cleanText(firstName);
    const lastSlug = cleanText(lastName);
    const shortId = userId.substring(0, 8);

    return `${firstSlug}-${lastSlug}-${shortId}`;
  }
}
