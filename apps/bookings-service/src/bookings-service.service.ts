import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { UsersServiceClient } from 'libs/generated/users';
import {
  BookingStatus,
  Prisma,
} from 'libs/services/database/generated/prisma/client';
import { PrismaService } from 'libs/services/database/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingsServiceService {
  private usersServiceClient: UsersServiceClient;
  private readonly logger = new Logger(BookingsServiceService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientGrpc,
  ) {
    this.usersServiceClient =
      this.usersClient.getService<UsersServiceClient>('UsersService');
  }
  async createBooking(createBookingDto: Prisma.BookingCreateInput) {
    try {
      if (createBookingDto.startTime >= createBookingDto.endTime) {
        throw new RpcException({
          code: 3,
          message: 'Invalid booking time',
        });
      }
      const provider = await firstValueFrom(
        this.usersServiceClient.getUserById({
          id: createBookingDto.providerId as string,
        }),
      );
      if (!provider) {
        throw new RpcException({ code: 5, message: 'Provider not found' });
      }
      return this.prisma.$transaction(async (tx) => {
        const checkAvailability = await tx.booking.findFirst({
          where: {
            providerId: createBookingDto.providerId as string,
            startTime: {
              lt: createBookingDto.endTime as string,
            },
            endTime: {
              gt: createBookingDto.startTime as string,
            },
          },
        });
        if (checkAvailability) {
          throw new RpcException({
            code: 6,
            message: 'Provider is not available at this time',
          });
        }
        return await tx.booking.create({
          data: createBookingDto,
        });
      });
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: 13,
        message: (error as Error)?.message ?? 'Failed to create booking',
      });
    }
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    return booking;
  }

  async getBookingsByUserId(userId: string) {
    try {
      const bookings = await this.prisma.booking.findMany({
        where: {
          OR: [{ clientId: userId }, { providerId: userId }],
        },
        orderBy: {
          startTime: 'desc',
        },
      });
      return {
        bookings,
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: 13,
        message:
          (error as Error)?.message ?? 'Failed to get bookings by user id',
      });
    }
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status },
    });
    return booking;
  }
}
