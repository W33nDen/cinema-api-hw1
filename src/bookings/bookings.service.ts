import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { HallsService } from '../halls/halls.service';
import { Seat } from '../halls/entities/seat.entity';
import { ShowingsService } from '../showings/showings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, SeatStatus } from './entities/booking.entity';

const seatKey = (seat: Seat) => `${seat.row}:${seat.seat}`;
const seatLabel = (seat: Seat) => `ряд ${seat.row}, місце ${seat.seat}`;

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  findAll(): Booking[] {
    return this.bookings;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.findOne(showingId);
    return this.bookings.filter((booking) => booking.showingId === showingId);
  }

  /**
   * Books all requested seats or none of them. All checks run before the
   * single push, and the method is synchronous, so no other request can
   * interleave: a 400/409 never leaves a partial booking behind.
   */
  create(showingId: string, createBookingDto: CreateBookingDto): Booking {
    const showing = this.showingsService.findOne(showingId);
    const hall = this.hallsService.findOne(showing.hallId);
    const seats: Seat[] = createBookingDto.seats.map(({ row, seat }) => ({
      row,
      seat,
    }));

    const outside = seats.filter(
      (seat) => !this.hallsService.hasSeat(hall, seat),
    );
    if (outside.length > 0) {
      throw new BadRequestException(
        `Місць немає в залі "${hall.name}" (${hall.rows} рядів × ${hall.seatsPerRow} місць): ${outside.map(seatLabel).join('; ')}`,
      );
    }

    const booked = this.getBookedSeatKeys(showingId);
    const taken = seats.filter((seat) => booked.has(seatKey(seat)));
    if (taken.length > 0) {
      throw new ConflictException(
        `Місця вже заброньовані: ${taken.map(seatLabel).join('; ')}`,
      );
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats,
      totalPrice: showing.price * seats.length,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(booking);
    return booking;
  }

  /** Every seat of the showing's hall with its booking state. */
  getSeatMap(showingId: string): SeatStatus[] {
    const showing = this.showingsService.findOne(showingId);
    const hall = this.hallsService.findOne(showing.hallId);
    const booked = this.getBookedSeatKeys(showingId);
    return this.hallsService.getSeats(hall).map((seat) => ({
      ...seat,
      isBooked: booked.has(seatKey(seat)),
    }));
  }

  /** Cancels a booking; its seats become free again. */
  remove(id: string): void {
    const exists = this.bookings.some((booking) => booking.id === id);
    if (!exists) {
      throw new NotFoundException(`Бронювання з id ${id} не знайдено`);
    }
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
  }

  private getBookedSeatKeys(showingId: string): Set<string> {
    return new Set(
      this.bookings
        .filter((booking) => booking.showingId === showingId)
        .flatMap((booking) => booking.seats.map(seatKey)),
    );
  }
}
