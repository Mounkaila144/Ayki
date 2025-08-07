import { IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../../entities/user.entity';

export class SignInDto {
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


}
