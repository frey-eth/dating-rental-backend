import { Module } from '@nestjs/common';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/users-service/.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGO_URI') ??
          'mongodb://root:password@localhost:27017/mydb?authSource=admin',
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersServiceController],
  providers: [UsersServiceService],
})
export class UsersServiceModule {}
