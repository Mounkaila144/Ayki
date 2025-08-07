import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AnalyticsType {
  PROFILE_VIEW = 'profile_view',
  JOB_VIEW = 'job_view',
  APPLICATION_SUBMITTED = 'application_submitted',
  SEARCH_PERFORMED = 'search_performed',
  DOCUMENT_DOWNLOADED = 'document_downloaded',
  BOOKMARK_ADDED = 'bookmark_added',
  MESSAGE_SENT = 'message_sent',
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTRATION = 'registration',
  PASSWORD_RESET = 'password_reset',
  PROFILE_UPDATED = 'profile_updated',
  SKILL_ADDED = 'skill_added',
  EXPERIENCE_ADDED = 'experience_added',
  EDUCATION_ADDED = 'education_added',
  OTHER = 'other',
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  OTHER = 'other',
}

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AnalyticsType,
  })
  type: AnalyticsType;

  @Column({ length: 255, nullable: true })
  action: string;

  @Column({ length: 255, nullable: true })
  category: string;

  @Column({ length: 255, nullable: true })
  label: string;

  @Column({ type: 'int', nullable: true })
  value: number;

  @Column({ type: 'json', nullable: true })
  properties: Record<string, any>;

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({ length: 500, nullable: true })
  referrer: string;

  @Column({ length: 255, nullable: true })
  userAgent: string;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    nullable: true,
  })
  deviceType: DeviceType;

  @Column({ length: 100, nullable: true })
  browser: string;

  @Column({ length: 100, nullable: true })
  os: string;

  @Column({ length: 100, nullable: true })
  sessionId: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // in seconds

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  userId: string;
}
