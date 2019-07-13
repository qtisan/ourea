import { Exception, QueryResponse } from 'phusis';

export type ResponseStatus = 'success' | 'fail' | 'unexpect';

export interface OnlineUser {
  user_id: string;
  username: string;
  avatar: string;
}

export interface QueryResult<D = any> {
  status: ResponseStatus;
  exception?: Exception;
  data?: D;
}

export type DataResponse<D = any> = QueryResponse<QueryResult<D>, OnlineUser>;
