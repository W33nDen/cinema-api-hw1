import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

/** Sanity cap so that GET /halls/:id cannot produce millions of seats. */
export const MAX_ROWS = 1000;
export const MAX_SEATS_PER_ROW = 1000;

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateHallDto {
  @ApiProperty({
    example: 'Зал 1',
    description: 'Назва залу, унікальна серед залів (без урахування регістру)',
    maxLength: 100,
  })
  @Transform(trim)
  @IsString({ message: '$property має бути рядком' })
  @IsNotEmpty({ message: '$property не може бути порожнім' })
  @MaxLength(100, { message: '$property має бути не довшим за 100 символів' })
  name!: string;

  @ApiProperty({
    example: 3,
    description: 'Кількість рядів (ціле додатне число)',
    minimum: 1,
    maximum: MAX_ROWS,
  })
  @IsInt({ message: '$property має бути цілим числом' })
  @IsPositive({ message: '$property має бути додатним числом' })
  @Max(MAX_ROWS, { message: '$property має бути не більшим за $constraint1' })
  rows!: number;

  @ApiProperty({
    example: 5,
    description: 'Кількість місць у ряду (ціле додатне число)',
    minimum: 1,
    maximum: MAX_SEATS_PER_ROW,
  })
  @IsInt({ message: '$property має бути цілим числом' })
  @IsPositive({ message: '$property має бути додатним числом' })
  @Max(MAX_SEATS_PER_ROW, {
    message: '$property має бути не більшим за $constraint1',
  })
  seatsPerRow!: number;
}
