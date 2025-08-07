import { UserType } from '../../../entities/user.entity';
export declare class SignUpDto {
    phone: string;
    password: string;
    userType: UserType;
    firstName: string;
    lastName: string;
    company?: string;
}
