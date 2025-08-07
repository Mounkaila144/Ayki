// Export all entities
export { User, UserType, UserStatus, AdminRole } from './user.entity';
export { UserProfile, AvailabilityStatus } from './user-profile.entity';
export { Company, CompanySize, CompanyType } from './company.entity';
export { Experience, EmploymentType } from './experience.entity';
export { Education, DegreeLevel, EducationStatus } from './education.entity';
export { Skill, SkillCategory } from './skill.entity';
export { UserSkill, SkillLevel, EndorsementStatus } from './user-skill.entity';
export { JobOffer, JobStatus, ExperienceLevel, RemotePolicy } from './job-offer.entity';
export { JobOfferSkill, SkillImportance } from './job-offer-skill.entity';
export { Application, ApplicationStatus, ApplicationSource } from './application.entity';
export { Bookmark, BookmarkType } from './bookmark.entity';
export { Interview, InterviewType, InterviewStatus } from './interview.entity';
export { Document, DocumentType, DocumentStatus } from './document.entity';
export { Notification, NotificationType, NotificationPriority, NotificationChannel } from './notification.entity';
export { Analytics, AnalyticsType, DeviceType } from './analytics.entity';

// Import all entity classes
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Company } from './company.entity';
import { Experience } from './experience.entity';
import { Education } from './education.entity';
import { Skill } from './skill.entity';
import { UserSkill } from './user-skill.entity';
import { JobOffer } from './job-offer.entity';
import { JobOfferSkill } from './job-offer-skill.entity';
import { Application } from './application.entity';
import { Bookmark } from './bookmark.entity';
import { Interview } from './interview.entity';
import { Document } from './document.entity';
import { Notification } from './notification.entity';
import { Analytics } from './analytics.entity';

// Array of all entities for TypeORM configuration
export const entities = [
  User,
  UserProfile,
  Company,
  Experience,
  Education,
  Skill,
  UserSkill,
  JobOffer,
  JobOfferSkill,
  Application,
  Bookmark,
  Interview,
  Document,
  Notification,
  Analytics,
];
