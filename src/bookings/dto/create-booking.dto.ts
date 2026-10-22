import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { IsUniqueSeats } from '../../common/validators/is-unique-seats.validator';
import { SeatDto } from './seat.dto';

export class CreateBookingDto {
  @ApiProperty({
    type: [SeatDto],
    minItems: 1,
    description: 'Місця для бронювання: непорожній масив без повторів',
    example: [
      { row: 1, seat: 3 },
      { row: 1, seat: 4 },
    ],
  })
  @IsArray({ message: '$property має бути масивом' })
  @ArrayNotEmpty({ message: '$property має містити хоча б одне місце' })
  @ValidateNested({
    each: true,
    message: 'кожен елемент $property має бути об’єктом { row, seat }',
  })
  @Type(() => SeatDto)
  @IsUniqueSeats()
  seats!: SeatDto[];
}
