import { NestFactory } from '@nestjs/core';
import { BookingsServiceModule } from './bookings-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingsServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.BOOKINGS_SERVICE_URL ?? 'localhost:50053',
        package: 'bookings',
        protoPath: join(process.cwd(), 'libs/proto/bookings.proto'),
      },
    },
  );
  await app.listen().then(() => {
    console.log(
      `Bookings service is running on ${process.env.BOOKINGS_SERVICE_URL}`,
    );
  });
}
bootstrap();
