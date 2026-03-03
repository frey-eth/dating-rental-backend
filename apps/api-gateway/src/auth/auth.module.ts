import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from '../../../../libs/common/jwt/jwt-auth.guard';
import { JwtStrategy } from '../../../../libs/common/jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(
          'JWT_SECRET',
          'default-secret-change-in-production',
        ),
        signOptions: {},
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE_URL ?? 'localhost:50052',
          package: 'auth',
          protoPath: join(process.cwd(), 'libs/proto/auth.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
