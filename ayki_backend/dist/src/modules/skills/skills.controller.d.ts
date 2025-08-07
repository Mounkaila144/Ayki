import { SkillsService } from './skills.service';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(createSkillDto: any): Promise<import("../../entities").Skill[]>;
    findAll(category?: string): Promise<import("../../entities").Skill[]>;
    findOne(id: string): Promise<import("../../entities").Skill | null>;
    update(id: string, updateSkillDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
