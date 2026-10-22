import { ApiProperty } from '@nestjs/swagger';

/** Shape of every error response (see HttpExceptionFilter). */
export class ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP-статус' })
  statusCode!: number;

  @ApiProperty({
    example: '2030-01-01T12:00:00.000Z',
    description: 'Час виникнення помилки (UTC)',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/films/3f0e7c1a-6b0e-4a43-9d36-0c9a8f2f4a11',
    description: 'Шлях запиту',
  })
  path!: string;

  @ApiProperty({
    description:
      'Причина помилки: рядок або масив рядків (для помилок валідації)',
    oneOf: [
      {
        type: 'string',
        example: 'Фільм з id 3f0e7c1a-6b0e-4a43-9d36-0c9a8f2f4a11 не знайдено',
      },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['title має бути рядком'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Not Found', description: 'Назва помилки' })
  error!: string;
}
