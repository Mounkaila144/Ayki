import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    create(createNotificationDto: any): Promise<Notification[]>;
    findAll(): Promise<Notification[]>;
    findOne(id: string): Promise<Notification | null>;
    markAsRead(id: string): Promise<Notification | null>;
    update(id: string, updateNotificationDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
