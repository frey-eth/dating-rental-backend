import { Controller } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import {
  GetUserByIdRequest,
  GetUserByEmailRequest,
  GetUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UsersServiceControllerMethods,
  CreateUserRequest,
} from 'libs/generated/users';
import { Prisma } from 'libs/module/database/generated/prisma/client';

@Controller()
@UsersServiceControllerMethods()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  async getUsers(): Promise<GetUsersResponse> {
    console.log('getUsers');
    return await this.usersServiceService.getUsers();
  }

  async getUserById(request: GetUserByIdRequest) {
    return await this.usersServiceService.getUserById(request.id);
  }

  async createUser(createUserDto: CreateUserRequest) {
    return this.usersServiceService.createUser(createUserDto);
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    return await this.usersServiceService.updateUser({
      where: { id: request.id },
      data: request.user as Prisma.UserUpdateInput,
    });
  }

  async getUserByEmail(request: GetUserByEmailRequest) {
    return await this.usersServiceService.getUserByEmail(request.email);
  }
}
