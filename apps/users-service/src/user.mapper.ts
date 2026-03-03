import type { User as ProtoUser } from 'libs/generated/users';
import { User } from '../generated/prisma/client';

/**
 * Prisma User shape (from generated client) - role enum, Date for timestamps
 */

export function toProtoUser(prismaUser: User): ProtoUser {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    password: prismaUser.password,
    role: typeof prismaUser.role === 'string' ? prismaUser.role : String(prismaUser.role),
    createdAt:
      prismaUser.createdAt instanceof Date
        ? prismaUser.createdAt.toISOString()
        : String(prismaUser.createdAt),
    updatedAt:
      prismaUser.updatedAt instanceof Date
        ? prismaUser.updatedAt.toISOString()
        : String(prismaUser.updatedAt),
  };
}
