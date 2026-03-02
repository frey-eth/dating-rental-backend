import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ApiGatewayController],
  providers: [],
})
export class ApiGatewayModule {}
