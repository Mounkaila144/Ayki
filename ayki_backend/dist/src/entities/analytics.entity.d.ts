import { User } from './user.entity';
export declare enum AnalyticsType {
    PROFILE_VIEW = "profile_view",
    JOB_VIEW = "job_view",
    APPLICATION_SUBMITTED = "application_submitted",
    SEARCH_PERFORMED = "search_performed",
    DOCUMENT_DOWNLOADED = "document_downloaded",
    BOOKMARK_ADDED = "bookmark_added",
    MESSAGE_SENT = "message_sent",
    LOGIN = "login",
    LOGOUT = "logout",
    REGISTRATION = "registration",
    PASSWORD_RESET = "password_reset",
    PROFILE_UPDATED = "profile_updated",
    SKILL_ADDED = "skill_added",
    EXPERIENCE_ADDED = "experience_added",
    EDUCATION_ADDED = "education_added",
    OTHER = "other"
}
export declare enum DeviceType {
    DESKTOP = "desktop",
    MOBILE = "mobile",
    TABLET = "tablet",
    OTHER = "other"
}
export declare class Analytics {
    id: string;
    type: AnalyticsType;
    action: string;
    category: string;
    label: string;
    value: number;
    properties: Record<string, any>;
    url: string;
    referrer: string;
    userAgent: string;
    ipAddress: string;
    country: string;
    city: string;
    deviceType: DeviceType;
    browser: string;
    os: string;
    sessionId: string;
    timestamp: Date;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
