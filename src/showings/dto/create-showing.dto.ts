import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsPositive, IsUUID, Matches } from 'class-validator';
import { IsFutureDateTime } from '../../common/validators/is-future-date-time.validator';

export class CreateShowingDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f0e7c1a-6b0e-4a43-9d36-0c9a8f2f4a11',
    description: 'id існуючого фільму',
  })
  @IsUUID('all', { message: '$property має бути коректним UUID' })
  filmId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '9b2d7c55-2f7e-4c11-8a5b-3c6f1d2e4b90',
    description: 'id існуючого залу',
  })
  @IsUUID('all', { message: '$property має бути коректним UUID' })
  hallId!: string;

  @ApiProperty({
    example: '2030-01-15T18:00:00Z',
    description:
      'Початок сеансу: дата й час ISO 8601, у майбутньому. Без зсуву часового поясу час вважається UTC',
  })
  @IsISO8601(
    { strict: true, strictSeparator: true },
    {
      message:
        '$property має бути коректною датою й часом у форматі ISO 8601, наприклад 2030-01-15T18:00:00Z',
    },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, {
    message: '$property має містити і дату, і час (YYYY-MM-DDTHH:mm)',
  })
  @IsFutureDateTime()
  startsAt!: string;

  @ApiProperty({
    example: 12500,
    description: 'Ціна квитка в копійках (ціле додатне число; 125 грн = 12500)',
    minimum: 1,
  })
  @IsInt({ message: '$property має бути цілим числом (копійки)' })
  @IsPositive({ message: '$property має бути додатним числом' })
  price!: number;
}
