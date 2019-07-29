import { toStoreModelDescriptor } from '../../utility';

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
