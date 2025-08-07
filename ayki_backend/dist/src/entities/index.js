"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = exports.DeviceType = exports.AnalyticsType = exports.Analytics = exports.NotificationChannel = exports.NotificationPriority = exports.NotificationType = exports.Notification = exports.DocumentStatus = exports.DocumentType = exports.Document = exports.InterviewStatus = exports.InterviewType = exports.Interview = exports.BookmarkType = exports.Bookmark = exports.ApplicationSource = exports.ApplicationStatus = exports.Application = exports.SkillImportance = exports.JobOfferSkill = exports.RemotePolicy = exports.ExperienceLevel = exports.JobStatus = exports.JobOffer = exports.EndorsementStatus = exports.SkillLevel = exports.UserSkill = exports.SkillCategory = exports.Skill = exports.EducationStatus = exports.DegreeLevel = exports.Education = exports.EmploymentType = exports.Experience = exports.CompanyType = exports.CompanySize = exports.Company = exports.AvailabilityStatus = exports.UserProfile = exports.AdminRole = exports.UserStatus = exports.UserType = exports.User = void 0;
var user_entity_1 = require("./user.entity");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_entity_1.User; } });
Object.defineProperty(exports, "UserType", { enumerable: true, get: function () { return user_entity_1.UserType; } });
Object.defineProperty(exports, "UserStatus", { enumerable: true, get: function () { return user_entity_1.UserStatus; } });
Object.defineProperty(exports, "AdminRole", { enumerable: true, get: function () { return user_entity_1.AdminRole; } });
var user_profile_entity_1 = require("./user-profile.entity");
Object.defineProperty(exports, "UserProfile", { enumerable: true, get: function () { return user_profile_entity_1.UserProfile; } });
Object.defineProperty(exports, "AvailabilityStatus", { enumerable: true, get: function () { return user_profile_entity_1.AvailabilityStatus; } });
var company_entity_1 = require("./company.entity");
Object.defineProperty(exports, "Company", { enumerable: true, get: function () { return company_entity_1.Company; } });
Object.defineProperty(exports, "CompanySize", { enumerable: true, get: function () { return company_entity_1.CompanySize; } });
Object.defineProperty(exports, "CompanyType", { enumerable: true, get: function () { return company_entity_1.CompanyType; } });
var experience_entity_1 = require("./experience.entity");
Object.defineProperty(exports, "Experience", { enumerable: true, get: function () { return experience_entity_1.Experience; } });
Object.defineProperty(exports, "EmploymentType", { enumerable: true, get: function () { return experience_entity_1.EmploymentType; } });
var education_entity_1 = require("./education.entity");
Object.defineProperty(exports, "Education", { enumerable: true, get: function () { return education_entity_1.Education; } });
Object.defineProperty(exports, "DegreeLevel", { enumerable: true, get: function () { return education_entity_1.DegreeLevel; } });
Object.defineProperty(exports, "EducationStatus", { enumerable: true, get: function () { return education_entity_1.EducationStatus; } });
var skill_entity_1 = require("./skill.entity");
Object.defineProperty(exports, "Skill", { enumerable: true, get: function () { return skill_entity_1.Skill; } });
Object.defineProperty(exports, "SkillCategory", { enumerable: true, get: function () { return skill_entity_1.SkillCategory; } });
var user_skill_entity_1 = require("./user-skill.entity");
Object.defineProperty(exports, "UserSkill", { enumerable: true, get: function () { return user_skill_entity_1.UserSkill; } });
Object.defineProperty(exports, "SkillLevel", { enumerable: true, get: function () { return user_skill_entity_1.SkillLevel; } });
Object.defineProperty(exports, "EndorsementStatus", { enumerable: true, get: function () { return user_skill_entity_1.EndorsementStatus; } });
var job_offer_entity_1 = require("./job-offer.entity");
Object.defineProperty(exports, "JobOffer", { enumerable: true, get: function () { return job_offer_entity_1.JobOffer; } });
Object.defineProperty(exports, "JobStatus", { enumerable: true, get: function () { return job_offer_entity_1.JobStatus; } });
Object.defineProperty(exports, "ExperienceLevel", { enumerable: true, get: function () { return job_offer_entity_1.ExperienceLevel; } });
Object.defineProperty(exports, "RemotePolicy", { enumerable: true, get: function () { return job_offer_entity_1.RemotePolicy; } });
var job_offer_skill_entity_1 = require("./job-offer-skill.entity");
Object.defineProperty(exports, "JobOfferSkill", { enumerable: true, get: function () { return job_offer_skill_entity_1.JobOfferSkill; } });
Object.defineProperty(exports, "SkillImportance", { enumerable: true, get: function () { return job_offer_skill_entity_1.SkillImportance; } });
var application_entity_1 = require("./application.entity");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return application_entity_1.Application; } });
Object.defineProperty(exports, "ApplicationStatus", { enumerable: true, get: function () { return application_entity_1.ApplicationStatus; } });
Object.defineProperty(exports, "ApplicationSource", { enumerable: true, get: function () { return application_entity_1.ApplicationSource; } });
var bookmark_entity_1 = require("./bookmark.entity");
Object.defineProperty(exports, "Bookmark", { enumerable: true, get: function () { return bookmark_entity_1.Bookmark; } });
Object.defineProperty(exports, "BookmarkType", { enumerable: true, get: function () { return bookmark_entity_1.BookmarkType; } });
var interview_entity_1 = require("./interview.entity");
Object.defineProperty(exports, "Interview", { enumerable: true, get: function () { return interview_entity_1.Interview; } });
Object.defineProperty(exports, "InterviewType", { enumerable: true, get: function () { return interview_entity_1.InterviewType; } });
Object.defineProperty(exports, "InterviewStatus", { enumerable: true, get: function () { return interview_entity_1.InterviewStatus; } });
var document_entity_1 = require("./document.entity");
Object.defineProperty(exports, "Document", { enumerable: true, get: function () { return document_entity_1.Document; } });
Object.defineProperty(exports, "DocumentType", { enumerable: true, get: function () { return document_entity_1.DocumentType; } });
Object.defineProperty(exports, "DocumentStatus", { enumerable: true, get: function () { return document_entity_1.DocumentStatus; } });
var notification_entity_1 = require("./notification.entity");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_entity_1.Notification; } });
Object.defineProperty(exports, "NotificationType", { enumerable: true, get: function () { return notification_entity_1.NotificationType; } });
Object.defineProperty(exports, "NotificationPriority", { enumerable: true, get: function () { return notification_entity_1.NotificationPriority; } });
Object.defineProperty(exports, "NotificationChannel", { enumerable: true, get: function () { return notification_entity_1.NotificationChannel; } });
var analytics_entity_1 = require("./analytics.entity");
Object.defineProperty(exports, "Analytics", { enumerable: true, get: function () { return analytics_entity_1.Analytics; } });
Object.defineProperty(exports, "AnalyticsType", { enumerable: true, get: function () { return analytics_entity_1.AnalyticsType; } });
Object.defineProperty(exports, "DeviceType", { enumerable: true, get: function () { return analytics_entity_1.DeviceType; } });
const user_entity_2 = require("./user.entity");
const user_profile_entity_2 = require("./user-profile.entity");
const company_entity_2 = require("./company.entity");
const experience_entity_2 = require("./experience.entity");
const education_entity_2 = require("./education.entity");
const skill_entity_2 = require("./skill.entity");
const user_skill_entity_2 = require("./user-skill.entity");
const job_offer_entity_2 = require("./job-offer.entity");
const job_offer_skill_entity_2 = require("./job-offer-skill.entity");
const application_entity_2 = require("./application.entity");
const bookmark_entity_2 = require("./bookmark.entity");
const interview_entity_2 = require("./interview.entity");
const document_entity_2 = require("./document.entity");
const notification_entity_2 = require("./notification.entity");
const analytics_entity_2 = require("./analytics.entity");
exports.entities = [
    user_entity_2.User,
    user_profile_entity_2.UserProfile,
    company_entity_2.Company,
    experience_entity_2.Experience,
    education_entity_2.Education,
    skill_entity_2.Skill,
    user_skill_entity_2.UserSkill,
    job_offer_entity_2.JobOffer,
    job_offer_skill_entity_2.JobOfferSkill,
    application_entity_2.Application,
    bookmark_entity_2.Bookmark,
    interview_entity_2.Interview,
    document_entity_2.Document,
    notification_entity_2.Notification,
    analytics_entity_2.Analytics,
];
//# sourceMappingURL=index.js.map