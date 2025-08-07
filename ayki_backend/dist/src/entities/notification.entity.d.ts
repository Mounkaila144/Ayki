import { User } from './user.entity';
export declare enum NotificationType {
    APPLICATION_RECEIVED = "application_received",
    APPLICATION_STATUS_CHANGED = "application_status_changed",
    INTERVIEW_SCHEDULED = "interview_scheduled",
    INTERVIEW_REMINDER = "interview_reminder",
    INTERVIEW_CANCELLED = "interview_cancelled",
    PROFILE_VIEWED = "profile_viewed",
    NEW_JOB_MATCH = "new_job_match",
    JOB_OFFER_EXPIRED = "job_offer_expired",
    BOOKMARK_ADDED = "bookmark_added",
    MESSAGE_RECEIVED = "message_received",
    SYSTEM_UPDATE = "system_update",
    ACCOUNT_SECURITY = "account_security",
    PAYMENT_REMINDER = "payment_reminder",
    SUBSCRIPTION_EXPIRED = "subscription_expired",
    OTHER = "other"
}
export declare enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum NotificationChannel {
    IN_APP = "in_app",
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    priority: NotificationPriority;
    channel: NotificationChannel;
    data: Record<string, any>;
    actionUrl: string;
    actionText: string;
    icon: string;
    imageUrl: string;
    isRead: boolean;
    isArchived: boolean;
    readAt: Date;
    archivedAt: Date;
    scheduledAt: Date;
    sentAt: Date;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    sender: User;
    senderId: string;
}
