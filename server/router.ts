import { NextFunction, Request, Response, Router } from 'express';
import { ClientQuery, Exception, extractQuery, isError, isException, refreshTokens } from 'phusis';
import config from '../lib/config';
import { anoninfo } from '../lib/stores/authorize';
import { errswitch, makeError } from './errors';
import { DataResponse, OnlineUser, ResponseStatus } from './types';
import {
  executeQuery,
  getUidByAccessToken,
  getUserInfoByAccessToken,
  verifyAndSaveRefreshToken
} from './user';

declare module 'express' {
  interface Response {
    locals: {
      query: ClientQuery;
      user: OnlineUser;
      credential: string;
      q: string;
    };
    respond<T = any>(
      data: T,
      status: ResponseStatus,
      query?: ClientQuery,
      exception?: Exception,
      user?: OnlineUser
    ): Response;
    reply<T>(data: T): Response;
    fail(exception: Exception | Error | string | number, status?: number): Response;
  }
}

class ServerRoutes {
  static router: Router = Router();

  @use async 'append respond method'(req: Request, res: Response, next: NextFunction) {
    res.respond = <T>(
      data: T,
      status: ResponseStatus,
      query?: ClientQuery,
      exception?: Exception,
      user?: OnlineUser
    ) => {
      const asset: DataResponse<T> = {
        result: { status, data, exception },
        query: query || { action: 'q', payload: req.body.q },
        user: user || anoninfo.user
      };
      const code = status === 'success' ? 200 : exception ? exception.code : 500;
      res.status(code).json(asset);
      return res;
    };
    await next();
  }

  @post async [`/${config.refreshTokenPath}`](req: Request, res: Response): Promise<void> {
    const credential = req.header('credential');
    const q = req.body.q;
    if (!credential || !q) {
      failed(res)(400);
      return;
    }
    try {
      const { query } = extractQuery(credential, q);
      const newTokens = await refreshTokens(
        query.payload,
        getUidByAccessToken,
        verifyAndSaveRefreshToken
      );
      res.respond(newTokens, 'success', query);
    } catch (e) {
      failed(res)(errswitch(e, 432));
    }
  }

  @use async 'check credential'(req: Request, res: Response, next: NextFunction) {
    const credential = req.header('credential');
    const q = req.body.q;
    if (!credential || !q) {
      failed(res)(400);
      return;
    }
    try {
      const { token, query } = extractQuery(credential, q);
      const userinfo = await getUserInfoByAccessToken(token);
      res.locals.query = query;
      res.locals.user = userinfo.user;
      res.locals.credential = credential;
      res.locals.q = q;
      await next();
    } catch (e) {
      failed(res)(errswitch(e, 431));
    }
  }

  @post async [`/${config.doRequestPath}`](req: Request, res: Response): Promise<void> {
    const { user, query } = res.locals;
    res.reply = <T>(data: T) => res.respond(data, 'success', query, undefined, user);
    res.fail = failed(res, user);
    try {
      const { status, exception, data } = await executeQuery({ user, query });
      if (status === 'fail') {
        res.fail(exception || 600);
      } else if (status === 'success') {
        res.reply(data);
      } else {
        res.fail(req.body.q, 600);
      }
    } catch (err) {
      res.fail(err, 600);
    }
  }
}

function post(target: ServerRoutes, propertyKey: string, descriptor: PropertyDescriptor) {
  if (target) {
    ServerRoutes.router.post(propertyKey, descriptor.value);
  }
}
function use(target: ServerRoutes, propertyKey: string, descriptor: PropertyDescriptor) {
  if (target && propertyKey) {
    ServerRoutes.router.use(descriptor.value);
  }
}

function failed(res: Response, user?: OnlineUser) {
  return (
    exception: Exception | Error | string | number = makeError(500),
    status: number = 500
  ) => {
    let ex: Exception;
    if (isError(exception)) {
      ex = makeError(status || 500, exception as Error);
    } else if (typeof exception === 'string') {
      ex = makeError(status || 550, new Error(exception as string));
    } else if (isException(exception)) {
      ex = exception as Exception;
    } else if (typeof exception === 'number') {
      ex = makeError(exception as number);
    } else {
      ex = makeError(900);
    }
    res.respond(null, 'fail', undefined, ex, user);
    return res;
  };
}

export default ServerRoutes.router;
