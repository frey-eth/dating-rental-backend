import { Module } from '@nestjs/common';
import { BookingsServiceController } from './bookings-service.controller';
import { BookingsServiceService } from './bookings-service.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'libs/services/database/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.USERS_SERVICE_URL ?? 'localhost:50051',
          package: 'users',
          protoPath: join(process.cwd(), 'libs/proto/users.proto'),
        },
      },
    ]),
  ],
  controllers: [BookingsServiceController],
  providers: [BookingsServiceService, PrismaService],
})
export class BookingsServiceModule {}
