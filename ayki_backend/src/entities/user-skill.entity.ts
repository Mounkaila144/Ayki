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
import { Skill } from './skill.entity';

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum EndorsementStatus {
  SELF_ASSESSED = 'self_assessed',
  PEER_ENDORSED = 'peer_endorsed',
  MANAGER_ENDORSED = 'manager_endorsed',
  CERTIFIED = 'certified',
  TESTED = 'tested',
}

@Entity('user_skills')
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.BEGINNER,
  })
  level: SkillLevel;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({ type: 'int', default: 0 })
  monthsOfExperience: number;

  @Column({
    type: 'enum',
    enum: EndorsementStatus,
    default: EndorsementStatus.SELF_ASSESSED,
  })
  endorsementStatus: EndorsementStatus;

  @Column({ type: 'int', default: 0 })
  endorsementCount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  projects: string[];

  @Column({ type: 'simple-array', nullable: true })
  certifications: string[];

  @Column({ type: 'date', nullable: true })
  lastUsedDate: Date;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.skills, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, { onDelete: 'CASCADE' })
  @JoinColumn()
  skill: Skill;

  @Column()
  skillId: string;
}
