import { InterviewsService } from './interviews.service';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    create(createInterviewDto: any): Promise<import("../../entities").Interview[]>;
    findAll(): Promise<import("../../entities").Interview[]>;
    findOne(id: string): Promise<import("../../entities").Interview | null>;
    update(id: string, updateInterviewDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
