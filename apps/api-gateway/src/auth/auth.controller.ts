import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
} from 'libs/generated/auth';

@Controller('auth')
export class AuthController {
  private authServiceClient: AuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: RegisterRequest): Promise<RegisterResponse> {
    return firstValueFrom(this.authServiceClient.register(dto));
  }

  @Post('login')
  async login(@Body() dto: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(this.authServiceClient.login(dto));
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
  ): Promise<RefreshTokenResponse> {
    return firstValueFrom(
      this.authServiceClient.refreshToken({ refreshToken: body.refreshToken }),
    );
  }
}
