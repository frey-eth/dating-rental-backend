import { Injectable } from '@nestjs/common';
import {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from 'libs/generated/bookings';

@Injectable()
export class BookingsServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  createBooking(createBookingDto: CreateBookingRequest) {
    return {
      id: 1,
      userClientId: createBookingDto.userClientId,
      userProviderId: createBookingDto.userProviderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  getBookingById(id: number) {
    return {
      id: id,
      userClientId: 1,
      userProviderId: 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  updateBookingStatus(request: UpdateBookingStatusRequest) {
    return {
      id: request.id,
      status: request.status,
    };
  }
}
