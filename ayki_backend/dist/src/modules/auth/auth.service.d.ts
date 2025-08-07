import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserType, UserStatus } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';
import { Company } from '../../entities/company.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
export declare class AuthService {
    private userRepository;
    private profileRepository;
    private companyRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, profileRepository: Repository<UserProfile>, companyRepository: Repository<Company>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: {
            id: string;
            phone: string;
            userType: UserType;
            status: UserStatus;
            profile: {
                firstName: string;
                lastName: string;
            };
        };
        token: string;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        user: {
            id: string;
            phone: string;
            userType: UserType;
            status: UserStatus.ACTIVE;
            adminRole: import("../../entities/user.entity").AdminRole;
            profile: UserProfile;
            company: Company;
        };
        token: string;
    }>;
    validateUser(phone: string, password: string): Promise<any>;
    findUserById(id: string): Promise<User | null>;
    private calculateInitialCompletion;
    refreshToken(userId: string): Promise<{
        token: string;
    }>;
}
