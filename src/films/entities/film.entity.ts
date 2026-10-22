import { ApiProperty } from '@nestjs/swagger';

export class Film {
  @ApiProperty({
    example: '3f0e7c1a-6b0e-4a43-9d36-0c9a8f2f4a11',
    format: 'uuid',
    description: 'Ідентифікатор фільму (генерує сервер)',
  })
  id!: string;

  @ApiProperty({ example: 'Тіні забутих предків', description: 'Назва' })
  title!: string;

  @ApiProperty({ example: 97, description: 'Тривалість, хвилин' })
  durationMinutes!: number;

  @ApiProperty({ example: 1965, description: 'Рік виходу' })
  releaseYear!: number;
}
