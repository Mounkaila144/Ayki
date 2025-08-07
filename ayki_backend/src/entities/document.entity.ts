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

export enum DocumentType {
  CV = 'cv',
  COVER_LETTER = 'cover_letter',
  PORTFOLIO = 'portfolio',
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  RECOMMENDATION = 'recommendation',
  TRANSCRIPT = 'transcript',
  ID_DOCUMENT = 'id_document',
  AVATAR = 'avatar',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  originalName: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.CV,
  })
  type: DocumentType;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'bigint', unsigned: true })
  size: number;

  @Column({ length: 500 })
  path: string;

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({ length: 100, nullable: true })
  hash: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'boolean', default: false })
  isMain: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  downloadCount: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'date', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt: Date;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @Column({ type: 'simple-array', nullable: true })
  extractedSkills: string[];

  @Column({ type: 'json', nullable: true })
  analysisData: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
