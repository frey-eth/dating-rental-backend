import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AllRpcExceptionsFilter } from 'libs/common/exception-filter/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.AUTH_SERVICE_URL ?? 'localhost:50052',
        package: 'auth',
        protoPath: join(process.cwd(), 'libs/proto/auth.proto'),
      },
    },
  );
  app.useGlobalFilters(new AllRpcExceptionsFilter());
  await app.listen().then(() => {
    console.log(`Auth service is running on ${process.env.AUTH_SERVICE_URL} `);
  });
}

bootstrap();
