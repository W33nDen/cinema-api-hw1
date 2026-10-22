import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, SeatStatus } from './entities/booking.entity';

/**
 * Routes that read or change bookings. The paths under /showings/:id live here
 * because they depend on booking state; BookingsModule depends on
 * ShowingsModule, not the other way round.
 */
@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'Усі бронювання' })
  @ApiOkResponse({ type: [Booking] })
  findAll(): Booking[] {
    return this.bookingsService.findAll();
  }

  @Get('showings/:id/seats')
  @ApiTags('showings')
  @ApiOperation({ summary: 'Схема залу для сеансу: усі місця та їхній стан' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'id сеансу' })
  @ApiOkResponse({ type: [SeatStatus] })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сеанс не знайдено',
  })
  getSeats(@Param('id', ParseUUIDPipe) id: string): SeatStatus[] {
    return this.bookingsService.getSeatMap(id);
  }

  @Post('showings/:id/bookings')
  @ApiOperation({ summary: 'Забронювати одне або кілька місць на сеанс' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'id сеансу' })
  @ApiCreatedResponse({ type: Booking, description: 'Бронювання створено' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'seats порожній; елемент без row або seat; місце повторюється; місця немає в залі; id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сеанс не знайдено',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description:
      'Хоча б одне місце вже заброньоване; жодне місце з запиту не бронюється',
  })
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createBookingDto: CreateBookingDto,
  ): Booking {
    return this.bookingsService.create(id, createBookingDto);
  }

  @Get('showings/:id/bookings')
  @ApiOperation({ summary: 'Бронювання сеансу' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'id сеансу' })
  @ApiOkResponse({ type: [Booking] })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сеанс не знайдено',
  })
  findByShowing(@Param('id', ParseUUIDPipe) id: string): Booking[] {
    return this.bookingsService.findByShowing(id);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Скасувати бронювання (звільняє місця)' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'id бронювання' })
  @ApiNoContentResponse({ description: 'Бронювання скасовано, тіло порожнє' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'id не є UUID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Бронювання не знайдено',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.bookingsService.remove(id);
  }
}
