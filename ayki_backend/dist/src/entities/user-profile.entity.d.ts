import { User } from './user.entity';
export declare enum AvailabilityStatus {
    IMMEDIATE = "immediate",
    ONE_WEEK = "one_week",
    TWO_WEEKS = "two_weeks",
    ONE_MONTH = "one_month",
    TWO_MONTHS = "two_months",
    THREE_MONTHS = "three_months",
    NOT_AVAILABLE = "not_available"
}
export declare class UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    location: string;
    summary: string;
    bio: string;
    avatar: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    website: string;
    linkedin: string;
    github: string;
    portfolio: string;
    salaryExpectation: string;
    availability: AvailabilityStatus;
    yearsOfExperience: number;
    openToRemote: boolean;
    openToRelocation: boolean;
    languages: string[];
    interests: string[];
    profileCompletion: number;
    profileViews: number;
    rating: number;
    ratingCount: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
