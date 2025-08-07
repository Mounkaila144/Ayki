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

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  APPRENTICESHIP = 'apprenticeship',
}

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  company: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  responsibilities: string[];

  @Column({ type: 'simple-array', nullable: true })
  achievements: string[];

  @Column({ type: 'simple-array', nullable: true })
  technologies: string[];

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({ length: 50, nullable: true })
  salary: string;

  @Column({ type: 'int', default: 0 })
  teamSize: number;

  @Column({ type: 'boolean', default: false })
  isRemote: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.experiences, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
