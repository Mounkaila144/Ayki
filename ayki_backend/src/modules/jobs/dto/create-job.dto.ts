import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsArray, IsDateString, IsInt, Min, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { JobStatus, ExperienceLevel, RemotePolicy } from '../../../entities/job-offer.entity';
import { EmploymentType } from '../../../entities/experience.entity';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsEnum(RemotePolicy)
  remotePolicy?: RemotePolicy;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value !== null && value !== undefined ? String(value) : value)
  salaryMin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value !== null && value !== undefined ? String(value) : value)
  salaryMax?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  salaryPeriod?: string;

  @IsOptional()
  @IsBoolean()
  salaryNegotiable?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  positions?: number;

  @IsOptional()
  @IsDateString()
  applicationDeadline?: Date;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits_list?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}
