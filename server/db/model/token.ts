import { Document, model, Model, Schema } from 'mongoose';
import { ModelTypeMapping, toStoreModelDescriptor } from '../../utility';

export const clientTokenDescriptor = {
  access_token: String,
  refresh_token: String,
  expire_at: Number
};
export const clientTokenSMD = toStoreModelDescriptor(clientTokenDescriptor);

export const tokenDescriptor = {
  tokenKey: String,
  refreshKey: String,
  refreshExpire: Number,
  tokens: clientTokenDescriptor,
  user_password: String,
  user_id: String
};

export type IToken = ModelTypeMapping<typeof tokenDescriptor>;

export interface ITokenModel extends IToken, Document {}

export const TokenSchema = new Schema<ITokenModel>(tokenDescriptor);

export default model<ITokenModel>('Token', TokenSchema) as Model<ITokenModel>;
