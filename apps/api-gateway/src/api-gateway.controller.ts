import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiGatewayController {
  @Get('health-check')
  healthCheck(): string {
    return 'OK';
  }
}
