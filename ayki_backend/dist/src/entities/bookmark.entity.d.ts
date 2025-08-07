import { User } from './user.entity';
export declare enum BookmarkType {
    CANDIDATE = "candidate",
    JOB_OFFER = "job_offer",
    COMPANY = "company"
}
export declare class Bookmark {
    id: string;
    type: BookmarkType;
    notes: string;
    tags: string[];
    priority: number;
    isPrivate: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    recruiter: User;
    recruiterId: string;
    candidate: User;
    candidateId: string;
}
