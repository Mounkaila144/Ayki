import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobOffer } from './job-offer.entity';
import { Skill } from './skill.entity';
import { SkillLevel } from './user-skill.entity';

export enum SkillImportance {
  REQUIRED = 'required',
  PREFERRED = 'preferred',
  NICE_TO_HAVE = 'nice_to_have',
}

@Entity('job_offer_skills')
export class JobOfferSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.INTERMEDIATE,
  })
  requiredLevel: SkillLevel;

  @Column({
    type: 'enum',
    enum: SkillImportance,
    default: SkillImportance.REQUIRED,
  })
  importance: SkillImportance;

  @Column({ type: 'int', default: 0 })
  minYearsExperience: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  weight: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => JobOffer, (jobOffer) => jobOffer.requiredSkills, { onDelete: 'CASCADE' })
  @JoinColumn()
  jobOffer: JobOffer;

  @Column()
  jobOfferId: string;

  @ManyToOne(() => Skill, (skill) => skill.jobOfferSkills, { onDelete: 'CASCADE' })
  @JoinColumn()
  skill: Skill;

  @Column()
  skillId: string;
}
