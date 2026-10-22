import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '../../halls/entities/seat.entity';

export class Booking {
  @ApiProperty({
    format: 'uuid',
    example: '5e8f2a3b-7c4d-4b1e-a6f9-0d2c3b4a5e61',
    description: 'Ідентифікатор бронювання',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    example: 'c1a5e0b2-4d1f-4e7a-9c3b-2a8d6f0e1b77',
    description: 'Сеанс, на який зроблено бронювання',
  })
  showingId!: string;

  @ApiProperty({ type: [Seat], description: 'Заброньовані місця' })
  seats!: Seat[];

  @ApiProperty({
    example: 25000,
    description: 'Ціна сеансу × кількість місць, у копійках',
  })
  totalPrice!: number;

  @ApiProperty({
    example: '2026-10-22T11:00:00.000Z',
    description: 'Час створення бронювання (UTC)',
  })
  createdAt!: string;
}

/** An element of GET /showings/:id/seats. */
export class SeatStatus extends Seat {
  @ApiProperty({ example: false, description: 'Чи заброньоване місце' })
  isBooked!: boolean;
}
