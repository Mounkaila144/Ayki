import { User } from './user.entity';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { JobOfferSkill } from './job-offer-skill.entity';
import { EmploymentType } from './experience.entity';
export declare enum JobStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    PAUSED = "paused",
    CLOSED = "closed",
    EXPIRED = "expired"
}
export declare enum ExperienceLevel {
    ENTRY = "entry",
    JUNIOR = "junior",
    MID = "mid",
    SENIOR = "senior",
    LEAD = "lead",
    EXECUTIVE = "executive"
}
export declare enum RemotePolicy {
    ON_SITE = "on_site",
    REMOTE = "remote",
    HYBRID = "hybrid",
    FLEXIBLE = "flexible"
}
export declare class JobOffer {
    id: string;
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    benefits: string;
    location: string;
    employmentType: EmploymentType;
    experienceLevel: ExperienceLevel;
    remotePolicy: RemotePolicy;
    salaryMin: string;
    salaryMax: string;
    currency: string;
    salaryPeriod: string;
    salaryNegotiable: boolean;
    positions: number;
    applicationDeadline: Date;
    startDate: Date;
    status: JobStatus;
    languages: string[];
    benefits_list: string[];
    tags: string[];
    viewCount: number;
    applicationCount: number;
    isActive: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
    isAdminPost: boolean;
    createdAt: Date;
    updatedAt: Date;
    recruiter: User;
    recruiterId: string;
    company: Company;
    companyId: string;
    applications: Application[];
    requiredSkills: JobOfferSkill[];
}
