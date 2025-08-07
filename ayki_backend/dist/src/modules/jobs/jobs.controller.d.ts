import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(req: any, createJobDto: CreateJobDto): Promise<import("../../entities").JobOffer[]>;
    getMyJobs(req: any, query: any): Promise<{
        data: import("../../entities").JobOffer[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findAll(query: any): Promise<import("../../entities").JobOffer[]>;
    findOne(id: string): Promise<import("../../entities").JobOffer | null>;
    update(req: any, id: string, updateJobDto: UpdateJobDto): Promise<import("../../entities").JobOffer | null>;
    remove(req: any, id: string): Promise<import("typeorm").DeleteResult>;
}
