import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/** Global pipes and filters; shared by main.ts and the e2e tests. */
export function setupApp(app: INestApplication): void {
  // whitelist: strips fields that are not declared in the DTO,
  // forbidNonWhitelisted: answers 400 when such fields are present,
  // transform: turns plain request bodies/queries into DTO class instances.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}
