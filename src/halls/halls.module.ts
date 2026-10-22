import { Module } from '@nestjs/common';
import { ShowingsCoreModule } from '../showings/showings-core.module';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';

@Module({
  imports: [ShowingsCoreModule],
  controllers: [HallsController],
  providers: [HallsService],
  exports: [HallsService],
})
export class HallsModule {}
