import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'libs/common/jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    BookingsModule,
  ],
  controllers: [ApiGatewayController],
  providers: [JwtStrategy],
})
export class ApiGatewayModule {}
