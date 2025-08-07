import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: any): Promise<import("../../entities").Notification[]>;
    findAll(): Promise<import("../../entities").Notification[]>;
    findOne(id: string): Promise<import("../../entities").Notification | null>;
    markAsRead(id: string): Promise<import("../../entities").Notification | null>;
    update(id: string, updateNotificationDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
