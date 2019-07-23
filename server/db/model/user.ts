import { Document, model, Model, Schema } from 'mongoose';
import { ModelTypeMapping, toStoreModelDescriptor } from '../../utility';

export const userDescriptor = {
  user_id: String,
  username: String,
  avatar: String
};
export const userSMD = toStoreModelDescriptor(userDescriptor);

export type IUser = ModelTypeMapping<typeof userDescriptor>;

export interface IUserModel extends IUser, Document {}

export const UserSchema = new Schema<IUserModel>(userDescriptor);

export default model<IUserModel>('User', UserSchema) as Model<IUserModel>;
