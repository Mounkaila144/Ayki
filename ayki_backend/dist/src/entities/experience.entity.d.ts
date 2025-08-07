import { User } from './user.entity';
export declare enum EmploymentType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    FREELANCE = "freelance",
    INTERNSHIP = "internship",
    APPRENTICESHIP = "apprenticeship"
}
export declare class Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    employmentType: EmploymentType;
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
    description: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
    skills: string[];
    industry: string;
    salary: string;
    teamSize: number;
    isRemote: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
