import { Controller } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import {
  AuthServiceControllerMethods,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
} from 'libs/generated/auth';

@Controller()
@AuthServiceControllerMethods()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  register(createUserDto: RegisterRequest): Promise<RegisterResponse> {
    return this.authServiceService.register(createUserDto);
  }

  async login(loginDto: LoginRequest): Promise<LoginResponse> {
    return await this.authServiceService.login(loginDto);
  }

  refreshToken({ refreshToken }: RefreshTokenRequest) {
    return this.authServiceService.refreshToken(refreshToken);
  }
}
