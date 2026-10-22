import { Injectable } from '@nestjs/common';
import { Showing } from './entities/showing.entity';

/**
 * Low-level storage of showings: owns the private array and answers simple
 * questions about it. Has no dependencies, so FilmsModule and HallsModule can
 * ask "is this film/hall used by a showing?" without depending on
 * ShowingsService (which itself depends on films and halls).
 */
@Injectable()
export class ShowingsStore {
  private showings: Showing[] = [];

  add(showing: Showing): Showing {
    this.showings.push(showing);
    return showing;
  }

  findAll(): Showing[] {
    return this.showings;
  }

  findById(id: string): Showing | undefined {
    return this.showings.find((showing) => showing.id === id);
  }

  hasShowingsForFilm(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  hasShowingsForHall(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }
}
