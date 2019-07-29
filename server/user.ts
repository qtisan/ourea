import { makeTokens, OnlineUserPack, Tokens } from 'phusis';
import { anoninfo } from '../lib/stores/authorize';
import * as db from './db';
import { makeError } from './errors';

export interface OnlineUser extends db.ModelInterface<'user'> {}

export async function refreshTokens(tokens: Tokens): Promise<Tokens> {
  const token = await db.getModel('token').findOne({ 'tokens.access_token': tokens.access_token });
  if (!token) {
    throw makeError(440);
  }
  if (token.refreshExpire < Date.getCurrentStamp()) {
    throw makeError(432);
  }
  const newToken = makeTokens(token.user_id);
  Object.assign(token, newToken);
  const res = await token.save();
  if (!res) {
    throw makeError(440);
  }
  return token.tokens;
}
export async function getUserInfoByAccessToken(
  accessToken?: string
): Promise<OnlineUserPack<OnlineUser> & { expired: boolean }> {
  const token = await db.getModel('token').findOne({ 'tokens.access_token': accessToken });
  if (!token) {
    return { user: anoninfo.user, tokens: anoninfo.tokens, expired: false };
  }
  const user = await db.getModel('user').findOne({ user_id: token.user_id });
  if (!user) {
    throw makeError(440);
  }
  return { user, tokens: token.tokens, expired: token.refreshExpire < Date.getCurrentStamp() };
}
export async function getUserInfoByPassword({
  username,
  password
}: {
  username: string;
  password: string;
}) {
  const user = await db.getModel('user').findOne({ username });
  if (!user) {
    throw makeError(442);
  }
  const token = await db.getModel('token').findOne({ user_password: password });
  if (!token || token.user_id !== user.user_id) {
    throw makeError(441);
  }
  const newTokens = makeTokens(token.user_id);
  const res = await db.getModel('token').updateOne({ user_id: token.user_id }, newTokens);
  if (res) {
    return {
      user,
      tokens: newTokens.tokens
    };
  }
  throw makeError(621);
}
