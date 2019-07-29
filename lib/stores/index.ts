import fetch from 'isomorphic-unfetch';
import {
  applySnapshot,
  getSnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types
} from 'mobx-state-tree';
import {
  decodeByMap,
  encodeByMap,
  Exception,
  makeEncryptedQuery,
  ResponseStatus,
  Tokens
} from 'phusis';

import Router from 'next/router';
import { makeError } from '../../server/errors';
import {
  ActionResponseDataType,
  ActionType,
  ClientQuery,
  QueryResponse
} from '../../server/services';
import { OnlineUser } from '../../server/user';
import config from '../config';
import { anoninfo, CurrentUserStore, initializeTokenStore, TokenStore } from './authorize';
import { initializeSnackbar, Snackbar } from './snackbar';
const Qs = types.model({
  action: types.identifier,
  status: types.string,
  data: types.frozen()
});

// TODO: add page loading state, and ui component.
const Store = types
  .model({
    loading: types.number,
    isSignin: types.boolean,
    currentUser: CurrentUserStore,
    tokens: TokenStore,
    results: types.array(Qs),
    snackbar: Snackbar
  })
  .views((self) => ({
    getResult<A extends ActionType>(action: A) {
      return self.results.find((r) => r.action === action);
    },
    isLoading() {
      return self.loading !== 100;
    }
  }))
  .actions((self) => ({
    putResult<A extends ActionType>(result: {
      action: A;
      status: ResponseStatus;
      data?: ActionResponseDataType<A>;
    }) {
      const qs = self.results.find((r) => r.action === result.action);
      if (qs) {
        Object.assign(qs, result);
      } else {
        self.results.push(result);
      }
    },
    errorTip<A extends ActionType>(
      response: QueryResponse<A>,
      failCallback?: (exception?: Exception) => boolean
    ) {
      const failed = response.result.status !== 'success';
      if (failed) {
        const ex = response.result.exception;
        let ctn = true;
        if (failCallback) {
          ctn = failCallback.call(self, ex);
        }
        if (ctn && ex && ex.message) {
          self.snackbar.warn(`${ex.message}(${ex.code})`);
        } else if (ctn) {
          self.snackbar.error('something went wrong!');
        }
      }
      return failed;
    },
    setIsSignin(isSignin: boolean) {
      self.isSignin = isSignin;
    },
    setLoadingAmount(amount: number) {
      self.loading = amount;
    }
  }))
  .extend((self) => ({
    actions: {
      setLoaded() {
        self.setLoadingAmount(100);
      },
      setLoading() {
        let handler: NodeJS.Timeout;
        if (self.loading === 100) {
          self.setLoadingAmount(0);
          handler = setInterval(() => {
            if (self.loading === 100) {
              clearInterval(handler);
            } else {
              self.setLoadingAmount(Math.min(self.loading + Math.random() * 10, 99));
            }
          }, 500);
        } else {
          self.setLoadingAmount(Math.min(self.loading + Math.random() * 5, 99));
        }
      },
      async refreshTokens(): Promise<QueryResponse<'passport/refresh-token'>> {
        const currentTokens = self.tokens.getTokens();
        const response = await makeRequest(config.getDoRequestUrl(), currentTokens.access_token, {
          action: 'passport/refresh-token',
          payload: currentTokens
        });
        if (
          !self.errorTip(response, (ex) => {
            if (ex && ex.code === 432) {
              // refresh token expired.
              redirectToSignin();
              return false;
            }
            // other errors.
            return true;
          }) &&
          response.result.data
        ) {
          const tokens: Tokens = response.result.data;
          self.tokens.updateTokens(tokens);
        }
        return response;
      }
    }
  }))
  .extend((self) => ({
    actions: {
      async request<A extends ActionType>(
        path: string,
        query: ClientQuery<A>
      ): Promise<QueryResponse<A>> {
        const current = Date.getCurrentStamp();
        const tks = self.tokens.getTokens();
        const expire_at = tks.expire_at;
        let access_token = tks.access_token;
        if (current > expire_at && query.action !== 'passport/signin') {
          const refreshResponse = await self.refreshTokens();
          if (refreshResponse.result.status !== 'success') {
            return refreshResponse as any;
          }
          access_token = self.tokens.access_token;
        }
        const response = await makeRequest(config.wrapRequestUrl(path), access_token, query);
        self.putResult({
          action: response.query.action,
          ...response.result
        });
        self.errorTip(response);
        return response;
      }
    }
  }))
  .extend((self) => ({
    actions: {
      async do<A extends ActionType>(query: ClientQuery<A>): Promise<QueryResponse<A>> {
        return await self.request(config.doRequestPath, query);
      }
    }
  }))
  .extend((self) => ({
    actions: {
      async signin(username: string, password: string) {
        const { result } = await self.do({
          action: 'passport/signin',
          payload: { username, password }
        });
        if (result.status === 'success' && result.data) {
          const { user, tokens } = result.data;
          self.tokens.updateTokens(tokens);
          self.currentUser.setUser(user);
          self.setIsSignin(true);
          self.snackbar.success('Signin success, redirecting...');
          const { router } = Router;
          let redirectPath = '/manage';
          if (router && router.query && router.query.redirect) {
            redirectPath = router.query.redirect as string;
          }
          Router.replace(redirectPath);
        }
      },
      async signout() {
        // TODAY: add signout logic.
        self.isSignin = false;
        redirectToSignin();
      }
    }
  }));

