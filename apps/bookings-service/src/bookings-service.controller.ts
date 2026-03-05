import { Controller } from '@nestjs/common';
import { BookingsServiceService } from './bookings-service.service';
import {
  BookingsServiceControllerMethods,
  CreateBookingRequest,
  GetBookingByIdRequest,
  UpdateBookingStatusRequest,
} from 'libs/generated/bookings';

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
    });
  }

  getBookingById(request: GetBookingByIdRequest) {
    return this.bookingsServiceService.getBookingById(request.id);
  }

  updateBookingStatus(request: UpdateBookingStatusRequest) {
    return this.bookingsServiceService.updateBookingStatus(
      request.id,
      request.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED',
    );
  }
}
