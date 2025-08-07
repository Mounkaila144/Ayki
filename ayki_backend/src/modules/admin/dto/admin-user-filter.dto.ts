import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, UserStatus } from '../../../entities/user.entity';

export class AdminUserFilterDto {
  @ApiPropertyOptional({ 
    description: 'Filtrer par type d\'utilisateur',
    enum: UserType 
  })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @ApiPropertyOptional({ 
    description: 'Filtrer par statut',
    enum: UserStatus 
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Recherche par nom, prénom ou téléphone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrer par localisation' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Date de début pour filtrer par date d\'inscription' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Date de fin pour filtrer par date d\'inscription' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filtrer par entreprise (pour les recruteurs)' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Filtrer par vérification email' })
  @IsOptional()
  emailVerified?: boolean;

  @ApiPropertyOptional({ description: 'Filtrer par vérification téléphone' })
  @IsOptional()
  phoneVerified?: boolean;
}
