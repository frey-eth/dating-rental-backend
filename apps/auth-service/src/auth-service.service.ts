import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { LoginRequest, RegisterRequest } from 'libs/generated/auth';
import { UsersServiceClient } from 'libs/generated/users';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  private usersServiceClient: UsersServiceClient;
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usersServiceClient =
      this.client.getService<UsersServiceClient>('UsersService');
  }

  async register(createUserDto: RegisterRequest) {
    const createdUser = await firstValueFrom(
      this.usersServiceClient.createUser(createUserDto),
    );
    if (createdUser) {
      return {
        user: createdUser,
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
    }
    throw new RpcException('User not created');
  }

  async login(loginDto: LoginRequest) {
    const user = await firstValueFrom(
      this.usersServiceClient.getUserByEmail({ email: loginDto.email }),
    );
    return {
      user: user,
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
  }

  refreshToken(refreshToken: string) {
    return {
      accessToken: 'access_token',
      refreshToken: refreshToken,
    };
  }
}
