import { ApplicationsService } from './applications.service';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(req: any, createApplicationDto: any): Promise<import("../../entities").Application | null>;
    findAll(): Promise<import("../../entities").Application[]>;
    getMyApplications(req: any): Promise<import("../../entities").Application[]>;
    getReceivedApplications(req: any): Promise<import("../../entities").Application[]>;
    getJobApplications(jobId: string): Promise<import("../../entities").Application[]>;
    findOne(id: string): Promise<import("../../entities").Application | null>;
    update(id: string, updateApplicationDto: any): Promise<import("../../entities").Application | null>;
    updateStatus(req: any, id: string, body: {
        status: string;
    }): Promise<import("../../entities").Application | null>;
    withdraw(req: any, id: string): Promise<import("../../entities").Application | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
