import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Experience } from '../../entities/experience.entity';
import { Education } from '../../entities/education.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { Skill } from '../../entities/skill.entity';
export declare class UsersService {
    private userRepository;
    private experienceRepository;
    private educationRepository;
    private userSkillRepository;
    private skillRepository;
    constructor(userRepository: Repository<User>, experienceRepository: Repository<Experience>, educationRepository: Repository<Education>, userSkillRepository: Repository<UserSkill>, skillRepository: Repository<Skill>);
    findAll(query: any): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    getUserExperiences(userId: string): Promise<Experience[]>;
    addUserExperience(userId: string, experienceData: any): Promise<Experience[]>;
    updateUserExperience(userId: string, experienceId: string, experienceData: any): Promise<Experience>;
    deleteUserExperience(userId: string, experienceId: string): Promise<{
        message: string;
    }>;
    getUserEducation(userId: string): Promise<Education[]>;
    addUserEducation(userId: string, educationData: any): Promise<Education[]>;
    updateUserEducation(userId: string, educationId: string, educationData: any): Promise<Education>;
    deleteUserEducation(userId: string, educationId: string): Promise<{
        message: string;
    }>;
    getUserSkills(userId: string): Promise<UserSkill[]>;
    getAllSkills(): Promise<Skill[]>;
    addUserSkill(userId: string, skillData: any): Promise<UserSkill | null>;
    updateUserSkill(userId: string, userSkillId: string, skillData: any): Promise<UserSkill>;
    deleteUserSkill(userId: string, userSkillId: string): Promise<{
        message: string;
    }>;
}
