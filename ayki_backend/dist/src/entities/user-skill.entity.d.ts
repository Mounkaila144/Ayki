import { User } from './user.entity';
import { Skill } from './skill.entity';
export declare enum SkillLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert"
}
export declare enum EndorsementStatus {
    SELF_ASSESSED = "self_assessed",
    PEER_ENDORSED = "peer_endorsed",
    MANAGER_ENDORSED = "manager_endorsed",
    CERTIFIED = "certified",
    TESTED = "tested"
}
export declare class UserSkill {
    id: string;
    level: SkillLevel;
    yearsOfExperience: number;
    monthsOfExperience: number;
    endorsementStatus: EndorsementStatus;
    endorsementCount: number;
    description: string;
    projects: string[];
    certifications: string[];
    lastUsedDate: Date;
    isVisible: boolean;
    isFeatured: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    skill: Skill;
    skillId: string;
}
