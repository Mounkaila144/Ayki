import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getPublicProfile(slug: string): Promise<any>;
    getMyProfile(req: any): Promise<any>;
    updateMyProfile(req: any, updateData: any): Promise<import("../../entities").UserProfile>;
}
