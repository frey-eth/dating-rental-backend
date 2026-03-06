import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer/mailer.service';
import { activationTemplate } from './mail-templates/activation';

@Injectable()
export class EmailServiceService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async userRegistered(email: string, token: string, name: string) {
    const baseUrl =
      this.configService.get<string>('ACTIVATION_BASE_URL') ??
      'http://localhost:3000';
    await this.mailerService.sendEmail({
      to: email,
      subject: 'Welcome to Yobae',
      template: activationTemplate,
      context: {
        name,
        activationLink: `${baseUrl}/auth/verify-email?token=${token}`,
      },
    });
  }
}
