
import { Router, Request, Response, NextFunction } from "express";
import {
  handleQuery, ExecuteQueryPayload, refreshTokens,
  extractQuery, ServerTokens, Tokens, ExtractedQueryPack, caught
} from "phusis";

import { OnlineUser, QueryResult } from './types';
import { getAnonymousInfo } from "../lib/stores/authorize";

class ServerRoutes { 
  static router: Router = Router();

  @post '/hello'(req: Request, res: Response): void {
    req && res.json({ message: 'hello, world.', data: req.body });
  }

  @post async '/passport/anonymous'(req: Request, res: Response): Promise<void> {
    const anonymous = await getAnonymousInfo();
    req &&
      res.json({
        result: {
          status: 'success',
          data: anonymous
        }
      });
  }

  @use 'check credential'(req: Request, res: Response, next: NextFunction): void {
    const credential = req.header('credential');
    if (!credential) {
      res.status(401).end('401');
    } else {
      res.locals.credential = credential;
      res.locals.q = req.body.q;
      next();
    }
  }

  @post async '/do'(req: Request, res: Response): Promise<void> {
    const { credential, q } = res.locals;
    try {
      const data = await handleQuery(credential, q, verifyToken, executeQuery);
      req && res.json(data);
    } catch (err) {
      res.json({
        result: {
          status: 'error',
          data: JSON.stringify(err),
          exception: caught(err)
        }
      });
    }
  }

  @post async '/passport/refresh-token'(req: Request, res: Response): Promise<void> {
    req;
    const { credential, q } = res.locals;
    const eqp: ExtractedQueryPack = extractQuery(credential, q); 
    const newTokens = await refreshTokens(eqp ? eqp.query.payload : '', getUidByAccessToken, verifyAndSaveRefreshToken);
    const response = {
      result: {
        status: 'success',
        data: newTokens
      }
    };
    eqp && Object.assign(response, { query: eqp.query });
    res.json(response);
  }



}

function post(target: ServerRoutes, propertyKey: string, descriptor: PropertyDescriptor) {
  target && ServerRoutes.router.post(propertyKey, descriptor.value);
}
function use(target: ServerRoutes, propertyKey: string, descriptor: PropertyDescriptor) {
  target && propertyKey && ServerRoutes.router.use(descriptor.value);
}

async function verifyToken(accessToken: string): Promise<OnlineUser> {
  accessToken;
  return {
    user_id: '113',
    username: 'lennon'
  };
}
async function executeQuery({ user, query }: ExecuteQueryPayload<OnlineUser>): Promise<QueryResult> {
  if (user && query && query.action === 'test') {
    return {
      status: 'success',
      data: {
        total: 2,
        posts: [{title: 'Ourea is good!'}, {title: 'I am working on the skeleton'}]
      }
    };
  } else {
    return {
      status: 'failed',
      exception: caught('unknown error!')
    };
  }
}
async function getUidByAccessToken(accessToken: string): Promise<string> {
  accessToken;
  return 'eo_q7gynv67fjhqkrbsqvrdqvhdv_edlhoyqv6t';
}
async function verifyAndSaveRefreshToken(refreshToken: string, refreshedTokens: ServerTokens): Promise<Tokens> {
  refreshToken;
  refreshedTokens;
  return refreshedTokens.tokens;
}

export default ServerRoutes.router;
export { getAnonymousInfo };
