import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AuthServiceClient,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'libs/generated/auth';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  private authServiceClient: AuthServiceClient;
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  @Post('register')
  register(
    @Body() createUserDto: RegisterRequest,
  ): Observable<RegisterResponse> {
    return this.authServiceClient.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginRequest): Observable<LoginResponse> {
    return this.authServiceClient.login(loginDto);
  }
}
