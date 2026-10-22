import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FilmsModule } from '../films/films.module';
import { FilmsService } from '../films/films.service';
import { HallsModule } from '../halls/halls.module';
import { HallsService } from '../halls/halls.service';
import { ShowingsModule } from '../showings/showings.module';
import { ShowingsService } from '../showings/showings.service';
import { BookingsModule } from './bookings.module';
import { BookingsService } from './bookings.service';

describe('BookingsService', () => {
  let bookings: BookingsService;
  let showingId: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FilmsModule, HallsModule, ShowingsModule, BookingsModule],
    }).compile();

    const film = moduleRef
      .get(FilmsService)
      .create({ title: 'Земля', durationMinutes: 75, releaseYear: 1930 });
    const hall = moduleRef
      .get(HallsService)
      .create({ name: 'Зал 1', rows: 3, seatsPerRow: 5 });
    showingId = moduleRef.get(ShowingsService).create({
      filmId: film.id,
      hallId: hall.id,
      startsAt: '2030-01-15T18:00:00Z',
      price: 12500,
    }).id;
    bookings = moduleRef.get(BookingsService);
  });

  it('computes totalPrice as price × seats', () => {
    const booking = bookings.create(showingId, {
      seats: [
        { row: 1, seat: 1 },
        { row: 1, seat: 2 },
      ],
    });
    expect(booking.totalPrice).toBe(25000);
  });

  it('rejects seats outside the hall', () => {
    expect(() =>
      bookings.create(showingId, { seats: [{ row: 4, seat: 1 }] }),
    ).toThrow(BadRequestException);
  });

  it('is atomic: a taken seat books nothing', () => {
    bookings.create(showingId, { seats: [{ row: 1, seat: 2 }] });
    expect(() =>
      bookings.create(showingId, {
        seats: [
          { row: 1, seat: 3 },
          { row: 1, seat: 2 },
        ],
      }),
    ).toThrow(ConflictException);
    const seat13 = bookings
      .getSeatMap(showingId)
      .find((s) => s.row === 1 && s.seat === 3);
    expect(seat13?.isBooked).toBe(false);
  });

  it('frees seats when a booking is cancelled', () => {
    const booking = bookings.create(showingId, {
      seats: [{ row: 2, seat: 2 }],
    });
    bookings.remove(booking.id);
    expect(bookings.getSeatMap(showingId).every((s) => !s.isBooked)).toBe(true);
    expect(bookings.getSeatMap(showingId)).toHaveLength(15);
  });
});
