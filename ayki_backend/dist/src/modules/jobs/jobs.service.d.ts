import { Repository } from 'typeorm';
import { JobOffer } from '../../entities/job-offer.entity';
import { User } from '../../entities/user.entity';
export declare class JobsService {
    private jobOfferRepository;
    private userRepository;
    private readonly logger;
    constructor(jobOfferRepository: Repository<JobOffer>, userRepository: Repository<User>);
    create(recruiterId: string, createJobDto: any): Promise<JobOffer[]>;
    findByRecruiter(recruiterId: string, query?: any): Promise<{
        data: JobOffer[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findAll(query?: any): Promise<JobOffer[]>;
    findOne(id: string): Promise<JobOffer | null>;
    update(recruiterId: string, id: string, updateJobDto: any): Promise<JobOffer | null>;
    private validateAndCleanUpdateData;
    private validateFieldValue;
    remove(recruiterId: string, id: string): Promise<import("typeorm").DeleteResult>;
}
