import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User as ProtoUser,
  GetUsersResponse,
  UpdateUserResponse,
} from 'libs/generated/users';
import { PrismaService } from './prisma.service';
import { toProtoUser } from './user.mapper';

@Injectable()
export class UsersServiceService {
  private readonly logger = new Logger(UsersServiceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<GetUsersResponse> {
    const users = await this.prisma.user.findMany();
    return {
      users: users.map(toProtoUser),
      status: 'success',
      message: 'Users fetched successfully',
    };
  }

  async getUserById(id: string): Promise<ProtoUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new RpcException({ code: 5, message: 'User not found' });
    }
    return toProtoUser(user);
  }

  async getUserByEmail(email: string): Promise<ProtoUser> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new RpcException({ code: 5, message: 'User not found' });
    }
    return toProtoUser(user);
  }

  async createUser(dto: CreateUserRequest): Promise<ProtoUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: dto.password,
        },
      });
      return toProtoUser(user);
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err?.code === 'P2002') {
        throw new RpcException({
          code: 6,
          message: 'Email already registered',
        });
      }
      this.logger.error('createUser failed', e);
      throw new RpcException({
        code: 13,
        message: err?.message ?? 'Failed to create user',
      });
    }
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { id, user: payload } = request;
    if (!payload) {
      throw new RpcException({ code: 3, message: 'Invalid update payload' });
    }
    const data: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'PROVIDER' | 'CLIENT';
    } = {};
    if (payload.name !== undefined && payload.name !== '')
      data.name = payload.name;
    if (payload.email !== undefined && payload.email !== '')
      data.email = payload.email;
    if (payload.password !== undefined && payload.password !== '')
      data.password = payload.password;
    if (payload.role !== undefined && payload.role !== '') {
      data.role = payload.role === 'PROVIDER' ? 'PROVIDER' : 'CLIENT';
    }
    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data,
      });
      return {
        user: toProtoUser(updated),
        status: 'success',
        message: 'User updated successfully',
      };
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err?.code === 'P2025') {
        throw new RpcException({ code: 5, message: 'User not found' });
      }
      if (err?.code === 'P2002') {
        throw new RpcException({ code: 6, message: 'Email already in use' });
      }
      throw e;
    }
  }
}
