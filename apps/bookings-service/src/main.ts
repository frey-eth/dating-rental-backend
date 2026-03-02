import { NestFactory } from '@nestjs/core';
import { BookingsServiceModule } from './bookings-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingsServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
