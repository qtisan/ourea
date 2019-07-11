
import { Router, Request, Response, NextFunction } from "express";
import {
  handleQuery, refreshTokens,
  extractQuery, ExtractedQueryPack, caught
} from "phusis";
import { getUserInfoByTokens, verifyToken, executeQuery, getUidByAccessToken, verifyAndSaveRefreshToken } from "./user";
import config from "../lib/config";

class ServerRoutes { 
  static router: Router = Router();

  @post '/hello'(req: Request, res: Response): void {
    req && res.json({ message: 'hello, world.', data: req.body });
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

  @post async [`/${config.doRequestPath}`](req: Request, res: Response): Promise<void> {
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

  @post async [`/${config.currentUserPath}`](req: Request, res: Response): Promise<void> {
    const { credential, q } = res.locals;
    const eqp: ExtractedQueryPack = extractQuery(credential, q); 
    try {
      const userinfo = await getUserInfoByTokens(eqp && eqp.query.payload);
      req && res.json({
        result: {
          status: 'success',
          data: userinfo
        }
      });
    } catch (e) {
      res.json({
        result: {
          status: 'error',
          exception: caught('not exist')
        }
      });
    }
  }

  @post async [`/${config.refreshTokenPath}`](req: Request, res: Response): Promise<void> {
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

export default ServerRoutes.router;
