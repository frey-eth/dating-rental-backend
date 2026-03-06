import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { GrpcToHttpExceptionFilter } from 'libs/common/exception-filter/grpc-to-http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GrpcToHttpExceptionFilter());
  await app.listen(process.env.port ?? 3000);
  console.log(`API Gateway is running on port ${process.env.port ?? 3000}`);
}
bootstrap();
