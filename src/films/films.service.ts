import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ShowingsService } from '../showings/showings.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  private films: Film[] = [];

  constructor(
    // Circular dependency: showings need films (existence, title) and
    // deleting a film needs showings (409 if referenced). See README.
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: ShowingsService,
  ) {}

  create(createFilmDto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: createFilmDto.title,
      durationMinutes: createFilmDto.durationMinutes,
      releaseYear: createFilmDto.releaseYear,
    };
    this.films.push(film);
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
      throw new NotFoundException(`Фільм з id ${id} не знайдено`);
    }
    return film;
  }

  update(id: string, updateFilmDto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    if (updateFilmDto.title !== undefined) film.title = updateFilmDto.title;
    if (updateFilmDto.durationMinutes !== undefined)
      film.durationMinutes = updateFilmDto.durationMinutes;
    if (updateFilmDto.releaseYear !== undefined)
      film.releaseYear = updateFilmDto.releaseYear;
    return film;
  }

  remove(id: string): void {
    this.findOne(id);
    if (this.showingsService.hasShowingsForFilm(id)) {
      throw new ConflictException(
        `Фільм з id ${id} не можна видалити: на нього є сеанси`,
      );
    }
    this.films = this.films.filter((film) => film.id !== id);
  }
}
