import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '../../../entities/user.entity';

export class SignUpDto {
  @ApiProperty({
    description: 'Numéro de téléphone du Niger',
    example: '90123456',
  })
  @IsNotEmpty({ message: 'Le numéro de téléphone est requis' })
  @IsString()
  @Matches(/^[9876]\d{7}$/, {
    message: 'Le numéro de téléphone doit être un numéro du Niger valide (8 chiffres commençant par 9, 8, 7, ou 6)',
  })
  phone: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'motdepasse123',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @ApiProperty({
    description: 'Type d\'utilisateur',
    enum: UserType,
    example: UserType.CANDIDATE,
  })
  @IsNotEmpty({ message: 'Le type d\'utilisateur est requis' })
  @IsEnum(UserType, { message: 'Le type d\'utilisateur doit être "candidate" ou "recruiter"' })
  userType: UserType;

  @ApiProperty({
    description: 'Prénom',
    example: 'Jean',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString()
  @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille',
    example: 'Dupont',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Le nom de famille est requis' })
  @IsString()
  @MaxLength(100, { message: 'Le nom de famille ne peut pas dépasser 100 caractères' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Nom de l\'entreprise (requis pour les recruteurs)',
    example: 'TechCorp',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères' })
  company?: string;
}
