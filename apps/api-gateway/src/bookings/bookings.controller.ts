import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateBookingDto } from 'apps/api-gateway/src/bookings/dto/create-booking.dto';
import { BookingsServiceClient } from 'libs/generated/bookings';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
  private bookingsServiceClient: BookingsServiceClient;
  constructor(
    @Inject('BOOKINGS_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.bookingsServiceClient =
      this.client.getService<BookingsServiceClient>('BookingsService');
  }

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsServiceClient.createBooking(createBookingDto);
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingsServiceClient.getBookingById({ id });
  }

  @Put(':id/status')
  updateBookingStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsServiceClient.updateBookingStatus({
      id,
      status: updateBookingStatusDto.status,
    });
  }
}
