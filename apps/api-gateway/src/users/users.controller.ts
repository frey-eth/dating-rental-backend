import { User, UsersServiceClient } from 'libs/generated/users';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  private usersService: UsersServiceClient;
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>('UsersService');
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers({});
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById({ id });
  }

  @Post()
  createUser(@Body() user: User) {
    return this.usersService.createUser(user);
  }

  @Put('/:id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
    return this.usersService.updateUser({ id, user });
  }
}
