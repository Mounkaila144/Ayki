import { Repository } from 'typeorm';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { JobOffer } from '../../entities/job-offer.entity';
export interface SimpleAdminUserFilter {
    status?: string;
    search?: string;
    location?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
}
export interface SimpleAdminPagination {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export declare class SimpleAdminService {
    private userRepository;
    private profileRepository;
    private companyRepository;
    private jobOfferRepository;
    constructor(userRepository: Repository<User>, profileRepository: Repository<UserProfile>, companyRepository: Repository<Company>, jobOfferRepository: Repository<JobOffer>);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalCandidates: number;
        totalRecruiters: number;
        activeCandidates: number;
        activeRecruiters: number;
        inactiveCandidates: number;
        inactiveRecruiters: number;
        suspendedCandidates: number;
        suspendedRecruiters: number;
        pendingCandidates: number;
        pendingRecruiters: number;
        verifiedEmails: number;
        verifiedPhones: number;
        completionRate: number;
        averageRating: number;
        thisMonthSignups: number;
        lastWeekActivity: number;
    }>;
    getCandidates(filters?: SimpleAdminUserFilter, pagination?: SimpleAdminPagination): Promise<{
        data: {
            id: string;
            phone: string;
            userType: UserType;
            status: UserStatus;
            emailVerifiedAt: Date;
            phoneVerifiedAt: Date;
            createdAt: Date;
            updatedAt: Date;
            profile: {
                firstName: string;
                lastName: string;
                email: string;
                title: string;
                location: string;
                summary: string;
                profileCompletion: number;
                profileViews: number;
                rating: number;
            } | null;
            company: {
                name: string;
                logo: string;
                website: string;
            } | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecruiters(filters?: SimpleAdminUserFilter, pagination?: SimpleAdminPagination): Promise<{
        data: {
            id: string;
            phone: string;
            userType: UserType;
            status: UserStatus;
            emailVerifiedAt: Date;
            phoneVerifiedAt: Date;
            createdAt: Date;
            updatedAt: Date;
            profile: {
                firstName: string;
                lastName: string;
                email: string;
                title: string;
                location: string;
                summary: string;
                profileCompletion: number;
                profileViews: number;
                rating: number;
            } | null;
            company: {
                name: string;
                logo: string;
                website: string;
                jobOffersCount: number;
            } | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        phone: string;
        userType: UserType;
        status: UserStatus;
        adminRole: import("../../entities/user.entity").AdminRole;
        emailVerifiedAt: Date;
        phoneVerifiedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        profile: {
            firstName: string;
            lastName: string;
            email: string;
            title: string;
            location: string;
            summary: string;
            profileCompletion: number;
            profileViews: number;
            rating: number;
        } | null;
        company: {
            name: string;
            logo: string;
            website: string;
        } | null;
    }>;
    updateUserStatus(id: string, status: {
        status: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllJobs(query?: any): Promise<{
        data: JobOffer[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createAdminJob(adminId: string, createJobDto: any): Promise<JobOffer[]>;
    updateAdminJob(id: string, updateJobDto: any): Promise<JobOffer | null>;
    deleteAdminJob(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateRecruiterJob(id: string, updateJobDto: any): Promise<JobOffer | null>;
}
