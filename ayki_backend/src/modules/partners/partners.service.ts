import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../../entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto, logo: string): Promise<Partner> {
    const partner = this.partnerRepository.create({
      ...createPartnerDto,
      logo,
    });
    return this.partnerRepository.save(partner);
  }

  async findAll(): Promise<Partner[]> {
    return this.partnerRepository.find({
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findAllActive(): Promise<Partner[]> {
    return this.partnerRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(`Partenaire avec l'ID ${id} non trouvé`);
    }
    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto, logo?: string): Promise<Partner> {
    const partner = await this.findOne(id);

    Object.assign(partner, updatePartnerDto);
    if (logo) {
      partner.logo = logo;
    }

    return this.partnerRepository.save(partner);
  }

  async remove(id: string): Promise<void> {
    const partner = await this.findOne(id);
    await this.partnerRepository.remove(partner);
  }
}
