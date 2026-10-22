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

/** Year of the first public film screening. */
export const MIN_RELEASE_YEAR = 1888;
/** Announced films may have a release year a few years ahead. */
export const MAX_RELEASE_YEAR = new Date().getFullYear() + 10;

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateFilmDto {
  @ApiProperty({
    example: 'Тіні забутих предків',
    description: 'Назва фільму',
    maxLength: 200,
  })
  @Transform(trim)
  @IsString({ message: '$property має бути рядком' })
  @IsNotEmpty({ message: '$property не може бути порожнім' })
  @MaxLength(200, { message: '$property має бути не довшим за 200 символів' })
  title!: string;

  @ApiProperty({
    example: 97,
    description: 'Тривалість у хвилинах (ціле додатне число)',
    minimum: 1,
  })
  @IsInt({ message: '$property має бути цілим числом' })
  @IsPositive({ message: '$property має бути додатним числом' })
  durationMinutes!: number;

  @ApiProperty({
    example: 1965,
    description: `Рік виходу (ціле число від ${MIN_RELEASE_YEAR} до поточного року + 10)`,
    minimum: MIN_RELEASE_YEAR,
    maximum: MAX_RELEASE_YEAR,
  })
  @IsInt({ message: '$property має бути цілим числом' })
  @Min(MIN_RELEASE_YEAR, {
    message: '$property має бути не меншим за $constraint1',
  })
  @Max(MAX_RELEASE_YEAR, {
    message: '$property має бути не більшим за $constraint1',
  })
  releaseYear!: number;
}
