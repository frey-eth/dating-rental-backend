/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  userClientId: string;

  @IsNotEmpty()
  @IsString()
  userProviderId: string;
}
