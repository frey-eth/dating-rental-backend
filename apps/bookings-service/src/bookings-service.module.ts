import { Module } from '@nestjs/common';
import { BookingsServiceController } from './bookings-service.controller';
import { BookingsServiceService } from './bookings-service.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'libs/services/database/prisma.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [BookingsServiceController],
  providers: [BookingsServiceService, PrismaService],
})
export class BookingsServiceModule {}
