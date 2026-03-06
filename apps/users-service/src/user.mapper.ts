import type { User as ProtoUser } from 'libs/generated/users';
import type { UserDocument } from './schema/user.schema';

export function toProtoUser(doc: UserDocument): ProtoUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    password: doc.password,
    role: doc.role,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt ?? ''),
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt ?? ''),
  };
}
