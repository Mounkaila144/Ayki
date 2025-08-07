import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { JobOffer } from './job-offer.entity';

export enum CompanySize {
  STARTUP = '1-10',
  SMALL = '11-50',
  MEDIUM = '51-200',
  LARGE = '201-1000',
  ENTERPRISE = '1000+',
}

export enum CompanyType {
  STARTUP = 'startup',
  PRIVATE = 'private',
  PUBLIC = 'public',
  NON_PROFIT = 'non_profit',
  GOVERNMENT = 'government',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({
    type: 'enum',
    enum: CompanySize,
    nullable: true,
  })
  size: CompanySize;

  @Column({
    type: 'enum',
    enum: CompanyType,
    nullable: true,
  })
  type: CompanyType;

  @Column({ type: 'int', nullable: true })
  foundedYear: number;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 10, nullable: true })
  postalCode: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ length: 255, nullable: true })
  linkedin: string;

  @Column({ length: 255, nullable: true })
  twitter: string;

  @Column({ length: 255, nullable: true })
  facebook: string;

  @Column({ type: 'simple-array', nullable: true })
  benefits: string[];

  @Column({ type: 'simple-array', nullable: true })
  values: string[];

  @Column({ type: 'simple-array', nullable: true })
  technologies: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.company)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => JobOffer, (jobOffer) => jobOffer.company)
  jobOffers: JobOffer[];
}
