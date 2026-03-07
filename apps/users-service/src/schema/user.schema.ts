import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['PROVIDER', 'CLIENT'], default: 'CLIENT' })
  role: string;

  @Prop()
  location?: string;

  @Prop()
  phone?: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  bio?: string;

  @Prop({ enum: ['MALE', 'FEMALE', 'OTHER'], default: 'OTHER' })
  gender?: string;

  @Prop()
  birthDate?: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isBanned: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
