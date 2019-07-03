
import { join } from 'path';
import fetch from "isomorphic-unfetch";
import { applySnapshot, Instance, SnapshotIn, SnapshotOut, types, getSnapshot } from 'mobx-state-tree';
import { ClientQuery, makeEncryptedQuery, Tokens, Exception } from 'phusis';
import { DataResponse } from '../../server/types';

import { getAnonymousInfo, TokenStore, initializeTokens } from './authorize';
import { Snackbar, initializeSnackbar } from "./snackbar";

const URL_PREFIX = '/stuff';
const REFRESH_TOKEN_URL = join(URL_PREFIX, '/passport/refresh-token');

const Qs = types.model({
  name: types.identifier,
  status: types.string,
  data: types.frozen()
});

const Store = types
  .model({
    user_id: types.string,
    tokens: TokenStore,
    results: types.array(Qs),
    snackbar: Snackbar
  })
  .views(self => ({
    getResult(name: string) {
      return self.results.find(r => r.name === name);
    }
  }))
  .actions(self => ({
    putResult(result: { name: string, status: string, data?: any }) {
      const qs = self.results.find(r => r.name === result.name);
      if (qs) {
        Object.assign(qs, result);
      } else {
        self.results.push(result);
      }
    }
  }))
  .extend(self => ({
    actions: {
      async refreshTokens(): Promise<Tokens> {
        const currentTokens = self.tokens.getTokens();
        const response = await makeRequest(REFRESH_TOKEN_URL, currentTokens.access_token, {
          action: 'refresh_token',
          payload: currentTokens
        });
        self.tokens.updateTokens(response.result.data);
        return response.result.data as Tokens;
      }
    }
  }))
  .extend(self => ({
    actions: {
      async request(path: string, query: ClientQuery): Promise<DataResponse> {
        const current = Date.getCurrentStamp();
        let { access_token, expire_at } = self.tokens.getTokens();
        if (current > expire_at) {
          access_token = (await self.refreshTokens()).access_token;
        }
        const response = await makeRequest(join(URL_PREFIX, path), access_token, query);
        self.putResult({ name: response.query ? response.query.action : 'default', ...response.result });
        if (response.result.status !== 'success') {
          let ex = response.result.exception as Exception;
          if (ex && ex.message) {
            self.snackbar.warn(`${ex.message}(${ex.code})`);
          } else {
            self.snackbar.error('something went wrong!');
          }
        }
        return response;
      },
    }
  }));

export let store: IStore = null as any;

export type IStore = Instance<typeof Store>;
export type IStoreSnapshotIn = SnapshotIn<typeof Store>;
export type IStoreSnapshotOut = SnapshotOut<typeof Store>;

export const initializeStore = async (isServer: boolean) => {
  let inits;
  if (isServer) {
    inits = await getAnonymousInfo();
    store = Store.create({
      user_id: inits.user_id,
      tokens: initializeTokens(inits.tokens),
      snackbar: initializeSnackbar()
    });
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
export const takeSnapshot = () => {
  return getSnapshot(store);
};

async function makeRequest(url: string, access_token: string, query: ClientQuery): Promise<DataResponse> {
  const { credential, q } = makeEncryptedQuery(access_token, query);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ q }),
    headers: {
      credential, 'Content-Type': 'application/json'
    }
  });
  return response.json();
}
