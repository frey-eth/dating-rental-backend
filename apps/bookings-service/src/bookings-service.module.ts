import { Module } from '@nestjs/common';
import { BookingsServiceController } from './bookings-service.controller';
import { BookingsServiceService } from './bookings-service.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [BookingsServiceController],
  providers: [BookingsServiceService],
})
export class BookingsServiceModule {}
