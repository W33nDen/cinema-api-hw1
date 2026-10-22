import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { MAX_RELEASE_YEAR, MIN_RELEASE_YEAR } from './create-film.dto';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

/** Skips validation only when the field is absent; `null` is still a wrong type. */
const isPresent = (_: object, value: unknown) => value !== undefined;

/**
 * Any subset of the film fields. Written out instead of PartialType(CreateFilmDto)
 * because PartialType uses @IsOptional, which would let `null` through.
 */
export class UpdateFilmDto {
  @ApiPropertyOptional({
    example: 'Тіні забутих предків (реставрована версія)',
    description: 'Назва фільму',
    maxLength: 200,
  })
  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 99,
    description: 'Тривалість у хвилинах (ціле додатне число)',
    minimum: 1,
  })
  @ValidateIf(isPresent)
  @IsInt()
  @IsPositive()
  durationMinutes?: number;

  @ApiPropertyOptional({
    example: 1965,
    description: 'Рік виходу',
    minimum: MIN_RELEASE_YEAR,
    maximum: MAX_RELEASE_YEAR,
  })
  @ValidateIf(isPresent)
  @IsInt()
  @Min(MIN_RELEASE_YEAR)
  @Max(MAX_RELEASE_YEAR)
  releaseYear?: number;
}
