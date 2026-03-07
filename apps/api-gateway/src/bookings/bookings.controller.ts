import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateBookingDto } from 'apps/api-gateway/src/bookings/dto/create-booking.dto';
import { BookingsServiceClient } from 'libs/generated/bookings';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { AuthGuard } from 'libs/common/jwt/jwt-auth.guard';
import { User } from 'libs/common/decorator/user.decorator';
import { firstValueFrom } from 'rxjs';

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
  @UseGuards(AuthGuard)
  createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @User('userId') userId: string,
  ) {
    return this.bookingsServiceClient.createBooking({
      ...createBookingDto,
      clientId: userId,
      amount: createBookingDto.amount.toString(),
      startTime: createBookingDto.startTime.toISOString(),
      endTime: createBookingDto.endTime.toISOString(),
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getBookingsByUserId(@User('userId') userId: string) {
    return this.bookingsServiceClient.getBookingsByUserId({ userId });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getBookingById(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    const booking = await firstValueFrom(
      this.bookingsServiceClient.getBookingById({ id }),
    );
    if (booking.clientId !== userId && booking.providerId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to access this booking',
      );
    }
    return booking;
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
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
