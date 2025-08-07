import { User } from './user.entity';
import { Application } from './application.entity';
export declare enum InterviewType {
    PHONE = "phone",
    VIDEO = "video",
    IN_PERSON = "in_person",
    TECHNICAL = "technical",
    BEHAVIORAL = "behavioral",
    PANEL = "panel",
    GROUP = "group",
    FINAL = "final"
}
export declare enum InterviewStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESCHEDULED = "rescheduled",
    NO_SHOW = "no_show"
}
export declare class Interview {
    id: string;
    title: string;
    description: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledAt: Date;
    duration: number;
    location: string;
    meetingLink: string;
    meetingId: string;
    meetingPassword: string;
    interviewers: string[];
    agenda: string;
    preparation: string;
    notes: string;
    feedback: string;
    rating: number;
    evaluation: Record<string, any>;
    attachments: string[];
    startedAt: Date;
    endedAt: Date;
    confirmedAt: Date;
    cancelledAt: Date;
    cancellationReason: string;
    isRecorded: boolean;
    reminderSent: boolean;
    createdAt: Date;
    updatedAt: Date;
    candidate: User;
    candidateId: string;
    recruiter: User;
    recruiterId: string;
    application: Application;
    applicationId: string;
}
