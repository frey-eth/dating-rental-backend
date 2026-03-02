import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOKINGS_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.BOOKINGS_SERVICE_URL ?? 'localhost:50053',
          package: 'bookings',
          protoPath: join(process.cwd(), 'libs/proto/bookings.proto'),
        },
      },
    ]),
  ],
  controllers: [BookingsController],
  providers: [],
})
export class BookingsModule {}
