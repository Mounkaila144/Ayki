import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsNumberString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class AdminPaginationDto {
  @ApiPropertyOptional({
    description: 'Numéro de page (commence à 1)',
    minimum: 1,
    default: 1,
    type: 'number'
  })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 1)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments par page',
    minimum: 1,
    maximum: 100,
    default: 10,
    type: 'number'
  })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 10)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Champ pour le tri',
    default: 'createdAt',
    type: 'string'
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Ordre de tri',
    enum: SortOrder,
    default: SortOrder.DESC,
    type: 'string'
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
