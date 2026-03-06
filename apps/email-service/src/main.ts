import { NestFactory } from '@nestjs/core';
import { EmailServiceModule } from './email-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.RABBITMQ_URL ?? 'amqp://user:password@localhost:5672',
        ],
        queue: process.env.EMAIL_QUEUE ?? 'email_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();
  console.log('Email service is listening on message queue');
}
bootstrap();
