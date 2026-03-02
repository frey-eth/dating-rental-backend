import { Controller, Get } from '@nestjs/common';
import { BookingsServiceService } from './bookings-service.service';

@Controller()
export class BookingsServiceController {
  constructor(
    private readonly bookingsServiceService: BookingsServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.bookingsServiceService.getHello();
  }
}
