import { Injectable, Logger } from '@nestjs/common';
import { USER_MOCKUP } from '../../../shared/constants';
import { RpcException } from '@nestjs/microservices';
import { CreateUserRequest, User } from 'libs/generated/users';

@Injectable()
export class UsersServiceService {
  private readonly users = USER_MOCKUP;
  private readonly logger = new Logger(UsersServiceService.name);
  getHello(): string {
    return 'Hello World!';
  }

  getUsers() {
    return {
      users: this.users,
    };
  }

  getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  getUserByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new RpcException('User not found');
  }

  createUser(createUserDto: CreateUserRequest): User {
    this.users.push({
      id: this.users.length + 1,
      ...createUserDto,
    } as (typeof this.users)[0]);

    return this.users[this.users.length - 1];
  }

  updateUser(id: number, user: (typeof this.users)[0]) {
    const currentUser = this.users.find((user) => user.id === id);
    if (currentUser) {
      currentUser.name = user.name;
      currentUser.email = user.email;
      currentUser.password = user.password;
      this.logger.log(`User updated: ${currentUser.name}`);
      return currentUser;
    }
    throw new RpcException('User not found');
  }
}
