import { toStoreModelDescriptor } from '../../utility';

export const userDescriptor = {
  user_id: String,
  username: String,
  avatar: String
};
export const userSMD = toStoreModelDescriptor(userDescriptor);
