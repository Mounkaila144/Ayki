import { User } from './user.entity';
import { JobOffer } from './job-offer.entity';
export declare enum CompanySize {
    STARTUP = "1-10",
    SMALL = "11-50",
    MEDIUM = "51-200",
    LARGE = "201-1000",
    ENTERPRISE = "1000+"
}
export declare enum CompanyType {
    STARTUP = "startup",
    PRIVATE = "private",
    PUBLIC = "public",
    NON_PROFIT = "non_profit",
    GOVERNMENT = "government"
}
export declare class Company {
    id: string;
    name: string;
    description: string;
    industry: string;
    size: CompanySize;
    type: CompanyType;
    foundedYear: number;
    website: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    logo: string;
    banner: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    benefits: string[];
    values: string[];
    technologies: string[];
    isActive: boolean;
    isVerified: boolean;
    rating: number;
    ratingCount: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    jobOffers: JobOffer[];
}
