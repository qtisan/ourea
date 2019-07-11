import { Tokens, decrypt, encrypt, caught } from "phusis";
import { types } from "mobx-state-tree";
import config from "../config";


export const anoninfo = config.getAnonymousUserInfo();

const TOKEN_STK = config.keyOfTokensAtLocalStorage;
const __local_tokens = {
  get(): Tokens {
    if (typeof localStorage !== 'undefined') {
      const lst = localStorage.getItem(TOKEN_STK) || '';
      if (lst) {
        try {
          return JSON.parse(decrypt(lst));
        } catch (e) {
          throw caught(e, `You parsed an illegal token! [${lst}]`);
        }
      } else {
        return anoninfo.tokens;
      }
    } else {
      throw caught(`You set tokens to localStorage, but it not exist.`);
    }
  },
  set(tokens: Tokens): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STK, encrypt(JSON.stringify(tokens)));
    } else {
      console.warn(`You set tokens to localStorage, but it not exist.`);
    }
  }
};

export const TokenStore = types.model({
  access_token: types.string,
  refresh_token: types.string,
  expire_at: types.number
}).actions(self => ({
  updateTokens(newTokens?: Tokens): void {
    __local_tokens.set(newTokens || self);
    Object.assign(self, newTokens);
  },
  getTokens(): Tokens {
    const newTokens = __local_tokens.get();
    Object.assign(self, newTokens);
    return newTokens;
  },
  isAnonymous(): boolean {
    return isAnonymous(self);
  }
}));
export const CurrentUserStore = types.model({
  user_id: types.string,
  username: types.string,
  avatar: types.string
}).actions(self => ({
  isAnonymous() {
    return self.user_id === anoninfo.user.user_id;
  }
}));

export function isAnonymous(tokens?: Tokens): boolean {
  if (tokens) {
    return tokens.access_token === anoninfo.tokens.access_token;
  }
  return __local_tokens.get().access_token === anoninfo.tokens.access_token;
}
