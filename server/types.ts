import { Exception, QueryResponse } from "phusis";


export interface OnlineUser {
  user_id: string;
  username: string;
}

export interface QueryResult<D = any> {
  status: string;
  exception?: Exception;
  data?: D;
}

export type DataResponse<D = any> = QueryResponse<QueryResult<D>, OnlineUser>;
