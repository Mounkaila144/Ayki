import { User } from './user.entity';
export declare enum DocumentType {
    CV = "cv",
    COVER_LETTER = "cover_letter",
    PORTFOLIO = "portfolio",
    CERTIFICATE = "certificate",
    DIPLOMA = "diploma",
    RECOMMENDATION = "recommendation",
    TRANSCRIPT = "transcript",
    ID_DOCUMENT = "id_document",
    AVATAR = "avatar",
    OTHER = "other"
}
export declare enum DocumentStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare class Document {
    id: string;
    name: string;
    originalName: string;
    type: DocumentType;
    mimeType: string;
    size: number;
    path: string;
    url: string;
    hash: string;
    status: DocumentStatus;
    description: string;
    tags: string[];
    metadata: Record<string, any>;
    isPublic: boolean;
    isMain: boolean;
    isActive: boolean;
    downloadCount: number;
    viewCount: number;
    expiresAt: Date;
    lastAccessedAt: Date;
    extractedText: string;
    extractedSkills: string[];
    analysisData: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
