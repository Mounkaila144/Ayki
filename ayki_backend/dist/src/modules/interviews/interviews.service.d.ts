import { Repository } from 'typeorm';
import { Interview } from '../../entities/interview.entity';
export declare class InterviewsService {
    private interviewRepository;
    constructor(interviewRepository: Repository<Interview>);
    create(createInterviewDto: any): Promise<Interview[]>;
    findAll(): Promise<Interview[]>;
    findOne(id: string): Promise<Interview | null>;
    update(id: string, updateInterviewDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
