import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { User, UsersServiceClient } from 'libs/generated/users';
import { JwtAuthGuard } from '../../../../libs/common/jwt/jwt-auth.guard';

@Controller('users')
export class UsersController {
  private usersService: UsersServiceClient;

  constructor(@Inject('USERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>('UsersService');
  }
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUsers() {
    return firstValueFrom(this.usersService.getUsers({}));
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return firstValueFrom(this.usersService.getUserById({ id }));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') id: string, @Body() user: Partial<User>) {
    return firstValueFrom(
      this.usersService.updateUser({ id, user: user as User }),
    );
  }
}
