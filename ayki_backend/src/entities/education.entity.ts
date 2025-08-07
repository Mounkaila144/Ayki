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

export enum DegreeLevel {
  HIGH_SCHOOL = 'high_school',
  ASSOCIATE = 'associate',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  PROFESSIONAL = 'professional',
}

export enum EducationStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  DROPPED_OUT = 'dropped_out',
}

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  degree: string;

  @Column({ length: 200 })
  school: string;

  @Column({ length: 200, nullable: true })
  fieldOfStudy: string;

  @Column({
    type: 'enum',
    enum: DegreeLevel,
  })
  level: DegreeLevel;

  @Column({
    type: 'enum',
    enum: EducationStatus,
    default: EducationStatus.COMPLETED,
  })
  status: EducationStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'int', nullable: true })
  graduationYear: number;

  @Column({ length: 10, nullable: true })
  grade: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  gpa: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  maxGpa: number;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  activities: string[];

  @Column({ type: 'simple-array', nullable: true })
  honors: string[];

  @Column({ type: 'simple-array', nullable: true })
  coursework: string[];

  @Column({ type: 'simple-array', nullable: true })
  projects: string[];

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.educations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
