import { UserProfile } from './user-profile.entity';
import { Company } from './company.entity';
import { Experience } from './experience.entity';
import { Education } from './education.entity';
import { Skill } from './skill.entity';
import { JobOffer } from './job-offer.entity';
import { Application } from './application.entity';
import { Bookmark } from './bookmark.entity';
import { Interview } from './interview.entity';
import { Document } from './document.entity';
import { Notification } from './notification.entity';
export declare enum UserType {
    CANDIDATE = "candidate",
    RECRUITER = "recruiter"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending"
}
export declare enum AdminRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    phone: string;
    password: string;
    userType: UserType;
    status: UserStatus;
    adminRole: AdminRole;
    lastLoginAt: Date;
    emailVerifiedAt: Date;
    phoneVerifiedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    profile: UserProfile;
    company: Company;
    experiences: Experience[];
    educations: Education[];
    skills: Skill[];
    jobOffers: JobOffer[];
    applications: Application[];
    receivedApplications: Application[];
    bookmarks: Bookmark[];
    bookmarkedBy: Bookmark[];
    candidateInterviews: Interview[];
    recruiterInterviews: Interview[];
    documents: Document[];
    notifications: Notification[];
}
