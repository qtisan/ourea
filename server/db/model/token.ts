import { Document, model, Model, Schema } from 'mongoose';
import { ITypeMappingMongoose } from '../../utility';

const schema = {
  tokenKey: String,
  refreshKey: String,
  refreshExpire: Number,
  tokens: {
    access_token: String,
    refresh_token: String,
    expire_at: Number
  },
  user_password: String,
  user_id: String
};

export type IToken = ITypeMappingMongoose<typeof schema>;

export interface ITokenModel extends IToken, Document {}

export const TokenSchema = new Schema<ITokenModel>(schema);

export default model<ITokenModel>('Token', TokenSchema) as Model<ITokenModel>;
