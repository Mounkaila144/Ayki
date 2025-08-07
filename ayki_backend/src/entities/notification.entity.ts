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

export enum NotificationType {
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_STATUS_CHANGED = 'application_status_changed',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEW_REMINDER = 'interview_reminder',
  INTERVIEW_CANCELLED = 'interview_cancelled',
  PROFILE_VIEWED = 'profile_viewed',
  NEW_JOB_MATCH = 'new_job_match',
  JOB_OFFER_EXPIRED = 'job_offer_expired',
  BOOKMARK_ADDED = 'bookmark_added',
  MESSAGE_RECEIVED = 'message_received',
  SYSTEM_UPDATE = 'system_update',
  ACCOUNT_SECURITY = 'account_security',
  PAYMENT_REMINDER = 'payment_reminder',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  OTHER = 'other',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>;

  @Column({ length: 500, nullable: true })
  actionUrl: string;

  @Column({ length: 100, nullable: true })
  actionText: string;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  sender: User;

  @Column({ nullable: true })
  senderId: string;
}
