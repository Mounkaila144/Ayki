import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: any): Promise<import("../../entities").User[]>;
    findOne(id: string): Promise<import("../../entities").User | null>;
    getUserExperiences(req: any): Promise<import("../../entities").Experience[]>;
    addUserExperience(req: any, experienceData: any): Promise<import("../../entities").Experience[]>;
    updateUserExperience(req: any, experienceId: string, experienceData: any): Promise<import("../../entities").Experience>;
    deleteUserExperience(req: any, experienceId: string): Promise<{
        message: string;
    }>;
    getUserEducation(req: any): Promise<import("../../entities").Education[]>;
    addUserEducation(req: any, educationData: any): Promise<import("../../entities").Education[]>;
    updateUserEducation(req: any, educationId: string, educationData: any): Promise<import("../../entities").Education>;
    deleteUserEducation(req: any, educationId: string): Promise<{
        message: string;
    }>;
    getUserSkills(req: any): Promise<import("../../entities").UserSkill[]>;
    getAllSkills(): Promise<import("../../entities").Skill[]>;
    addUserSkill(req: any, skillData: any): Promise<import("../../entities").UserSkill | null>;
    updateUserSkill(req: any, userSkillId: string, skillData: any): Promise<import("../../entities").UserSkill>;
    deleteUserSkill(req: any, userSkillId: string): Promise<{
        message: string;
    }>;
}
