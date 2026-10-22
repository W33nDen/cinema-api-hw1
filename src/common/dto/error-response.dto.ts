import { ApiProperty } from '@nestjs/swagger';

/** Shape of every error response (see HttpExceptionFilter). */
export class ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP-статус' })
  statusCode!: number;

  @ApiProperty({ example: 'Not Found', description: 'Назва помилки' })
  error!: string;

  @ApiProperty({
    description:
      'Причина помилки: рядок або масив рядків (для помилок валідації)',
    oneOf: [
      { type: 'string', example: 'Фільм з id … не знайдено' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['title must be a string'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: '/films/7d1c…', description: 'Шлях запиту' })
  path!: string;

  @ApiProperty({
    example: '2030-01-01T12:00:00.000Z',
    description: 'Час виникнення помилки (UTC)',
  })
  timestamp!: string;
}
