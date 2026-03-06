import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AllRpcExceptionsFilter } from 'libs/common/exception-filter/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.USERS_SERVICE_URL ?? 'localhost:50051',
        package: 'users',
        protoPath: join(process.cwd(), 'libs/proto/users.proto'),
      },
    },
  );
  app.useGlobalFilters(new AllRpcExceptionsFilter());
  await app.listen().then(() => {
    console.log('Users service is running on port 50051');
  });
}
bootstrap();
