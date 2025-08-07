import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../../entities/user.entity';

export class AdminUpdateUserStatusDto {
  @ApiProperty({ 
    description: 'Nouveau statut de l\'utilisateur',
    enum: UserStatus 
  })
  @IsNotEmpty({ message: 'Le statut est requis' })
  @IsEnum(UserStatus, { message: 'Le statut doit être valide' })
  status: UserStatus;
}
