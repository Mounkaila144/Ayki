import { Repository } from 'typeorm';
import { Analytics } from '../../entities/analytics.entity';
export declare class AnalyticsService {
    private analyticsRepository;
    constructor(analyticsRepository: Repository<Analytics>);
    create(createAnalyticsDto: any): Promise<Analytics[]>;
    findAll(): Promise<Analytics[]>;
    findOne(id: string): Promise<Analytics | null>;
    update(id: string, updateAnalyticsDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
