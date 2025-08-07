import { User } from './user.entity';
import { UserSkill } from './user-skill.entity';
import { JobOfferSkill } from './job-offer-skill.entity';
export declare enum SkillCategory {
    TECHNICAL = "technical",
    SOFT = "soft",
    LANGUAGE = "language",
    TOOL = "tool",
    FRAMEWORK = "framework",
    DATABASE = "database",
    CLOUD = "cloud",
    METHODOLOGY = "methodology",
    DESIGN = "design",
    MANAGEMENT = "management",
    MARKETING = "marketing",
    SALES = "sales",
    OTHER = "other"
}
export declare class Skill {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    subcategory: string;
    aliases: string[];
    relatedSkills: string[];
    icon: string;
    color: string;
    isActive: boolean;
    isVerified: boolean;
    usageCount: number;
    demandScore: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    userSkills: UserSkill[];
    jobOfferSkills: JobOfferSkill[];
}
