import { JobStatus, ExperienceLevel, RemotePolicy } from '../../../entities/job-offer.entity';
import { EmploymentType } from '../../../entities/experience.entity';
export declare class UpdateJobDto {
    title?: string;
    description?: string;
    requirements?: string;
    responsibilities?: string;
    benefits?: string;
    location?: string;
    employmentType?: EmploymentType;
    experienceLevel?: ExperienceLevel;
    remotePolicy?: RemotePolicy;
    salaryMin?: string;
    salaryMax?: string;
    currency?: string;
    salaryPeriod?: string;
    salaryNegotiable?: boolean;
    positions?: number;
    applicationDeadline?: Date;
    startDate?: Date;
    status?: JobStatus;
    languages?: string[];
    benefits_list?: string[];
    tags?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
    isUrgent?: boolean;
    companyId?: string;
}
