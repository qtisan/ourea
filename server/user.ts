import { caught, ExecuteQueryPayload, OnlineUserPack, ServerTokens, Tokens } from 'phusis';
import { anoninfo } from '../lib/stores/authorize';
import { makeError } from './errors';
import { dispatch } from './services';
import { OnlineUser, QueryResult } from './types';

export const userinfo = {
  user: {
    user_id: 'eo_q7gynv67fjhqkrbsqvrdqvhdv_edlhoyqv6t',
    username: 'Lennon',
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
  }
};

export async function executeQuery({
  user,
  query
}: ExecuteQueryPayload<OnlineUser>): Promise<QueryResult> {
  // dispatch query with action and user with permission
  try {
    const data = await dispatch({ user, ...query });
    return { status: 'success', data };
  } catch (e) {
    return { status: 'fail', data: null, exception: e };
  }
}
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
  if (refreshToken.indexOf('Q') === refreshToken.length - 1) {
    // mock expired refresh token.
    throw caught('refresh token expired.', 9009);
  } else {
    return refreshedTokens.tokens;
  }
}
export async function getUserInfoByAccessToken(
  accessToken?: string
): Promise<OnlineUserPack<OnlineUser>> {
  if (!accessToken || accessToken === anoninfo.tokens.access_token) {
    // no tokens supplies, return anonymous info.
    return anoninfo;
  } else {
    // try to compare the token expire time at database, and get user.
    const currentUserInfo = userinfo;
    if (currentUserInfo.serverTokens.tokens.expire_at < Date.getCurrentStamp()) {
      throw makeError(431);
    } else {
      return { user: currentUserInfo.user, tokens: currentUserInfo.serverTokens.tokens };
    }
  }
}
