/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  userClientId: number;

  @IsNotEmpty()
  @IsNumber()
  userProviderId: number;
}
