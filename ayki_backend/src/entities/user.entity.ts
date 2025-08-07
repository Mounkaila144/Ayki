import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
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

export enum UserType {
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 15 })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: AdminRole,
    nullable: true,
  })
  adminRole: AdminRole;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  phoneVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => Company, (company) => company.user, { cascade: true })
  company: Company;

  @OneToMany(() => Experience, (experience) => experience.user, { cascade: true })
  experiences: Experience[];

  @OneToMany(() => Education, (education) => education.user, { cascade: true })
  educations: Education[];

  @ManyToMany(() => Skill, (skill) => skill.users)
  @JoinTable({
    name: 'user_skills',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => JobOffer, (jobOffer) => jobOffer.recruiter)
  jobOffers: JobOffer[];

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];

  @OneToMany(() => Application, (application) => application.recruiter)
  receivedApplications: Application[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.recruiter)
  bookmarks: Bookmark[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.candidate)
  bookmarkedBy: Bookmark[];

  @OneToMany(() => Interview, (interview) => interview.candidate)
  candidateInterviews: Interview[];

  @OneToMany(() => Interview, (interview) => interview.recruiter)
  recruiterInterviews: Interview[];

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
