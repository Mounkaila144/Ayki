import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from '../../entities/application.entity';
import { JobOffer } from '../../entities/job-offer.entity';
import { User } from '../../entities/user.entity';
export declare class ApplicationsService {
    private applicationRepository;
    private jobOfferRepository;
    private userRepository;
    constructor(applicationRepository: Repository<Application>, jobOfferRepository: Repository<JobOffer>, userRepository: Repository<User>);
    create(candidateId: string, createApplicationDto: any): Promise<Application | null>;
    findAll(): Promise<Application[]>;
    findOne(id: string): Promise<Application | null>;
    findByCandidate(candidateId: string): Promise<Application[]>;
    findByRecruiter(recruiterId: string): Promise<Application[]>;
    findByJobOffer(jobOfferId: string): Promise<Application[]>;
    update(id: string, updateApplicationDto: any): Promise<Application | null>;
    updateStatus(recruiterId: string, id: string, status: ApplicationStatus): Promise<Application | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
    withdraw(candidateId: string, id: string): Promise<Application | null>;
}
