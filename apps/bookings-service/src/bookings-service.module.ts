import { Module } from '@nestjs/common';
import { BookingsServiceController } from './bookings-service.controller';
import { BookingsServiceService } from './bookings-service.service';

@Module({
  imports: [],
  controllers: [BookingsServiceController],
  providers: [BookingsServiceService],
})
export class BookingsServiceModule {}
