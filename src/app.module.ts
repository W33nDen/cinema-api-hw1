import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/environment-variables';
import { FilmsModule } from './films/films.module';
import { HallsModule } from './halls/halls.module';
import { ShowingsModule } from './showings/showings.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    FilmsModule,
    HallsModule,
    ShowingsModule,
    BookingsModule,
  ],
})
export class AppModule {}
