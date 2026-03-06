import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MailerModule } from './mailer/mailer.module';
import { EmailServiceService } from './email-service.service';
import { EmailServiceController } from './email-service.controller';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'apps/email-service/.env'), '.env'],
      load: [mailConfig],
    }),
    MailerModule,
  ],
  controllers: [EmailServiceController],
  providers: [EmailServiceService],
})
export class EmailServiceModule {}
