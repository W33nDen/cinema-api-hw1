import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { Hall, HallWithSeats } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';

@Injectable()
export class HallsService {
  private halls: Hall[] = [];

  constructor(
    // Circular dependency: showings need halls, deleting a hall needs showings.
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(createHallDto: CreateHallDto): Hall {
    const name = createHallDto.name;
    const taken = this.halls.some(
      (hall) => hall.name.toLowerCase() === name.toLowerCase(),
    );
    if (taken) {
      throw new ConflictException(`Зал з назвою "${name}" вже існує`);
    }
    const hall: Hall = {
      id: randomUUID(),
      name,
      rows: createHallDto.rows,
      seatsPerRow: createHallDto.seatsPerRow,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return this.halls;
  }

  /** Returns the hall or undefined; for other modules that pick their own status code. */
  findById(id: string): Hall | undefined {
    return this.halls.find((hall) => hall.id === id);
  }

  findOne(id: string): Hall {
    const hall = this.findById(id);
    if (!hall) {
      throw new NotFoundException(`Зал з id ${id} не знайдено`);
    }
    return hall;
  }

  findOneWithSeats(id: string): HallWithSeats {
    const hall = this.findOne(id);
    return { ...hall, seats: this.getSeats(hall) };
  }

  /** All seats of the hall: rows × seatsPerRow, ordered by row, then seat. */
  getSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }
    return seats;
  }

  /** True when (row, seat) exists in the hall. */
  hasSeat(hall: Hall, seat: Seat): boolean {
    return (
      seat.row >= 1 &&
      seat.row <= hall.rows &&
      seat.seat >= 1 &&
      seat.seat <= hall.seatsPerRow
    );
  }

  remove(id: string): void {
    this.findOne(id);
    if (this.showingsService.hasShowingsForHall(id)) {
      throw new ConflictException(
        `Зал з id ${id} не можна видалити: у ньому є сеанси`,
      );
    }
    this.halls = this.halls.filter((hall) => hall.id !== id);
  }
}
