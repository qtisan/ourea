import {
  ActionPayloadType as IActionPayloadType,
  ActionResponseDataType as IActionResponseDataType,
  ClientQuery as IClientQuery,
  Exception,
  ExecuteQueryPayload,
  OnlineUserPack,
  QueryResponse as IQueryResponse,
  QueryResult as IQueryResult,
  Tokens
} from 'phusis';
import { anoninfo } from '../lib/stores/authorize';
import * as db from './db';
import { errswitch, makeError } from './errors';
import { getUserInfoByPassword, OnlineUser, refreshTokens } from './user';
import { PickMatching } from './utility';
// FUTURE: need to be permissioned.

class ActionPortal {
  user: OnlineUser;
  db: typeof db;
  constructor(user: OnlineUser) {
    this.user = user;
    this.db = db;
  }

  async 'system/noop'(payload: any) {
    return {
      user: this.user,
      payload,
      total: 2,
      posts: [{ title: 'Ourea is good!' }, { title: 'I am working on the skeleton' }]
    };
  }
  async 'passport/current-user'(payload: {
    expired: boolean;
  }): Promise<{
    user: OnlineUser;
    expired: boolean;
  }> {
    if (payload) {
      return { user: this.user, ...payload };
    } else {
      return { user: anoninfo.user, expired: false };
    }
  }
  async 'passport/refresh-token'(payload: any): Promise<Tokens> {
    try {
      return await refreshTokens(payload as Tokens);
    } catch (e) {
      throw errswitch(e, 432);
    }
  }
  async 'passport/signin'(payload: {
    username: string;
    password: string;
  }): Promise<OnlineUserPack<OnlineUser>> {
    return await getUserInfoByPassword(payload);
  }
}

export type ActionPortalType = PickMatching<ActionPortal, (payload: any) => Promise<{}>>;
export type ActionType = keyof ActionPortalType;
export type ActionResponseDataType<A extends ActionType> = IActionResponseDataType<
  A,
  ActionPortalType
>;
export type ActionPayloadType<A extends ActionType> = IActionPayloadType<A, ActionPortalType>;

export type QueryResponse<A extends ActionType> = IQueryResponse<OnlineUser, A, ActionPortalType>;
export type QueryResult<A extends ActionType> = IQueryResult<A, ActionPortalType>;

export type ClientQuery<A extends ActionType> = IClientQuery<A, ActionPortalType>;

export async function dispatch<A extends ActionType>({
  user,
  query
}: ExecuteQueryPayload<OnlineUser, A, ActionPortalType>): Promise<QueryResult<A>> {
  const { action, payload } = query;
  const actionPortal = new ActionPortal(user);

  if (action in actionPortal) {
    try {
      const data = (await actionPortal[action](payload)) as ActionResponseDataType<A>;
      return { status: 'success', data };
    } catch (e) {
      return { status: 'fail', exception: e as Exception };
    }
  }
  throw makeError(601);
}
