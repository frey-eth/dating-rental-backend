import { Controller } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import {
  GetUserByIdRequest,
  UpdateUserRequest,
  UsersServiceControllerMethods,
  CreateUserRequest,
  GetUserByEmailRequest,
} from 'libs/generated/users';
import { GetUsersResponse } from 'libs/generated/users';

@Controller()
@UsersServiceControllerMethods()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  getUsers(): GetUsersResponse {
    return this.usersServiceService.getUsers();
  }

  getUserById(request: GetUserByIdRequest) {
    return this.usersServiceService.getUserById(request.id);
  }

  createUser(createUserDto: CreateUserRequest) {
    return this.usersServiceService.createUser(createUserDto);
  }

  updateUser(request: UpdateUserRequest) {
    return this.usersServiceService.updateUser(request.id, request.user!);
  }

  getUserByEmail(request: GetUserByEmailRequest) {
    return this.usersServiceService.getUserByEmail(request.email);
  }
}
