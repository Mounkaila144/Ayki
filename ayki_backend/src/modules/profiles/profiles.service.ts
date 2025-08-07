import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../../entities/user-profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

  async findByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profil non trouvé');
    }

    return profile;
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
}
