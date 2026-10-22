import { PartialType } from '@nestjs/swagger';
import { CreateFilmDto } from './create-film.dto';

/** Any subset of the film fields, with the same validation rules. */
export class UpdateFilmDto extends PartialType(CreateFilmDto) {}
