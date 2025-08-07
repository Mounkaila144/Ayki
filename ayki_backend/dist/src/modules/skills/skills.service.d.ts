import { Repository } from 'typeorm';
import { Skill } from '../../entities/skill.entity';
export declare class SkillsService {
    private skillRepository;
    constructor(skillRepository: Repository<Skill>);
    create(createSkillDto: any): Promise<Skill[]>;
    findAll(): Promise<Skill[]>;
    findByCategory(category: string): Promise<Skill[]>;
    findOne(id: string): Promise<Skill | null>;
    update(id: string, updateSkillDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
