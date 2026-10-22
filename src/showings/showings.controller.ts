import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { parseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import { ShowingView } from './entities/showing.entity';
import { ShowingsService } from './showings.service';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(private readonly showingsService: ShowingsService) {}

  @Post()
  @ApiOperation({ summary: 'Запланувати сеанс' })
  @ApiCreatedResponse({ type: ShowingView, description: 'Сеанс створено' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Фільм або зал з таким id не існує; startsAt не ISO 8601 або в минулому; price не ціле додатне число; поле відсутнє або зайве',
  })
  create(@Body() createShowingDto: CreateShowingDto): ShowingView {
    return this.showingsService.create(createShowingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Розклад сеансів',
    description:
      'Фільтри filmId і date (YYYY-MM-DD, день за UTC) поєднуються через AND. Сортування за startsAt, при рівності — за id.',
  })
  @ApiOkResponse({ type: [ShowingView] })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'date не у форматі YYYY-MM-DD або filmId не UUID',
  })
  findAll(@Query() query: FindShowingsQueryDto): ShowingView[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Сеанс за id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ShowingView })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сеанс не знайдено',
  })
  findOne(@Param('id', parseUuidPipe) id: string): ShowingView {
    return this.showingsService.findOneView(id);
  }
}
