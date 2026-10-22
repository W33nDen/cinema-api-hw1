import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { parseIsoDateTime } from '../common/utils/date.utils';
import { FilmsService } from '../films/films.service';
import { HallsService } from '../halls/halls.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto';
import { Showing, ShowingView } from './entities/showing.entity';

@Injectable()
export class ShowingsService {
  private showings: Showing[] = [];

  constructor(
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: FilmsService,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: HallsService,
  ) {}

  create(createShowingDto: CreateShowingDto): ShowingView {
    const { filmId, hallId, price } = createShowingDto;

    const errors: string[] = [];
    if (!this.filmsService.findById(filmId)) {
      errors.push(`Фільм з id ${filmId} не знайдено`);
    }
    if (!this.hallsService.findById(hallId)) {
      errors.push(`Зал з id ${hallId} не знайдено`);
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // The DTO has already checked the format and that the moment is in the future.
    const startsAt = parseIsoDateTime(createShowingDto.startsAt);
    if (!startsAt || startsAt.getTime() <= Date.now()) {
      throw new BadRequestException([
        'startsAt must be a date-time in the future',
      ]);
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId,
      hallId,
      startsAt: startsAt.toISOString(),
      price,
    };
    this.showings.push(showing);
    return this.toView(showing);
  }

  /**
   * Schedule: optional filters by film and by day (UTC date of startsAt),
   * combined with AND; sorted by startsAt ascending, ties broken by id.
   */
  findAll(query: FindShowingsQueryDto): ShowingView[] {
    return this.showings
      .filter((showing) => !query.filmId || showing.filmId === query.filmId)
      .filter(
        (showing) =>
          !query.date || showing.startsAt.slice(0, 10) === query.date,
      )
      .sort(
        (a, b) =>
          Date.parse(a.startsAt) - Date.parse(b.startsAt) ||
          a.id.localeCompare(b.id),
      )
      .map((showing) => this.toView(showing));
  }

  /** The stored showing (with filmId/hallId); throws 404 when absent. */
  findOne(id: string): Showing {
    const showing = this.showings.find((item) => item.id === id);
    if (!showing) {
      throw new NotFoundException(`Сеанс з id ${id} не знайдено`);
    }
    return showing;
  }

  findOneView(id: string): ShowingView {
    return this.toView(this.findOne(id));
  }

  hasShowingsForFilm(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  hasShowingsForHall(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }

  private toView(showing: Showing): ShowingView {
    // Film and hall always exist: they cannot be deleted while a showing references them.
    return {
      id: showing.id,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}
