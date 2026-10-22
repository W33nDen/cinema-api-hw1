import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class SeatDto {
  @ApiProperty({ example: 1, minimum: 1, description: 'Номер ряду' })
  @IsInt()
  @IsPositive()
  row!: number;

  @ApiProperty({ example: 3, minimum: 1, description: 'Номер місця в ряду' })
  @IsInt()
  @IsPositive()
  seat!: number;
}
