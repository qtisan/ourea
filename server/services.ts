import { anoninfo } from '../lib/stores/authorize';
import { makeError } from './errors';
import { OnlineUser } from './types';

const services: { [action: string]: (user: OnlineUser, payload: any) => Promise<any> } = {
  async 'test/posts'(user: OnlineUser, payload: any) {
    return {
      user,
      payload,
      total: 2,
      posts: [{ title: 'Ourea is good!' }, { title: 'I am working on the skeleton' }]
    };
  },
  async 'passport/current-user'(user: OnlineUser, payload: any) {
    if (payload) {
      return user;
    } else {
      return anoninfo;
    }
  },
  async 'passport/signin'(user: OnlineUser, payload: any) {
    return {
      payload,
      user
    };
  }
};

export async function dispatch({
  action,
  payload,
  user
}: {
  action: string;
  payload: any;
  user: OnlineUser;
}) {
  if (action in services) {
    return await services[action](user, payload);
  }
  throw makeError(601);
}
