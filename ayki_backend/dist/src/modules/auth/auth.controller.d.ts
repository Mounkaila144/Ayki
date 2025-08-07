import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: {
            id: string;
            phone: string;
            userType: import("../../entities").UserType;
            status: import("../../entities").UserStatus;
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
            userType: import("../../entities").UserType;
            status: import("../../entities").UserStatus.ACTIVE;
            adminRole: import("../../entities").AdminRole;
            profile: import("../../entities").UserProfile;
            company: import("../../entities").Company;
        };
        token: string;
    }>;
    getProfile(req: any): Promise<any>;
    refreshToken(req: any): Promise<{
        token: string;
    }>;
}
