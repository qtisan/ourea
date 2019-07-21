import { Document, model, Model, Schema } from 'mongoose';
import { ITypeMappingMongoose } from '../../utility';

const schema = {
  user_id: String,
  username: String,
  avatar: String
};

export type IUser = ITypeMappingMongoose<typeof schema>;

export interface IUserModel extends IUser, Document {}

export const UserSchema = new Schema<IUserModel>(schema);

export default model<IUserModel>('User', UserSchema) as Model<IUserModel>;
