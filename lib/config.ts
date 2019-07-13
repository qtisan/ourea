import 'array-polyfill.js';
import { md5, OnlineUserPack } from 'phusis';
import { resolve } from 'url';
import { OnlineUser } from '../server/types';

const dev = process.env.NODE_ENV === 'development';

const prodConfig = {
  // put production configurations here.
  // should match with `urlPrefix`, by request rewrite, nginx for example.
  appPort: 9899,
  urlPrefix: 'http://ourea.imqx.com/',
  requestPrefix: `${md5('ourea').substr(0, 7)}/`,
  refreshTokenPath: md5('passport/refresh-token')
};

export class OureaConfig {
  [s: string]: any;
  appPort: number;
  urlPrefix: string;
  requestPrefix: string;

  refreshTokenPath: string;
  doRequestPath: string;
  currentUserPath: string;

  logo: { main: string; primary: string; secondary: string; transparent: string };
  icon: { main: string; primary: string; secondary: string; transparent: string };
  avatar: { male: string; female: string; unkown: string };
  background: { signin: string };
  anonymousInfo: OnlineUserPack<OnlineUser>;
  keyOfTokensAtLocalStorage: string;
  constructor(isDev: boolean, prodCfg?: any) {
    // put development configurations here.
    this.appPort = 3000;
    this.urlPrefix = `http://localhost:${this.appPort}/`;
    this.requestPrefix = 'stuff/';
    this.refreshTokenPath = 'passport/refresh-token';
    this.doRequestPath = 'do';
    this.currentUserPath = 'passport/current-user';
    this.logo = {
      main: this.prefixed('static/images/ourea_brand-main.svg'),
      primary: this.prefixed('static/images/ourea_brand-primary.svg'),
      secondary: this.prefixed('static/images/ourea_brand-secondary.svg'),
      transparent: this.prefixed('static/images/ourea_brand-transparent.svg')
    };
    this.icon = {
      main: this.prefixed('static/images/ourea_icon-main.svg'),
      primary: this.prefixed('static/images/ourea_icon-primary.svg'),
      secondary: this.prefixed('static/images/ourea_icon-secondary.svg'),
      transparent: this.prefixed('static/images/ourea_icon-transparent.svg')
    };
    this.avatar = {
      male: this.prefixed('static/images/ourea_avatar-male.svg'),
      female: this.prefixed('static/images/ourea_avatar-female.svg'),
      unkown: this.prefixed('static/images/ourea_avatar-unkown.svg')
    };
    this.background = {
      signin: this.prefixed('static/images/ourea_bg.jpg')
    };
    this.anonymousInfo = {
      user: {
        user_id: 'fe5261b9-9d9e-524a-95e2-0469e6f8030b',
        username: 'Anonymous',
        avatar: 'static/images/ourea_avatar-unkown.svg'
      },
      tokens: {
        access_token:
          'zIRUzt4yCA3PuVTAitTlt1ahY5WeCPNPxVy0CA3PiZrJBAu9uA0wGV7MisUJBAaOp20Ji2CwBm75GVr5iALNBl4P' +
          'CPNPitONYtRyCA39T2u9G27MBAul84',
        refresh_token:
          'zIRUzt4yCA3PHZWZHZWlY-fUn5wynPCqCkWjiKCbCZiyT2C5BVCMp2y0GVrwT2CUusUMTVrIp2QUTAyyTZuFBmBN' +
          'uPCqCZWFHEyIisCbB2r5BACNTlL5BNQQQDT',
        expire_at: 2961949263
      }
    };
    this.keyOfTokensAtLocalStorage = md5('client-tokens');
    if (!isDev) {
      this.parseProdConfig(prodCfg);
    }
  }
  prefixed(...paths: string[]): string {
    const pre = isUrl(paths[0]) ? '' : this.urlPrefix;
    return paths.reduce((url, path) => resolve(url, path), pre);
  }
  wrapRequestUrl(...paths: string[]): string {
    const pre = isUrl(paths[0]) ? '' : resolve(this.urlPrefix, this.requestPrefix);
    return paths.reduce((url, path) => resolve(url, path), pre);
  }
  getRefreshTokenUrl(): string {
    return this.wrapRequestUrl(this.refreshTokenPath);
  }
  getCurrentUserUrl(): string {
    return this.wrapRequestUrl(this.currentUserPath);
  }
  getDoRequestUrl(): string {
    return this.wrapRequestUrl(this.doRequestPath);
  }
  parseProdConfig(prodCfg?: any): OureaConfig {
    Object.assign(this, prodCfg);
    return this;
  }
  getAnonymousUserInfo(): OnlineUserPack<OnlineUser> {
    return this.anonymousInfo;
  }
}

export default new OureaConfig(dev, prodConfig);

function isUrl(path: string) {
  return path && (path.indexOf('http://') === 0 || path.indexOf('https://') === 0);
}
