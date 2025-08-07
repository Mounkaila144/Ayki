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
import { Company } from './company.entity';
import { Application } from './application.entity';
import { JobOfferSkill } from './job-offer-skill.entity';
import { EmploymentType } from './experience.entity';

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

export enum RemotePolicy {
  ON_SITE = 'on_site',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  FLEXIBLE = 'flexible',
}

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.MID,
  })
  experienceLevel: ExperienceLevel;

  @Column({
    type: 'enum',
    enum: RemotePolicy,
    default: RemotePolicy.ON_SITE,
  })
  remotePolicy: RemotePolicy;

  @Column({ length: 50, nullable: true })
  salaryMin: string;

  @Column({ length: 50, nullable: true })
  salaryMax: string;

  @Column({ length: 20, nullable: true })
  currency: string;

  @Column({ length: 50, nullable: true })
  salaryPeriod: string;

  @Column({ type: 'boolean', default: false })
  salaryNegotiable: boolean;

  @Column({ type: 'int', default: 1 })
  positions: number;

  @Column({ type: 'date', nullable: true })
  applicationDeadline: Date;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ type: 'simple-array', nullable: true })
  benefits_list: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @Column({ type: 'boolean', default: false })
  isAdminPost: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.jobOffers, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  recruiter: User;

  @Column({ nullable: true })
  recruiterId: string;

  @ManyToOne(() => Company, (company) => company.jobOffers, { nullable: true })
  @JoinColumn()
  company: Company;

  @Column({ nullable: true })
  companyId: string;

  @OneToMany(() => Application, (application) => application.jobOffer)
  applications: Application[];

  @OneToMany(() => JobOfferSkill, (jobOfferSkill) => jobOfferSkill.jobOffer)
  requiredSkills: JobOfferSkill[];
}
