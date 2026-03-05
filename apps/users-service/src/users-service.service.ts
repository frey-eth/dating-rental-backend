import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type {
  User as ProtoUser,
  GetUsersResponse,
  UpdateUserResponse,
  CreateUserRequest,
} from 'libs/generated/users';
import { toProtoUser } from './user.mapper';
import { PrismaService } from 'libs/module/database/prisma.service';
import { Prisma } from 'libs/module/database/generated/prisma/client';

@Injectable()
export class UsersServiceService {
  private readonly logger = new Logger(UsersServiceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<GetUsersResponse> {
    const users = await this.prisma.user.findMany();
    return {
      users: users.map(toProtoUser),
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

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UpdateUserResponse> {
    const { where, data } = params;
    if (!where || !data) {
      throw new RpcException({ code: 3, message: 'Invalid update payload' });
    }
    try {
      const updated = await this.prisma.user.update({
        where,
        data,
      });
      return {
        user: toProtoUser(updated),
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
