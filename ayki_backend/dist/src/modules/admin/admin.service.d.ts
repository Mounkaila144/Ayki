import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { JobOffer } from '../../entities/job-offer.entity';
import { Application } from '../../entities/application.entity';
import { Interview } from '../../entities/interview.entity';
import { AdminDashboardStatsDto } from './dto/admin-dashboard-stats.dto';
import { AdminUserFilterDto } from './dto/admin-user-filter.dto';
import { AdminPaginationDto } from './dto/admin-pagination.dto';
import { AdminUpdateUserStatusDto } from './dto/admin-update-user-status.dto';
export declare class AdminService {
    private userRepository;
    private profileRepository;
    private companyRepository;
    private jobOfferRepository;
    private applicationRepository;
    private interviewRepository;
    constructor(userRepository: Repository<User>, profileRepository: Repository<UserProfile>, companyRepository: Repository<Company>, jobOfferRepository: Repository<JobOffer>, applicationRepository: Repository<Application>, interviewRepository: Repository<Interview>);
    getDashboardStats(): Promise<AdminDashboardStatsDto>;
    getUsers(filters: AdminUserFilterDto, pagination: AdminPaginationDto): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCandidates(filters: AdminUserFilterDto, pagination: AdminPaginationDto): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRecruiters(filters: AdminUserFilterDto, pagination: AdminPaginationDto): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: string): Promise<User>;
    updateUserStatus(id: string, updateDto: AdminUpdateUserStatusDto): Promise<User>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    private createUserQueryBuilder;
}
