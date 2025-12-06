import { PartnersService } from './partners.service';
export declare class PartnersController {
    private readonly partnersService;
    constructor(partnersService: PartnersService);
    create(logo: Express.Multer.File, body: any): Promise<import("../../entities").Partner>;
    findAll(): Promise<import("../../entities").Partner[]>;
    findAllActive(): Promise<import("../../entities").Partner[]>;
    findOne(id: string): Promise<import("../../entities").Partner>;
    update(id: string, logo: Express.Multer.File, body: any): Promise<import("../../entities").Partner>;
    remove(id: string): Promise<void>;
}
