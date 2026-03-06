import { Module } from '@nestjs/common';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'libs/services/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/users-service/.env'],
    }),
  ],
  controllers: [UsersServiceController],
  providers: [UsersServiceService, PrismaService],
})
export class UsersServiceModule {}
