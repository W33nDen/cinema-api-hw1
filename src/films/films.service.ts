import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsStore } from '../showings/showings.store';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  private films: Film[] = [];

  constructor(private readonly showingsStore: ShowingsStore) {}

  create(createFilmDto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: createFilmDto.title,
      durationMinutes: createFilmDto.durationMinutes,
      releaseYear: createFilmDto.releaseYear,
    };
    this.films.push(film);
    this.logger.log(`Створено фільм ${film.id}`);
    return film;
  }

  findAll(): Film[] {
    return this.films;
  }

  /** Returns the film or undefined; for other modules that pick their own status code. */
  findById(id: string): Film | undefined {
    return this.films.find((film) => film.id === id);
  }

  findOne(id: string): Film {
    const film = this.findById(id);
    if (!film) {
      this.logger.warn(`Фільм з id ${id} не знайдено`);
      throw new NotFoundException(`Фільм з id ${id} не знайдено`);
    }
    return film;
  }

  update(id: string, updateFilmDto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    // Only fields that were actually sent are changed (absent or null are ignored).
    film.title = updateFilmDto.title ?? film.title;
    film.durationMinutes =
      updateFilmDto.durationMinutes ?? film.durationMinutes;
    film.releaseYear = updateFilmDto.releaseYear ?? film.releaseYear;
    return film;
  }

  remove(id: string): void {
    this.findOne(id);
    if (this.showingsStore.hasShowingsForFilm(id)) {
      this.logger.warn(`Фільм ${id} не видалено: на нього є сеанси`);
      throw new ConflictException(
        `Фільм з id ${id} не можна видалити: на нього є сеанси`,
      );
    }
    this.films = this.films.filter((film) => film.id !== id);
    this.logger.log(`Видалено фільм ${id}`);
  }
}
