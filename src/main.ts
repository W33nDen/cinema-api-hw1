import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { validationExceptionFactory } from './common/validation/validation-exception.factory';
import { EnvironmentVariables } from './config/environment-variables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // whitelist: drops fields that are not declared in the DTO,
  // forbidNonWhitelisted: answers 400 when such fields are present,
  // transform: the handler receives a DTO class instance.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription(
      'Розклад сеансів і бронювання місць у кінотеатрі (дані зберігаються в пам’яті)',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const port = configService.get('PORT', { infer: true });
  const nodeEnv = configService.get('NODE_ENV', { infer: true });

  await app.listen(port);
  new Logger('Bootstrap').log(
    `Cinema API (${nodeEnv}) слухає порт ${port}; Swagger: http://localhost:${port}/docs`,
  );
}
void bootstrap();
