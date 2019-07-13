import fetch from 'isomorphic-unfetch';
import { applySnapshot, Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { ClientQuery, Exception, makeEncryptedQuery, Tokens } from 'phusis';
import { DataResponse } from '../../server/types';

import config from '../config';
import { anoninfo, CurrentUserStore, TokenStore } from './authorize';
import { initializeSnackbar, Snackbar } from './snackbar';
const Qs = types.model({
  name: types.identifier,
  status: types.string,
  data: types.frozen()
});

const Store = types
  .model({
    currentUser: CurrentUserStore,
    tokens: TokenStore,
    results: types.array(Qs),
    snackbar: Snackbar
  })
  .views((self) => ({
    getResult(name: string) {
      return self.results.find((r) => r.name === name);
    }
  }))
  .actions((self) => ({
    putResult(result: { name: string; status: string; data?: any }) {
      const qs = self.results.find((r) => r.name === result.name);
      if (qs) {
        Object.assign(qs, result);
      } else {
        self.results.push(result);
      }
    }
  }))
  .extend((self) => ({
    actions: {
      async refreshTokens(): Promise<Tokens> {
        const currentTokens = self.tokens.getTokens();
        const response = await makeRequest(
          config.getRefreshTokenUrl(),
          currentTokens.access_token,
          {
            action: 'refresh_token',
            payload: currentTokens
          }
        );
        self.tokens.updateTokens(response.result.data);
        return response.result.data as Tokens;
      }
    }
  }))
  .extend((self) => ({
    actions: {
      async request(path: string, query: ClientQuery): Promise<DataResponse> {
        const current = Date.getCurrentStamp();
        const tks = self.tokens.getTokens();
        const expire_at = tks.expire_at;
        let access_token = tks.access_token;
        if (current > expire_at) {
          access_token = (await self.refreshTokens()).access_token;
        }
        const response = await makeRequest(config.wrapRequestUrl(path), access_token, query);
        self.putResult({
          name: response.query ? response.query.action : 'default',
          ...response.result
        });
        if (response.result.status !== 'success') {
          const ex = response.result.exception;
          if (ex && ex.message) {
            self.snackbar.warn(`${ex.message}(${ex.code})`);
          } else {
            self.snackbar.error('something went wrong!');
          }
        }
        return response;
      }
    }
  }))
  .extend((self) => ({
    actions: {
      async do(query: ClientQuery): Promise<DataResponse> {
        return await self.request(config.doRequestPath, query);
      }
    }
  }));

export let store: IStore = null as any;

export type IStore = Instance<typeof Store>;
export type IStoreSnapshotIn = SnapshotIn<typeof Store>;
export type IStoreSnapshotOut = SnapshotOut<typeof Store>;

export const initializeStore = async (isServer: boolean) => {
  if (isServer || !store) {
    store = Store.create({
      currentUser: CurrentUserStore.create(anoninfo.user),
      tokens: TokenStore.create(anoninfo.tokens),
      snackbar: initializeSnackbar()
    });
  }
  if (!isServer) {
    const currentTokens = store.tokens.getTokens();
    if (store.tokens.isAnonymous() && !store.currentUser.isAnonymous()) {
      applySnapshot(store.currentUser, anoninfo.user);
    }
    if (!store.tokens.isAnonymous() && store.currentUser.isAnonymous()) {
      const response = await makeRequest(config.getCurrentUserUrl(), currentTokens.access_token, {
        action: 'current-user',
        payload: currentTokens
      });
      applySnapshot(store.currentUser, response.result.data.user);
    }
  }
  return store;
};
export const constructStore = (isServer: boolean, initialState: any) => {
  if ((store as any) === null) {
    store = Store.create(initialState);
  } else if (initialState) {
    applySnapshot(store, initialState);
  }
  if (!isServer) {
    store.tokens.updateTokens();
  }
  return store;
};

export async function makeRequest<D = any>(
  url: string,
  accessToken: string,
  query: ClientQuery
): Promise<DataResponse<D>> {
  const { credential, q } = makeEncryptedQuery(accessToken, query);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ q }),
    headers: {
      credential,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
