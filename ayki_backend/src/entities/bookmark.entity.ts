import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

export enum BookmarkType {
  CANDIDATE = 'candidate',
  JOB_OFFER = 'job_offer',
  COMPANY = 'company',
}

@Entity('bookmarks')
@Unique(['recruiterId', 'candidateId'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: BookmarkType,
    default: BookmarkType.CANDIDATE,
  })
  type: BookmarkType;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'boolean', default: false })
  isPrivate: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn()
  recruiter: User;

  @Column()
  recruiterId: string;

  @ManyToOne(() => User, (user) => user.bookmarkedBy, { onDelete: 'CASCADE' })
  @JoinColumn()
  candidate: User;

  @Column()
  candidateId: string;
}
