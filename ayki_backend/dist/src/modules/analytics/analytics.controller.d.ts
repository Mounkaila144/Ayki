import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    findAll(): Promise<import("../../entities").Analytics[]>;
    create(createAnalyticsDto: any): Promise<import("../../entities").Analytics[]>;
}
