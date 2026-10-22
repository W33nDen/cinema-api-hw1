import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const MIN_RELEASE_YEAR = 1888;
export const MAX_RELEASE_YEAR = 2100;

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateFilmDto {
  @ApiProperty({
    example: 'Тіні забутих предків',
    description: 'Назва фільму',
    maxLength: 200,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 97,
    description: 'Тривалість у хвилинах (ціле додатне число)',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  durationMinutes!: number;

  @ApiProperty({
    example: 1965,
    description: 'Рік виходу',
    minimum: MIN_RELEASE_YEAR,
    maximum: MAX_RELEASE_YEAR,
  })
  @IsInt()
  @Min(MIN_RELEASE_YEAR)
  @Max(MAX_RELEASE_YEAR)
  releaseYear!: number;
}
