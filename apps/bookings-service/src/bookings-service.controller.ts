import { Controller } from '@nestjs/common';
import { BookingsServiceService } from './bookings-service.service';
import {
  BookingsServiceControllerMethods,
  CreateBookingRequest,
  GetBookingByIdRequest,
  GetBookingsByUserIdRequest,
  UpdateBookingStatusRequest,
} from 'libs/generated/bookings';
import { BookingStatus } from 'libs/services/database/generated/prisma/enums';

@BookingsServiceControllerMethods()
@Controller()
export class BookingsServiceController {
  constructor(
    private readonly bookingsServiceService: BookingsServiceService,
  ) {}

  createBooking(data: CreateBookingRequest) {
    return this.bookingsServiceService.createBooking(data);
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

  getBookingsByUserId(request: GetBookingsByUserIdRequest) {
    return this.bookingsServiceService.getBookingsByUserId(request.userId);
  }
}
