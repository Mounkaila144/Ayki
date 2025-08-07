import { Repository } from 'typeorm';
import { UserProfile } from '../../entities/user-profile.entity';
export declare class ProfilesService {
    private profileRepository;
    constructor(profileRepository: Repository<UserProfile>);
    findByUserId(userId: string): Promise<UserProfile>;
    updateByUserId(userId: string, updateData: Partial<UserProfile>): Promise<UserProfile>;
}
