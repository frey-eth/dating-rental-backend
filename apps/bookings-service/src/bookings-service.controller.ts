import { Controller } from '@nestjs/common';
import { BookingsServiceService } from './bookings-service.service';
import {
  BookingsServiceControllerMethods,
  CreateBookingRequest,
  GetBookingByIdRequest,
  UpdateBookingStatusRequest,
} from 'libs/generated/bookings';
import { BookingStatus } from 'libs/services/database/generated/prisma/enums';

@BookingsServiceControllerMethods()
@Controller()
export class BookingsServiceController {
  constructor(
    private readonly bookingsServiceService: BookingsServiceService,
  ) {}

  createBooking(request: CreateBookingRequest) {
    return this.bookingsServiceService.createBooking({
      userClientId: request.userClientId,
      userProviderId: request.userProviderId,
      startTime: new Date(),
      endTime: new Date(),
      amount: 0,
      currency: 'USD',
      paymentMethod: 'CARD',
      status: 'PENDING',
    });
  }

  getBookingById(request: GetBookingByIdRequest) {
    return this.bookingsServiceService.getBookingById(request.id);
  }

  updateBookingStatus(request: UpdateBookingStatusRequest) {
    return this.bookingsServiceService.updateBookingStatus(
      request.id,
      request.status as BookingStatus,
    );
  }
}
