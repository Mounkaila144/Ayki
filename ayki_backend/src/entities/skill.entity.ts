import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserSkill } from './user-skill.entity';
import { JobOfferSkill } from './job-offer-skill.entity';

export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  LANGUAGE = 'language',
  TOOL = 'tool',
  FRAMEWORK = 'framework',
  DATABASE = 'database',
  CLOUD = 'cloud',
  METHODOLOGY = 'methodology',
  DESIGN = 'design',
  MANAGEMENT = 'management',
  MARKETING = 'marketing',
  SALES = 'sales',
  OTHER = 'other',
}



@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SkillCategory,
    default: SkillCategory.OTHER,
  })
  category: SkillCategory;

  @Column({ length: 100, nullable: true })
  subcategory: string;

  @Column({ type: 'simple-array', nullable: true })
  aliases: string[];

  @Column({ type: 'simple-array', nullable: true })
  relatedSkills: string[];

  @Column({ nullable: true })
  icon: string;

  @Column({ length: 7, nullable: true })
  color: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'int', default: 0 })
  demandScore: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToMany(() => User, (user) => user.skills)
  users: User[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills: UserSkill[];

  @OneToMany(() => JobOfferSkill, (jobOfferSkill) => jobOfferSkill.skill)
  jobOfferSkills: JobOfferSkill[];
}