export let store: IStore = null as any;

export type IStore = Instance<typeof Store>;
export type IStoreSnapshotIn = SnapshotIn<typeof Store>;
export type IStoreSnapshotOut = SnapshotOut<typeof Store>;

export const initializeStore = (isServer: boolean, initialState?: any) => {
  if (isServer || !store) {
    store = Store.create({
      loading: 100,
      isSignin: false,
      tokens: TokenStore.create(anoninfo.tokens),
      currentUser: CurrentUserStore.create(anoninfo.user),
      snackbar: initializeSnackbar()
    });
  }
  if (initialState) {
    applySnapshot(store, initialState);
  }
  if (typeof window !== 'undefined') {
    // TODAY: add the whole page loading state, while the response not ready.
    fetchInitialState().then((snapshot) => {
      applySnapshot(store, snapshot);
    });
  }
  return store;
};

export async function makeRequest<A extends ActionType>(
  url: string,
  accessToken: string,
  query: ClientQuery<A>
): Promise<QueryResponse<A>> {
  const { credential, q } = makeEncryptedQuery(accessToken, query, {
    mix: (code: string) => encodeByMap(code, { ...config.crypto }) as string
  });
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ q, ...(config.dev ? { debug: { accessToken, query } } : {}) }),
    headers: {
      credential,
      'Content-Type': 'application/json'
    }
  });
  const responseJson = await response.json();
  if (responseJson.r) {
    const j = JSON.parse(decodeByMap(responseJson.r, { ...config.crypto }));
    if (j.result.exception) {
      j.result.exception = makeError(j.result.exception);
    }
    return j as QueryResponse<A>;
  }
  throw makeError(551);
}

async function fetchInitialState(isServer: boolean = typeof window === 'undefined') {
  const tokenStore = await initializeTokenStore(isServer);
  const currentUserResponse = await makeRequest(config.getDoRequestUrl(), tokenStore.access_token, {
    action: 'passport/current-user',
    payload: { expired: true }
  });
  const { status, exception, data } = currentUserResponse.result;
  let currentUserStore;
  let isSignin = false;
  if (status === 'success' && data) {
    currentUserStore = CurrentUserStore.create(data.user as OnlineUser);
    isSignin = data.expired && store.isSignin;
  } else {
    currentUserStore = CurrentUserStore.create(anoninfo.user);
    console.warn('current user error', exception);
  }
  // TODO: if user is signin & at signin page, redirect inner.
  return getSnapshot(
    Store.create({
      loading: 100,
      isSignin,
      tokens: tokenStore,
      currentUser: currentUserStore,
      snackbar: initializeSnackbar()
    })
  );
}

function redirectToSignin() {
  const { router } = Router;
  let signinPath = '/passport/signin';
  if (router && router.pathname) {
    signinPath += `?redirect=${router.pathname}`;
  }
  Router.replace(signinPath);
}
