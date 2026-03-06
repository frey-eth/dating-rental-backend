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

@Controller()
@UsersServiceControllerMethods()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  async getUsers(): Promise<GetUsersResponse> {
    return await this.usersServiceService.getUsers();
  }

  async getUserById(request: GetUserByIdRequest) {
    return await this.usersServiceService.getUserById(request.id);
  }

  async createUser(createUserDto: CreateUserRequest) {
    return this.usersServiceService.createUser(createUserDto);
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    if (!request.user) {
      return { user: undefined };
    }
    const { name, email, password, role } = request.user;
    return await this.usersServiceService.updateUser({
      id: request.id,
      data: {
        ...(name !== undefined && name !== '' && { name }),
        ...(email !== undefined && email !== '' && { email }),
        ...(password !== undefined && password !== '' && { password }),
        ...(role !== undefined && role !== '' && { role }),
      },
    });
  }

  async getUserByEmail(request: GetUserByEmailRequest) {
    return await this.usersServiceService.getUserByEmail(request.email);
  }
}
