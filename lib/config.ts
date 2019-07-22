import 'array-polyfill.js';
import { decodeByMap, md5, OnlineUserPack } from 'phusis';
import { resolve } from 'url';
import { OnlineUser } from '../server/user';

const {
  NS = process.env.NS,
  NAME = process.env.NAME,
  PORT = process.env.PORT,
  MONGO_PORT = process.env.PORT,
  MONGO_HOST = process.env.MONGO_HOST,
  MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE
} = {};
const dev = process.env.NODE_ENV === 'development';

const prodConfig = {
  // put production configurations here.
  // should match with `urlPrefix`, by request rewrite, nginx for example.
  dev: false,
  appPort: PORT || 8000,
  urlPrefix: 'http://ourea.imqx.com/',
  requestPrefix: `${md5(`${NS}-${NAME}`).substr(0, 7)}/`,
  dbUrl:
    `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}` +
    `/${MONGO_INITDB_DATABASE}?authSource=admin`
};

export class OureaConfig {
  [s: string]: any;
  dev: boolean = true;
  // put development configurations here.
  dbUrl = 'mongodb://root:root-sample-db@localhost:27017/ourea_db?authSource=admin';
  appPort: number = 3000;
  urlPrefix: string;
  requestPrefix: string = 'stuff/';
  doRequestPath: string = 'do';

  logo: { main: string; primary: string; secondary: string; transparent: string };
  icon: { main: string; primary: string; secondary: string; transparent: string };
  avatar: { male: string; female: string; unkown: string };
  background: { signin: string };
  anonymousInfo: OnlineUserPack<OnlineUser> = {
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
  keyOfTokensAtLocalStorage: string;
  crypto = {
    bit: 6,
    map: 'ScdmX7as2uiQ4fA0yZk3j6_qw-pBTGnHxz8LKErWVtDCRoYehN9IlUJ51FMbvgOP',
    join: '>@.<<',
    cipher: 'ourea_cipher'
  };
  constructor(isDev: boolean, prodCfg?: any) {
    this.urlPrefix = `http://localhost:${this.appPort}/`;
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
    this.keyOfTokensAtLocalStorage = md5('client-tokens');
    if (!isDev) {
      this.parseProdConfig(prodCfg);
    }
    this.dev = isDev;
  }
  prefixed(...paths: string[]): string {
    const pre = isUrl(paths[0]) ? '' : this.urlPrefix;
    return paths.reduce((url, path) => resolve(url, path), pre);
  }
  wrapRequestUrl(...paths: string[]): string {
    const pre = isUrl(paths[0]) ? '' : resolve(this.urlPrefix, this.requestPrefix);
    return paths.reduce((url, path) => resolve(url, path), pre);
  }
  getDoRequestUrl(): string {
    return this.wrapRequestUrl(this.doRequestPath);
  }
  getSigninUrl(): string {
    return this.prefixed(this.signinPath);
  }
  parseProdConfig(prodCfg?: any): OureaConfig {
    Object.assign(this, prodCfg);
    return this;
  }
  getAnonymousUserInfo(): OnlineUserPack<OnlineUser> {
    return this.anonymousInfo;
  }
}

let config: OureaConfig;
function isUrl(path: string) {
  return path && (path.indexOf('http://') === 0 || path.indexOf('https://') === 0);
}
function getConfig() {
  if (!config) {
    config = new OureaConfig(dev, prodConfig);
  }
  return config;
}

export default getConfig();
