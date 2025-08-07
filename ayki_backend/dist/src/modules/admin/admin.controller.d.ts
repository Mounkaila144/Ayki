import { SimpleAdminService } from './admin.service.simple';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: SimpleAdminService);
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
    getCandidates(page?: number, limit?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC', status?: string, search?: string, location?: string, startDate?: string, endDate?: string, emailVerified?: boolean, phoneVerified?: boolean): Promise<{
        data: {
            id: string;
            phone: string;
            userType: import("../../entities").UserType;
            status: import("../../entities").UserStatus;
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
    getRecruiters(page?: number, limit?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC', status?: string, search?: string, location?: string, company?: string, startDate?: string, endDate?: string, emailVerified?: boolean, phoneVerified?: boolean): Promise<{
        data: {
            id: string;
            phone: string;
            userType: import("../../entities").UserType;
            status: import("../../entities").UserStatus;
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
        userType: import("../../entities").UserType;
        status: import("../../entities").UserStatus;
        adminRole: import("../../entities").AdminRole;
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
    updateUserStatus(id: string, updateDto: {
        status: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllJobs(query: any): Promise<{
        data: import("../../entities").JobOffer[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createAdminJob(req: any, createJobDto: any): Promise<import("../../entities").JobOffer[]>;
    updateAdminJob(id: string, updateJobDto: any): Promise<import("../../entities").JobOffer | null>;
    deleteAdminJob(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateRecruiterJob(id: string, updateJobDto: any): Promise<import("../../entities").JobOffer | null>;
}
