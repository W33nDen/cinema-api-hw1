import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats } from './entities/hall.entity';
import { HallsService } from './halls.service';

@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити зал' })
  @ApiCreatedResponse({ type: Hall, description: 'Зал створено' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Поле відсутнє, має неправильний тип, не є цілим додатним числом або зайве',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Зал з такою назвою вже існує',
  })
  create(@Body() createHallDto: CreateHallDto): Hall {
    return this.hallsService.create(createHallDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список залів' })
  @ApiOkResponse({ type: [Hall] })
  findAll(): Hall[] {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Зал за id разом зі списком місць' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: HallWithSeats })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Зал не знайдено',
  })
  findOne(@Param('id', parseUuidPipe) id: string): HallWithSeats {
    return this.hallsService.findOneWithSeats(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити зал' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Зал видалено, тіло порожнє' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Зал не знайдено',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'На зал посилається хоча б один сеанс',
  })
  remove(@Param('id', parseUuidPipe) id: string): void {
    this.hallsService.remove(id);
  }
}
