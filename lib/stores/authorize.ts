import { types } from 'mobx-state-tree';
import { caught, decrypt, encrypt, Tokens } from 'phusis';
import { OnlineUser } from 'server/user';
import { clientTokenSMD } from '../../server/db/descriptor/token';
import { userSMD } from '../../server/db/descriptor/user';
import config from '../config';

export const anoninfo = config.getAnonymousUserInfo();

const TOKEN_STK = config.keyOfTokensAtLocalStorage;
// tslint:disable-next-line: variable-name
const __local_tokens = {
  get(): Tokens {
    if (typeof localStorage !== 'undefined') {
      const lst = localStorage.getItem(TOKEN_STK) || '';
      if (lst) {
        try {
          return JSON.parse(decrypt(lst));
        } catch (e) {
          console.error(`You parsed an illegal token! [${lst}]`, e);
          return anoninfo.tokens;
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
export const TokenStore = types
  .model(clientTokenSMD)
  .actions((self) => ({
    getTokens(): Tokens {
      const newTokens = __local_tokens.get();
      Object.assign(self, newTokens);
      return newTokens;
    },
    setTokens(newTokens: Tokens): void {
      __local_tokens.set(newTokens);
      Object.assign(self, newTokens);
    },
    isAnonymous(): boolean {
      return self.access_token === anoninfo.tokens.access_token;
    }
  }))
  .extend((self) => ({
    actions: {
      updateTokens(newTokens?: Tokens): Tokens {
        let ntk = newTokens;
        if (!ntk) {
          ntk = self.getTokens();
        } else {
          self.setTokens(ntk);
        }
        return ntk;
      }
    }
  }));

export async function initializeTokenStore(
  isServer: boolean
): Promise<ReturnType<typeof TokenStore.create>> {
  if (!isServer) {
    return TokenStore.create(__local_tokens.get());
  }
  return TokenStore.create(anoninfo.tokens);
}

export const CurrentUserStore = types.model(userSMD).actions((self) => ({
  isAnonymous() {
    return self.user_id === anoninfo.user.user_id;
  },
  setUser(user: OnlineUser) {
    Object.assign(self, user);
  }
}));
