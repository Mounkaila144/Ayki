import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePartnerDto {
  @ApiProperty({
    description: 'Nom du partenaire',
    example: 'Google',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Ordre d\'affichage',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return 0;
    return parseInt(value, 10);
  })
  @IsInt()
  order?: number;

  @ApiPropertyOptional({
    description: 'Le partenaire est-il actif?',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  @IsBoolean()
  isActive?: boolean;
}
