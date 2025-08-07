import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../../entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  create(createSkillDto: any) {
    const skill = this.skillRepository.create(createSkillDto);
    return this.skillRepository.save(skill);
  }

  async findAll() {
    return this.skillRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByCategory(category: string) {
    return this.skillRepository.find({
      where: { category: category as any, isActive: true },
      order: { name: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.skillRepository.findOne({ where: { id } });
  }

  update(id: string, updateSkillDto: any) {
    return this.skillRepository.update(id, updateSkillDto);
  }

  remove(id: string) {
    return this.skillRepository.delete(id);
  }
}