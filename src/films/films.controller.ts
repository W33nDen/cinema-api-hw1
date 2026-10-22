import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { parseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
import { FilmsService } from './films.service';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити фільм' })
  @ApiCreatedResponse({ type: Film, description: 'Фільм створено' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Поле відсутнє, має неправильний тип або зайве',
  })
  create(@Body() createFilmDto: CreateFilmDto): Film {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список фільмів' })
  @ApiOkResponse({ type: [Film] })
  findAll(): Film[] {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Фільм за id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Film })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Фільм не знайдено',
  })
  findOne(@Param('id', parseUuidPipe) id: string): Film {
    return this.filmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити фільм (будь-яка підмножина полів)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Film, description: 'Оновлений фільм' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID або поле має неправильний тип',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Фільм не знайдено',
  })
  update(
    @Param('id', parseUuidPipe) id: string,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Film {
    return this.filmsService.update(id, updateFilmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити фільм' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Фільм видалено, тіло порожнє' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Фільм не знайдено',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'На фільм посилається хоча б один сеанс',
  })
  remove(@Param('id', parseUuidPipe) id: string): void {
    this.filmsService.remove(id);
  }
}
