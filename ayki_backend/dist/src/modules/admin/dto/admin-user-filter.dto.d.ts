import { UserType, UserStatus } from '../../../entities/user.entity';
export declare class AdminUserFilterDto {
    userType?: UserType;
    status?: UserStatus;
    search?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    company?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
}
