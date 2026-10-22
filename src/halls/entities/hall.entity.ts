import { ApiProperty } from '@nestjs/swagger';
import { Seat } from './seat.entity';

export class Hall {
  @ApiProperty({
    example: '9b2d7c55-2f7e-4c11-8a5b-3c6f1d2e4b90',
    format: 'uuid',
    description: 'Ідентифікатор залу (генерує сервер)',
  })
  id!: string;

  @ApiProperty({ example: 'Зал 1', description: 'Назва (унікальна)' })
  name!: string;

  @ApiProperty({ example: 3, description: 'Кількість рядів' })
  rows!: number;

  @ApiProperty({ example: 5, description: 'Кількість місць у ряду' })
  seatsPerRow!: number;
}

/** GET /halls/:id response: the hall plus all its seats (rows × seatsPerRow). */
export class HallWithSeats extends Hall {
  @ApiProperty({
    type: [Seat],
    description: 'Усі місця залу, rows × seatsPerRow елементів',
  })
  seats!: Seat[];
}
