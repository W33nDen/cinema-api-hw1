import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';

/** Built-in ParseUUIDPipe with a Ukrainian message: a non-UUID :id gives 400. */
export const parseUuidPipe = new ParseUUIDPipe({
  exceptionFactory: () =>
    new BadRequestException('Параметр id має бути коректним UUID'),
});
