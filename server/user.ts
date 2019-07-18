import { caught, makeTokens, OnlineUserPack, ServerTokens, Tokens } from 'phusis';
import { anoninfo } from '../lib/stores/authorize';
import { makeError } from './errors';

export interface OnlineUser {
  user_id: string;
  username: string;
  avatar: string;
}

export const userinfo = {
  user: {
    user_id: 'eo_q7gynv67fjhqkrbsqvrdqvhdv_edlhoyqv6t',
    username: 'qtisan@hotmail.com',
    avatar: '/static/images/ourea_avatar-male.svg'
  },
  serverTokens: {
    tokenKey: '=yM2IyM0IyNvdXJlYV9hdXRoX2NpcGhlcg=I',
    refreshKey: '=yM4IyM0IyNvdXJlYV9hdXRoX2NpcGhlcg=I',
    refreshExpire: 1563185789,
    tokens: {
      access_token:
        'zIRUzt4yCA3PuVTAitTlt1ahY5WeCPNPxVy0CA3PiVf8H2xkzVM5TAxZYZO9Y1RPH1-5HZa9xZO0xyfyiE93n1y9xAiUCP' +
        'NPitONYtRyCA39T2uIG2C1B7QFGtT',
      refresh_token:
        'zIRUzt4yCA3PHZWZHZWlY-fUn5wynPCqCkWjiKCbCZWht1X1i1yexAu1iZj3HVwIukT9xkR0Hti3iDi8iVaqYEfMHtu5xK' +
        'CqCZWFHEyIisCbB2r5BlXFT2HFGtT',
      expire_at: 1562927189
    }
  },
  user_password: '5c0d9e7fd4c4684bd94a8a3297833f28'
};

export async function getUidByAccessToken(accessToken: string): Promise<string> {
  if (!accessToken) {
    throw caught('access_token should not be empty!');
  }
  return userinfo.user.user_id;
}
export async function verifyAndSaveRefreshToken(
  refreshToken: string,
  refreshedTokens: ServerTokens
): Promise<Tokens> {
  if (refreshToken && userinfo.serverTokens.refreshExpire < Date.getCurrentStamp()) {
    // TODO: mock expired refresh token. save to file for mocking.
    throw makeError(432);
  } else {
    return refreshedTokens.tokens;
  }
}
export async function getUserInfoByAccessToken(
  accessToken?: string
): Promise<OnlineUserPack<OnlineUser> & { expired: boolean }> {
  if (accessToken === userinfo.serverTokens.tokens.access_token) {
    return {
      user: userinfo.user,
      tokens: userinfo.serverTokens.tokens,
      expired: userinfo.serverTokens.refreshExpire < Date.getCurrentStamp()
    };
  }
  return { user: anoninfo.user, tokens: anoninfo.tokens, expired: false };
}
export async function getUserInfoByPassword({
  username,
  password
}: {
  username: string;
  password: string;
}) {
  if (password === userinfo.user_password && username === userinfo.user.username) {
    // TODO: save to redis.
    userinfo.serverTokens = makeTokens(userinfo.user.user_id);
    return {
      user: userinfo.user,
      tokens: userinfo.serverTokens.tokens
    };
  }
  throw makeError(441);
}
