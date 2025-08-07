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
import { Application } from './application.entity';

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  PANEL = 'panel',
  GROUP = 'group',
  FINAL = 'final',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: InterviewType,
    default: InterviewType.VIDEO,
  })
  type: InterviewType;

  @Column({
    type: 'enum',
    enum: InterviewStatus,
    default: InterviewStatus.SCHEDULED,
  })
  status: InterviewStatus;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'int', default: 60 })
  duration: number; // in minutes

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ length: 500, nullable: true })
  meetingLink: string;

  @Column({ length: 100, nullable: true })
  meetingId: string;

  @Column({ length: 100, nullable: true })
  meetingPassword: string;

  @Column({ type: 'simple-array', nullable: true })
  interviewers: string[];

  @Column({ type: 'text', nullable: true })
  agenda: string;

  @Column({ type: 'text', nullable: true })
  preparation: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'json', nullable: true })
  evaluation: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'boolean', default: false })
  isRecorded: boolean;

  @Column({ type: 'boolean', default: false })
  reminderSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.candidateInterviews, { onDelete: 'CASCADE' })
  @JoinColumn()
  candidate: User;

  @Column()
  candidateId: string;

  @ManyToOne(() => User, (user) => user.recruiterInterviews)
  @JoinColumn()
  recruiter: User;

  @Column()
  recruiterId: string;

  @ManyToOne(() => Application, (application) => application.interviews, { onDelete: 'CASCADE' })
  @JoinColumn()
  application: Application;

  @Column()
  applicationId: string;
}
