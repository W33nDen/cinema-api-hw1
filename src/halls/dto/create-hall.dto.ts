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

export const MAX_ROWS = 100;
export const MAX_SEATS_PER_ROW = 100;

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateHallDto {
  @ApiProperty({
    example: 'Зал 1',
    description: 'Назва залу, унікальна серед залів (без урахування регістру)',
    maxLength: 100,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 3,
    description: 'Кількість рядів (ціле додатне число)',
    minimum: 1,
    maximum: MAX_ROWS,
  })
  @IsInt()
  @IsPositive()
  @Max(MAX_ROWS)
  rows!: number;

  @ApiProperty({
    example: 5,
    description: 'Кількість місць у ряду (ціле додатне число)',
    minimum: 1,
    maximum: MAX_SEATS_PER_ROW,
  })
  @IsInt()
  @IsPositive()
  @Max(MAX_SEATS_PER_ROW)
  seatsPerRow!: number;
}
