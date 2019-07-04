import { resolve } from "url";

const dev = process.env.NODE_ENV === 'development';
const urlPrefix = 'http://localhost:3000/';

const withPrefix = (path: string) => resolve(urlPrefix, path);

const devConfig = {
  urlPrefix,
  logo: {
    main: withPrefix('/static/images/ourea_brand-main.svg'),
    primary: withPrefix('/static/images/ourea_brand-primary.svg'),
    secondary: withPrefix('/static/images/ourea_brand-secondary.svg'),
    transparent: withPrefix('/static/images/ourea_brand-transparent.svg'),
  },
  icon: {
    main: withPrefix('/static/images/ourea_icon-main.svg'),
    primary: withPrefix('/static/images/ourea_icon-primary.svg'),
    secondary: withPrefix('/static/images/ourea_icon-secondary.svg'),
    transparent: withPrefix('/static/images/ourea_icon-transparent.svg'),
  },
  avatar: {
    male: withPrefix('/static/images/ourea_avatar-male.svg'),
    female: withPrefix('/static/images/ourea_avatar-female.svg'),
    unkown: withPrefix('/static/images/ourea_avatar-unkown.svg'),
  },
  background: {
    signin: withPrefix('/static/images/ourea_bg.jpg'),
  }
};

const prodConfig = Object.assign({}, devConfig, {
  
});

export default dev ? devConfig : prodConfig;
