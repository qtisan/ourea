import { Tokens, decrypt, encrypt } from "phusis";
import { types } from "mobx-state-tree";

const TOKEN_STK = 'client-tokens';
const emptyTokens = { access_token: '', refresh_token: '', expire_at: 0 };
const localTokens = {
  get(): Tokens {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(decrypt(
        localStorage.getItem(TOKEN_STK) || JSON.stringify(emptyTokens)
      ));
    } else {
      return emptyTokens;
    }
  },
  set(tokens: Tokens): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STK, encrypt(JSON.stringify(tokens)));
    }
  }
};

export const TokenStore = types.model({
  access_token: types.string,
  refresh_token: types.string,
  expire_at: types.number
}).actions(self => ({
  updateTokens(newTokens?: Tokens): void {
    localTokens.set(newTokens || self);
    Object.assign(self, newTokens);
  },
  getTokens(): Tokens {
    const newTokens = localTokens.get();
    Object.assign(self, newTokens);
    return newTokens;
  }
}));

export const initializeTokens = (snapshot: Tokens) => {
  return TokenStore.create(snapshot);
};

const getAnonymousInfo = async (): Promise<{ user_id: string, tokens: Tokens }> => {
  return {
    user_id: 'fe5261b9-9d9e-524a-95e2-0469e6f8030b',
    tokens: {
      access_token: 'zIRUzt4yCA3PuVTAitTlt1ahY5WeCPNPxVy0CA3PiZrJBAu9uA0wGV7MisUJBAaOp20Ji2CwBm75GVr5iALNBl4PCPNPitONYtRyCA39T2u9G27MBAul84',
      refresh_token: 'zIRUzt4yCA3PHZWZHZWlY-fUn5wynPCqCkWjiKCbCZiyT2C5BVCMp2y0GVrwT2CUusUMTVrIp2QUTAyyTZuFBmBNuPCqCZWFHEyIisCbB2r5BACNTlL5BNQQQDT',
      expire_at: 2961949263
    }
  };
};

export { getAnonymousInfo };
