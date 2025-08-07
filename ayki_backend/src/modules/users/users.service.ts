import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Experience } from '../../entities/experience.entity';
import { Education } from '../../entities/education.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { Skill } from '../../entities/skill.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(UserSkill)
    private userSkillRepository: Repository<UserSkill>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async findAll(query: any) {
    return this.userRepository.find({
      relations: ['profile', 'company'],
      take: query.limit || 10,
      skip: query.offset || 0,
    });
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'company', 'experiences', 'educations', 'skills'],
    });
  }

  // Experience methods
  async getUserExperiences(userId: string) {
    return this.experienceRepository.find({
      where: { userId },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async addUserExperience(userId: string, experienceData: any) {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Convertir les dates du format YYYY-MM vers Date
    const startDate = experienceData.startDate ? new Date(experienceData.startDate + '-01') : null;
    const endDate = experienceData.endDate ? new Date(experienceData.endDate + '-01') : null;

    const experience = this.experienceRepository.create({
      ...experienceData,
      userId,
      startDate,
      endDate,
      isCurrent: experienceData.isCurrentJob || false,
    });

    return await this.experienceRepository.save(experience);
  }

  async updateUserExperience(userId: string, experienceId: string, experienceData: any) {
    const experience = await this.experienceRepository.findOne({
      where: { id: experienceId, userId },
    });

    if (!experience) {
      throw new NotFoundException('Expérience non trouvée');
    }

    // Convertir les dates du format YYYY-MM vers Date
    const startDate = experienceData.startDate ? new Date(experienceData.startDate + '-01') : experience.startDate;
    const endDate = experienceData.endDate ? new Date(experienceData.endDate + '-01') : null;

    Object.assign(experience, {
      ...experienceData,
      startDate,
      endDate,
      isCurrent: experienceData.isCurrentJob || false,
    });

    return await this.experienceRepository.save(experience);
  }

  async deleteUserExperience(userId: string, experienceId: string) {
    const experience = await this.experienceRepository.findOne({
      where: { id: experienceId, userId },
    });

    if (!experience) {
      throw new NotFoundException('Expérience non trouvée');
    }

    await this.experienceRepository.remove(experience);
    return { message: 'Expérience supprimée avec succès' };
  }

  // Education methods
  async getUserEducation(userId: string) {
    return this.educationRepository.find({
      where: { userId },
      order: { graduationYear: 'DESC', createdAt: 'DESC' },
    });
  }

  async addUserEducation(userId: string, educationData: any) {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Convertir les dates du format YYYY-MM vers Date
    const startDate = educationData.startDate ? new Date(educationData.startDate + '-01') : null;
    const endDate = educationData.endDate ? new Date(educationData.endDate + '-01') : null;

    const education = this.educationRepository.create({
      ...educationData,
      userId,
      startDate,
      endDate,
    });

    return await this.educationRepository.save(education);
  }

  async updateUserEducation(userId: string, educationId: string, educationData: any) {
    const education = await this.educationRepository.findOne({
      where: { id: educationId, userId },
    });

    if (!education) {
      throw new NotFoundException('Formation non trouvée');
    }

    // Convertir les dates du format YYYY-MM vers Date
    const startDate = educationData.startDate ? new Date(educationData.startDate + '-01') : education.startDate;
    const endDate = educationData.endDate ? new Date(educationData.endDate + '-01') : null;

    Object.assign(education, {
      ...educationData,
      startDate,
      endDate,
    });

    return await this.educationRepository.save(education);
  }

  async deleteUserEducation(userId: string, educationId: string) {
    const education = await this.educationRepository.findOne({
      where: { id: educationId, userId },
    });

    if (!education) {
      throw new NotFoundException('Formation non trouvée');
    }

    await this.educationRepository.remove(education);
    return { message: 'Formation supprimée avec succès' };
  }

  // Skills methods
  async getUserSkills(userId: string) {
    return this.userSkillRepository.find({
      where: { userId },
      relations: ['skill'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async getAllSkills() {
    return this.skillRepository.find({
      where: { isActive: true },
      order: { usageCount: 'DESC', name: 'ASC' },
    });
  }

  async addUserSkill(userId: string, skillData: any) {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    let skill: Skill;

    if (skillData.skillId) {
      // Utiliser une compétence existante
      const foundSkill = await this.skillRepository.findOne({ where: { id: skillData.skillId } });
      if (!foundSkill) {
        throw new NotFoundException('Compétence non trouvée');
      }
      skill = foundSkill;
    } else if (skillData.name) {
      // Chercher une compétence existante par nom ou créer une nouvelle
      const foundSkill = await this.skillRepository.findOne({ 
        where: { name: skillData.name.toLowerCase() } 
      });

      if (foundSkill) {
        skill = foundSkill;
      } else {
        // Créer une nouvelle compétence
        const newSkill = this.skillRepository.create({
          name: skillData.name,
          category: skillData.category || 'other',
          description: skillData.description,
        });
        skill = await this.skillRepository.save(newSkill);
      }
    } else {
      throw new Error('Nom de compétence ou ID requis');
    }

    // Vérifier si l'utilisateur a déjà cette compétence
    const existingUserSkill = await this.userSkillRepository.findOne({
      where: { userId, skillId: skill.id },
    });

    if (existingUserSkill) {
      throw new Error('Cette compétence est déjà ajoutée');
    }

    // Créer la relation UserSkill
    const userSkill = this.userSkillRepository.create({
      userId,
      skillId: skill.id,
      level: skillData.level || 'beginner',
      yearsOfExperience: skillData.yearsOfExperience || 0,
      monthsOfExperience: skillData.monthsOfExperience || 0,
      description: skillData.description,
      lastUsedDate: skillData.lastUsedDate ? new Date(skillData.lastUsedDate) : undefined,
    });

    const savedUserSkill = await this.userSkillRepository.save(userSkill);

    // Incrémenter le compteur d'usage de la compétence
    await this.skillRepository.update(skill.id, { usageCount: skill.usageCount + 1 });

    // Retourner avec la relation skill chargée
    return await this.userSkillRepository.findOne({
      where: { id: savedUserSkill.id },
      relations: ['skill'],
    });
  }

  async updateUserSkill(userId: string, userSkillId: string, skillData: any) {
    const userSkill = await this.userSkillRepository.findOne({
      where: { id: userSkillId, userId },
      relations: ['skill'],
    });

    if (!userSkill) {
      throw new NotFoundException('Compétence non trouvée');
    }

    // Mettre à jour les données
    Object.assign(userSkill, {
      level: skillData.level || userSkill.level,
      yearsOfExperience: skillData.yearsOfExperience || userSkill.yearsOfExperience,
      monthsOfExperience: skillData.monthsOfExperience || userSkill.monthsOfExperience,
      description: skillData.description,
      lastUsedDate: skillData.lastUsedDate ? new Date(skillData.lastUsedDate) : userSkill.lastUsedDate,
    });

    return await this.userSkillRepository.save(userSkill);
  }

  async deleteUserSkill(userId: string, userSkillId: string) {
    const userSkill = await this.userSkillRepository.findOne({
      where: { id: userSkillId, userId },
      relations: ['skill'],
    });

    if (!userSkill) {
      throw new NotFoundException('Compétence non trouvée');
    }

    // Décrémenter le compteur d'usage de la compétence
    const skill = userSkill.skill;
    if (skill && skill.usageCount > 0) {
      await this.skillRepository.update(skill.id, { usageCount: skill.usageCount - 1 });
    }

    await this.userSkillRepository.remove(userSkill);
    return { message: 'Compétence supprimée avec succès' };
  }
}
