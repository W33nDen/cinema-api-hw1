import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  const config = new DocumentBuilder()
    .setTitle('Cinema API')
    .setDescription(
      'Розклад сеансів і бронювання місць у кінотеатрі (дані зберігаються в пам’яті)',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
