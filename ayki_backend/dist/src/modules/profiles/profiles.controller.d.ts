import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getMyProfile(req: any): Promise<import("../../entities").UserProfile>;
    updateMyProfile(req: any, updateData: any): Promise<import("../../entities").UserProfile>;
}
