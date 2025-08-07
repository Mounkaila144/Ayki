import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AvailabilityStatus {
  IMMEDIATE = 'immediate',
  ONE_WEEK = 'one_week',
  TWO_WEEKS = 'two_weeks',
  ONE_MONTH = 'one_month',
  TWO_MONTHS = 'two_months',
  THREE_MONTHS = 'three_months',
  NOT_AVAILABLE = 'not_available',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 200, nullable: true })
  title: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 10, nullable: true })
  postalCode: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ length: 255, nullable: true })
  linkedin: string;

  @Column({ length: 255, nullable: true })
  github: string;

  @Column({ length: 255, nullable: true })
  portfolio: string;

  // Candidat specific fields
  @Column({ length: 50, nullable: true })
  salaryExpectation: string;

  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    nullable: true,
  })
  availability: AvailabilityStatus;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({ type: 'boolean', default: false })
  openToRemote: boolean;

  @Column({ type: 'boolean', default: false })
  openToRelocation: boolean;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ type: 'simple-array', nullable: true })
  interests: string[];

  // Profile completion and metrics
  @Column({ type: 'int', default: 0 })
  profileCompletion: number;

  @Column({ type: 'int', default: 0 })
  profileViews: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
