import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, Matches } from 'class-validator';
import { IsCalendarDate } from '../../common/validators/is-calendar-date.validator';

export class FindShowingsQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Лише сеанси цього фільму',
  })
  @IsOptional()
  @IsUUID('all', { message: '$property має бути коректним UUID' })
  filmId?: string;

  @ApiPropertyOptional({
    example: '2030-01-15',
    description: 'Лише сеанси, що починаються цього дня (YYYY-MM-DD, за UTC)',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '$property має бути у форматі YYYY-MM-DD',
  })
  @IsCalendarDate()
  date?: string;
}
