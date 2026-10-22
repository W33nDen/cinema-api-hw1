import { ApiProperty } from '@nestjs/swagger';

/** A seat in a hall; identified by the (row, seat) pair, not stored separately. */
export class Seat {
  @ApiProperty({ example: 1, minimum: 1, description: 'Номер ряду' })
  row!: number;

  @ApiProperty({ example: 3, minimum: 1, description: 'Номер місця в ряду' })
  seat!: number;
}
