import { NextFunction, Request, Response, Router } from 'express';
import {
  decodeByMap,
  encodeByMap,
  Exception,
  extractQuery,
  isError,
  isException,
  ResponseStatus
} from 'phusis';
import config from '../lib/config';
import { anoninfo } from '../lib/stores/authorize';
import { errswitch, makeError } from './errors';
import { ActionResponseDataType, ActionType, dispatch } from './services';
import { ClientQuery } from './services';
import { getUserInfoByAccessToken, OnlineUser } from './user';

declare module 'express' {
  interface Response {
    locals: {
      query: ClientQuery<any>;
      user: OnlineUser;
      credential: string;
      q: string;
    };
    respond<A extends ActionType>(
      status: ResponseStatus,
      data?: ActionResponseDataType<A>,
      query?: ClientQuery<A>,
      exception?: Exception,
      user?: OnlineUser
    ): Response;
    reply<A extends ActionType>(data: ActionResponseDataType<A>): Response;
    fail(exception: Exception | Error | string | number, status?: number): Response;
  }
}

class ServerRoutes {
  static router: Router = Router();

  @use async 'append respond method'(req: Request, res: Response, next: NextFunction) {
    res.respond = <A extends ActionType>(
      status: ResponseStatus,
      data: ActionResponseDataType<A>,
      query?: ClientQuery<A>,
      exception?: Exception,
      user?: OnlineUser
    ) => {
      const asset = {
        result: {
          status,
          data,
          exception: status === 'fail' && exception ? exception.code : undefined
        },
        query: query || ({ action: 'system/noop', payload: req.body.q } as ClientQuery<A>),
        user: user || anoninfo.user
      };
      const code = status === 'success' ? 200 : exception ? exception.code : 500;
      res.status(code).json({ r: encodeByMap(JSON.stringify(asset), { ...config.crypto }) });
      return res;
    };
    await next();
  }

  @use async 'check credential'(req: Request, res: Response, next: NextFunction) {
    const credential = req.header('credential');
    const q = req.body.q;
    if (!credential || !q) {
      failed(res)(400);
      return;
    }
    res.locals.credential = credential;
    res.locals.q = q;
    try {
      const { token, query } = extractQuery(credential, q, {
        remix: (code: string) => decodeByMap(code, { ...config.crypto }) as string
      });
      res.locals.query = query as ClientQuery<any>;
      const userinfo = await getUserInfoByAccessToken(token);
      res.locals.user = userinfo.user;
      if (
        userinfo.expired &&
        query.action !== 'passport/refresh-token' &&
        query.action !== 'passport/current-user'
      ) {
        failed(res, userinfo.user, query as ClientQuery<any>)(431);
        return;
      }
      if (query.action === 'passport/current-user') {
        res.locals.query.payload = { expired: userinfo.expired };
      }
      await next();
    } catch (e) {
      failed(res)(errswitch(e, 500));
    }
  }

  @post async [`/${config.doRequestPath}`](req: Request, res: Response): Promise<void> {
    const { user, query } = res.locals;
    res.reply = <A extends ActionType>(data: ActionResponseDataType<A>) =>
      res.respond<A>('success', data, query, undefined, user);
    res.fail = failed(res, user, query);
    try {
      const { status, exception, data } = await dispatch({ user, query });
      if (status === 'fail') {
        res.fail(exception || 600);
      } else if (status === 'success') {
        res.reply(data as any);
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

function failed<A extends ActionType>(res: Response, user?: OnlineUser, query?: ClientQuery<A>) {
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
    res.respond('fail', undefined, query, ex, user);
    return res;
  };
}

export default ServerRoutes.router;
