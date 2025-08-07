import { User } from './user.entity';
import { JobOffer } from './job-offer.entity';
import { Interview } from './interview.entity';
export declare enum ApplicationStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    SHORTLISTED = "shortlisted",
    INTERVIEW_SCHEDULED = "interview_scheduled",
    INTERVIEWED = "interviewed",
    SECOND_INTERVIEW = "second_interview",
    FINAL_INTERVIEW = "final_interview",
    REFERENCE_CHECK = "reference_check",
    OFFER_MADE = "offer_made",
    OFFER_ACCEPTED = "offer_accepted",
    OFFER_DECLINED = "offer_declined",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn",
    HIRED = "hired"
}
export declare enum ApplicationSource {
    DIRECT = "direct",
    REFERRAL = "referral",
    LINKEDIN = "linkedin",
    INDEED = "indeed",
    GLASSDOOR = "glassdoor",
    COMPANY_WEBSITE = "company_website",
    JOB_BOARD = "job_board",
    RECRUITER = "recruiter",
    OTHER = "other"
}
export declare class Application {
    id: string;
    status: ApplicationStatus;
    source: ApplicationSource;
    coverLetter: string;
    message: string;
    notes: string;
    recruiterNotes: string;
    matchScore: number;
    recruiterRating: number;
    recruiterFeedback: string;
    attachments: string[];
    customFields: Record<string, any>;
    reviewedAt: Date;
    respondedAt: Date;
    rejectedAt: Date;
    withdrawnAt: Date;
    isStarred: boolean;
    isArchived: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    candidate: User;
    candidateId: string;
    recruiter: User;
    recruiterId: string;
    jobOffer: JobOffer;
    jobOfferId: string;
    interviews: Interview[];
}
