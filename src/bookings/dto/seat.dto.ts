import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class SeatDto {
  @ApiProperty({ example: 1, minimum: 1, description: 'Номер ряду' })
  @IsInt({ message: '$property має бути цілим числом' })
  @IsPositive({ message: '$property має бути додатним числом' })
  row!: number;

  @ApiProperty({ example: 3, minimum: 1, description: 'Номер місця в ряду' })
  @IsInt({ message: '$property має бути цілим числом' })
  @IsPositive({ message: '$property має бути додатним числом' })
  seat!: number;
}
