import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
