import { Module } from '@nestjs/common';
import { ShowingsCoreModule } from '../showings/showings-core.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [ShowingsCoreModule],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
