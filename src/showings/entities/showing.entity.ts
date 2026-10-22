import { ApiProperty } from '@nestjs/swagger';

/** A showing as stored by ShowingsService (references film and hall by id). */
export class Showing {
  @ApiProperty({
    format: 'uuid',
    example: 'c1a5e0b2-4d1f-4e7a-9c3b-2a8d6f0e1b77',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: '3f0e7c1a-6b0e-4a43-9d36-0c9a8f2f4a11',
  })
  filmId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '9b2d7c55-2f7e-4c11-8a5b-3c6f1d2e4b90',
  })
  hallId!: string;

  @ApiProperty({
    example: '2030-01-15T18:00:00.000Z',
    description: 'Початок сеансу, ISO 8601 в UTC',
  })
  startsAt!: string;

  @ApiProperty({ example: 12500, description: 'Ціна квитка в копійках' })
  price!: number;
}

/**
 * A showing as returned by the API: the film and the hall are given by name
 * instead of by id.
 */
export class ShowingView {
  @ApiProperty({
    format: 'uuid',
    example: 'c1a5e0b2-4d1f-4e7a-9c3b-2a8d6f0e1b77',
    description: 'Ідентифікатор сеансу',
  })
  id!: string;

  @ApiProperty({ example: 'Тіні забутих предків', description: 'Назва фільму' })
  filmTitle!: string;

  @ApiProperty({ example: 'Зал 1', description: 'Назва залу' })
  hallName!: string;

  @ApiProperty({
    example: '2030-01-15T18:00:00.000Z',
    description: 'Початок сеансу, ISO 8601 в UTC',
  })
  startsAt!: string;

  @ApiProperty({ example: 12500, description: 'Ціна квитка в копійках' })
  price!: number;
}
