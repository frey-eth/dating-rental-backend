import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class UsersModule {}
