/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
