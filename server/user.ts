import { OnlineUser, QueryResult } from "./types";
import { ExecuteQueryPayload, caught, ServerTokens, Tokens, refreshTokens, OnlineUserPack } from "phusis";
import { anoninfo } from "../lib/stores/authorize";

export const userinfo = {
  user: {
    user_id: 'eo_q7gynv67fjhqkrbsqvrdqvhdv_edlhoyqv6t',
    username: 'Lennon',
    avatar: '/static/images/ourea_avatar-male.svg'
  }
}


export async function verifyToken(accessToken: string): Promise<OnlineUser> {
  accessToken;
  return userinfo.user;
}
export async function executeQuery({ user, query }: ExecuteQueryPayload<OnlineUser>): Promise<QueryResult> {
  if (user && query && query.action === 'test') {
    return {
      status: 'success',
      data: {
        total: 2,
        posts: [{ title: 'Ourea is good!' }, { title: 'I am working on the skeleton' }]
      }
    };
  } else {
    return {
      status: 'failed',
      exception: caught('unknown error!')
    };
  }
}
export async function getUidByAccessToken(accessToken: string): Promise<string> {
  accessToken;
  return userinfo.user.user_id;
}
export async function verifyAndSaveRefreshToken(refreshToken: string, refreshedTokens: ServerTokens): Promise<Tokens> {
  refreshedTokens;
  if (refreshToken.indexOf('Q') === refreshToken.length - 1) { // mock expired refresh token.
    throw caught('refresh token expired.', 9009);
  } else {
    return refreshedTokens.tokens;
  }
}
export async function getUserInfoByTokens(tokens?: Tokens): Promise<OnlineUserPack<OnlineUser>> {
  if (!tokens) { // no tokens supplies, return anonymous info.
    return anoninfo;
  } else if (tokens.expire_at < Date.getCurrentStamp()) {
    // get user info from db when access_token is correct and do not expired, otherwise refresh.
    const newTokens = await refreshTokens(tokens, getUidByAccessToken, verifyAndSaveRefreshToken);
    return { ...userinfo, tokens: newTokens };
  } else {
    return { ...userinfo, tokens };
  }
};
