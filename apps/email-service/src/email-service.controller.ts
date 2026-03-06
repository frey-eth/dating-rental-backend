import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailServiceService } from './email-service.service';
import {
  EmailEventPatterns,
  UserRegisteredPayload,
} from 'libs/common/events/email.events';

@Controller()
export class EmailServiceController {
  private readonly logger = new Logger(EmailServiceController.name);

  constructor(private readonly emailService: EmailServiceService) {}

  @EventPattern(EmailEventPatterns.USER_REGISTERED)
  async handleUserRegistered(
    @Payload() payload: UserRegisteredPayload,
  ): Promise<void> {
    this.logger.log(
      `Received ${EmailEventPatterns.USER_REGISTERED}: ${payload.email}`,
    );
    await this.emailService.userRegistered(
      payload.email,
      payload.activationToken,
      payload.name,
    );
  }
}
