import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from 'libs/module/database/generated/prisma/client';
import { PrismaService } from 'libs/module/database/prisma.service';

@Injectable()
export class BookingsServiceService {
  private readonly logger = new Logger(BookingsServiceService.name);
  constructor(private readonly prisma: PrismaService) {}
  async createBooking(createBookingDto: Prisma.BookingCreateInput) {
    const booking = await this.prisma.booking.create({
      data: createBookingDto,
    });
    return booking;
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    return booking;
  }

  async updateBookingStatus(
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED',
  ) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status },
    });
    return booking;
  }
}
