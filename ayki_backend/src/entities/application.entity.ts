import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { JobOffer } from './job-offer.entity';
import { Interview } from './interview.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  SECOND_INTERVIEW = 'second_interview',
  FINAL_INTERVIEW = 'final_interview',
  REFERENCE_CHECK = 'reference_check',
  OFFER_MADE = 'offer_made',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_DECLINED = 'offer_declined',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  HIRED = 'hired',
}

export enum ApplicationSource {
  DIRECT = 'direct',
  REFERRAL = 'referral',
  LINKEDIN = 'linkedin',
  INDEED = 'indeed',
  GLASSDOOR = 'glassdoor',
  COMPANY_WEBSITE = 'company_website',
  JOB_BOARD = 'job_board',
  RECRUITER = 'recruiter',
  OTHER = 'other',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({
    type: 'enum',
    enum: ApplicationSource,
    default: ApplicationSource.DIRECT,
  })
  source: ApplicationSource;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  recruiterNotes: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  matchScore: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  recruiterRating: number;

  @Column({ type: 'text', nullable: true })
  recruiterFeedback: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  withdrawnAt: Date;

  @Column({ type: 'boolean', default: false })
  isStarred: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn()
  candidate: User;

  @Column()
  candidateId: string;

  @ManyToOne(() => User, (user) => user.receivedApplications)
  @JoinColumn()
  recruiter: User;

  @Column()
  recruiterId: string;

  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.applications, { onDelete: 'CASCADE' })
  @JoinColumn()
  jobOffer: JobOffer;

  @Column()
  jobOfferId: string;

  @OneToMany(() => Interview, (interview) => interview.application)
  interviews: Interview[];
}
