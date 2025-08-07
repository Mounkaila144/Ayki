import { User } from './user.entity';
export declare enum DegreeLevel {
    HIGH_SCHOOL = "high_school",
    ASSOCIATE = "associate",
    BACHELOR = "bachelor",
    MASTER = "master",
    PHD = "phd",
    CERTIFICATE = "certificate",
    DIPLOMA = "diploma",
    PROFESSIONAL = "professional"
}
export declare enum EducationStatus {
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress",
    DROPPED_OUT = "dropped_out"
}
export declare class Education {
    id: string;
    degree: string;
    school: string;
    fieldOfStudy: string;
    level: DegreeLevel;
    status: EducationStatus;
    startDate: Date;
    endDate: Date;
    graduationYear: number;
    grade: string;
    gpa: number;
    maxGpa: number;
    location: string;
    description: string;
    activities: string[];
    honors: string[];
    coursework: string[];
    projects: string[];
    isOnline: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
