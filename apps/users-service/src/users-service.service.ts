import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import type {
  User as ProtoUser,
  GetUsersResponse,
  UpdateUserResponse,
  CreateUserRequest,
} from 'libs/generated/users';
import { toProtoUser } from './user.mapper';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersServiceService {
  private readonly logger = new Logger(UsersServiceService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUsers(): Promise<GetUsersResponse> {
    const users = await this.userModel.find().exec();
    return {
      users: users.map(toProtoUser),
    };
  }

  async getUserById(id: string): Promise<ProtoUser> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new RpcException({ code: 5, message: 'User not found' });
    }
    return toProtoUser(user);
  }

  async getUserByEmail(email: string): Promise<ProtoUser> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new RpcException({ code: 5, message: 'User not found' });
    }
    return toProtoUser(user);
  }

  async createUser(dto: CreateUserRequest): Promise<ProtoUser> {
    try {
      const created = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: 'CLIENT',
      });
      return toProtoUser(created);
    } catch (e: unknown) {
      const err = e as { code?: number; keyPattern?: Record<string, number> };
      if (err?.code === 11000 || err?.keyPattern?.email) {
        throw new RpcException({
          code: 6,
          message: 'Email already registered',
        });
      }
      this.logger.error('createUser failed', e);
      throw new RpcException({
        code: 13,
        message: (e as Error)?.message ?? 'Failed to create user',
      });
    }
  }

  async updateUser(params: {
    id: string;
    data: Partial<{
      name: string;
      email: string;
      password: string;
      role: string;
      location: string;
      phone: string;
      profilePicture: string;
      bio: string;
      gender: string;
      birthDate: Date;
      isVerified: boolean;
      isBanned: boolean;
    }>;
  }): Promise<UpdateUserResponse> {
    const { id, data } = params;
    if (!id || !data || Object.keys(data).length === 0) {
      throw new RpcException({ code: 3, message: 'Invalid update payload' });
    }
    try {
      const updated = await this.userModel
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
      if (!updated) {
        throw new RpcException({ code: 5, message: 'User not found' });
      }
      return {
        user: toProtoUser(updated),
      };
    } catch (e: unknown) {
      if (e instanceof RpcException) throw e;
      const err = e as { code?: number; keyPattern?: Record<string, number> };
      if (err?.code === 11000 || err?.keyPattern?.email) {
        throw new RpcException({ code: 6, message: 'Email already in use' });
      }
      throw e;
    }
  }
}
