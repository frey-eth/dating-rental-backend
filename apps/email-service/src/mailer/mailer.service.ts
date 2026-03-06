/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from '../config/mail-config.type';
import Handlebars from 'handlebars';
const nodemailer = require('nodemailer');

@Injectable()
export class MailerService {
  private readonly transporter: import('nodemailer').Transporter;

  constructor(private readonly configService: ConfigService<MailConfig>) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host', { infer: true }),
      port: this.configService.get<number>('mail.port', { infer: true }) ?? 587,
      secure: this.configService.get<boolean>('mail.secure', { infer: true }),
      ignoreTLS: this.configService.get<boolean>('mail.ignoreTLS', {
        infer: true,
      }),
      requireTLS: this.configService.get<boolean>('mail.requireTLS', {
        infer: true,
      }),
      auth:
        this.configService.get<string>('mail.user', { infer: true }) &&
        this.configService.get<string>('mail.password', { infer: true })
          ? {
              user: this.configService.get<string>('mail.user', {
                infer: true,
              }),
              pass: this.configService.get<string>('mail.password', {
                infer: true,
              }),
            }
          : undefined,
    });
  }

  async sendEmail({
    template,
    context,
    ...mailOptions
  }: import('nodemailer').SendMailOptions & {
    template: string | undefined;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (template) {
      html = Handlebars.compile(template)(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? (mailOptions.from as string)
        : this.configService.get<string>('mail.defaultName', { infer: true }) +
          ' <' +
          this.configService.get<string>('mail.defaultEmail', { infer: true }) +
          '>',
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
