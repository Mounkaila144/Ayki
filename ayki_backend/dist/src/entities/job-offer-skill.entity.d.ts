import { JobOffer } from './job-offer.entity';
import { Skill } from './skill.entity';
import { SkillLevel } from './user-skill.entity';
export declare enum SkillImportance {
    REQUIRED = "required",
    PREFERRED = "preferred",
    NICE_TO_HAVE = "nice_to_have"
}
export declare class JobOfferSkill {
    id: string;
    requiredLevel: SkillLevel;
    importance: SkillImportance;
    minYearsExperience: number;
    description: string;
    weight: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    jobOffer: JobOffer;
    jobOfferId: string;
    skill: Skill;
    skillId: string;
}
