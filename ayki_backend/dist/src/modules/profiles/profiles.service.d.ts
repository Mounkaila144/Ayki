import { Repository } from 'typeorm';
import { UserProfile } from '../../entities/user-profile.entity';
import { User } from '../../entities/user.entity';
export declare class ProfilesService {
    private profileRepository;
    private userRepository;
    constructor(profileRepository: Repository<UserProfile>, userRepository: Repository<User>);
    findByUserId(userId: string): Promise<any>;
    updateByUserId(userId: string, updateData: Partial<UserProfile>): Promise<UserProfile>;
    findBySlug(slug: string): Promise<any>;
    private generateSlug;
}
